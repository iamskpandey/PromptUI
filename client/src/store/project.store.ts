import { create } from "zustand";
import API from "@/services/api";

interface Project {
  _id: string;
  name: string;
  chatHistory: { role: "user" | "ai"; content: string }[];
  latestCode: { tsx: string; css: string };
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  activeProject: Project | null;
  fetchProjects: (token: string) => Promise<void>;
  createProject: (token: string) => Promise<void>;
  setActiveProject: (projectId: string | null) => void;
  updateActiveProject: (updatedProject: Project) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  activeProject: null,

  fetchProjects: async (token) => {
    const { data } = await API.get("/projects", {
      headers: { Authorization: `Bearer ${token}` },
    });
    set({ projects: data });
  },

  createProject: async (token) => {
    const { data: newProject } = await API.post(
      "/projects",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProject: newProject,
    }));
  },

  setActiveProject: (projectId) => {
    if (!projectId) {
      set({ activeProject: null });
      return;
    }
    const project = get().projects.find((p) => p._id === projectId);
    set({ activeProject: project || null });
  },

  updateActiveProject: (updatedProject) => {
    set((state) => ({
      activeProject: updatedProject,
      projects: state.projects.map((p) =>
        p._id === updatedProject._id ? updatedProject : p
      ),
    }));
  },
}));
