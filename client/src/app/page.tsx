"use client";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useProjectStore } from "@/store/project.store";
import API from "@/services/api";
import ProjectSidebar from "@/components/playground/ProjectSidebar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-dark.css";

export default function HomePage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { token, isLoggedIn } = useAuthStore();
  const { activeProject, updateActiveProject } = useProjectStore();

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (activeProject?.latestCode) {
      iframeRef.current?.contentWindow?.postMessage(
        activeProject.latestCode,
        "*"
      );
    }
  }, [activeProject]);

  const handleSubmit = async () => {
    if (!prompt || !token || !activeProject) return;
    setIsLoading(true);
    try {
      const { data: updatedProject } = await API.post(
        "/projects/generate",
        { prompt, projectId: activeProject._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateActiveProject(updatedProject);
      setPrompt("");
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isLoggedIn()) {
    return <div className="p-8">Please log in to continue.</div>;
  }

  return (
    <div className="h-[calc(100vh-65px)] overflow-y-auto">
      <div className="grid grid-cols-12 h-full gap-4 p-4">
        <div className="col-span-3 h-full overflow-hidden">
          <ProjectSidebar />
        </div>

        <div className="col-span-4 h-full flex flex-col">
          <div className="h-full bg-gray-900/50 rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-2 flex-shrink-0">Chat</h3>
            <div className="flex-1 min-h-0 mb-4 overflow-y-auto">
              <ScrollArea className="h-screen pr-2">
                <div className="space-y-4">
                  {activeProject?.chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg ${
                        msg.role === "user" ? "bg-blue-900/50" : ""
                      }`}
                    >
                      <p className="font-bold capitalize">{msg.role}</p>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Textarea
                placeholder="Describe the component..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !activeProject}
              >
                {isLoading ? "..." : "Send"}
              </Button>
            </div>
          </div>
        </div>

        <div className="col-span-5 h-full flex flex-col">
          <div className="h-full bg-gray-900/50 rounded-lg p-4 flex flex-col">
            <Tabs defaultValue="preview" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="tsx">TSX</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="flex-1 mt-2 min-h-0 overflow-y-auto">
                <div className="bg-white rounded-lg h-full">
                  <iframe
                    ref={iframeRef}
                    src="/sandbox.html"
                    title="Component Preview"
                    className="w-full h-full border-0 rounded-md"
                    sandbox="allow-scripts"
                  />
                </div>
              </TabsContent>

              <TabsContent value="tsx" className="flex-1 mt-2 min-h-0 overflow-y-auto">
                <ScrollArea className="h-full">
                  <div className="pr-2">
                    <Editor
                      value={activeProject?.latestCode.tsx || ""}
                      onValueChange={() => {}}
                      highlight={(code) => highlight(code, languages.tsx, "tsx")}
                      padding={10}
                      className="bg-gray-900 rounded-md text-sm min-h-full"
                      style={{ 
                        fontFamily: "monospace",
                        minHeight: "100%"
                      }}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="css" className="flex-1 mt-2 min-h-0 overflow-y-auto">
                <ScrollArea className="h-full">
                  <div className="pr-2">
                    <Editor
                      value={activeProject?.latestCode.css || ""}
                      onValueChange={() => {}}
                      highlight={(code) => highlight(code, languages.css, "css")}
                      padding={10}
                      className="bg-gray-900 rounded-md text-sm min-h-full"
                      style={{ 
                        fontFamily: "monospace",
                        minHeight: "100%"
                      }}
                    />
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}