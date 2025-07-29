const { GoogleGenAI } = require("@google/genai"); 
const Project = require("../models/project.model");
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const createProject = async (req, res) => {
  try {
    const project = new Project({
      user: req.user._id,
      name: req.body.name || 'Untitled Project',
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const generateComponent = async (req, res) => {
  const { projectId, prompt } = req.body;

  if (!projectId || !prompt) {
    return res.status(400).json({ message: 'Project ID and prompt are required' });
  }

  const project = await Project.findById(projectId);
  if (!project || project.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const fullPrompt = `You are an expert React developer. Your task is to generate a single, self-contained React component based on the user's request.
  - You must provide the code in two separate parts: TSX and CSS.
  - The TSX code should be functional and use modern React practices (hooks).
  - The CSS should be clean and correspond to the component's structure.
  - Do NOT use import/export statements. Instead, use React directly from the global scope.
  - The component must be assigned to a variable named 'MyComponent'.
  - Do not include any explanatory text, only the raw code blocks.

  Format your response exactly like this:
  \`\`\`tsx
  const MyComponent = () => {
    return (
      <div className="my-component">
        <h1>Hello World</h1>
      </div>
    );
  };
  \`\`\`

  \`\`\`css
  .my-component {
    padding: 20px;
    border-radius: 8px;
    background-color: #f0f0f0;
  }
  \`\`\`

  USER PROMPT: ${prompt}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });

    const content = response.text;

    const tsxMatch = content.match(/```tsx\s*([\s\S]*?)```/);
    const cssMatch = content.match(/```css\s*([\s\S]*?)```/);
    const tsx = tsxMatch ? tsxMatch[1].trim() : "";
    const css = cssMatch ? cssMatch[1].trim() : "";

    project.chatHistory.push({ role: 'user', content: prompt });
    project.chatHistory.push({ role: 'ai', content: content });
    project.latestCode = { tsx, css };
    
    if (project.name === 'Untitled Project' && project.chatHistory.length === 2) {
      project.name = prompt.substring(0, 30); // Use first 30 chars of prompt as name
    }
    
    const updatedProject = await project.save();
    
    res.json(updatedProject);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ message: "Failed to generate component" });
  }
};

module.exports = { createProject, getProjects, generateComponent };
