"use client";
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useProjectStore } from '@/store/project.store';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ProjectSidebar() {
  const token = useAuthStore(state => state.token);
  const { projects, activeProject, fetchProjects, createProject, setActiveProject } = useProjectStore();

  useEffect(() => {
    if (token) {
      fetchProjects(token);
    }
  }, [token, fetchProjects]);

  const handleCreateProject = async () => {
    if (token) await createProject(token);
  };

  return (
    <div className="bg-gray-900/50 p-4 flex flex-col gap-4 h-full border-r">
      <Button onClick={handleCreateProject} className="w-full flex justify-center gap-2">
        <PlusCircle size={16} /> New Project
      </Button>
      <nav className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Recent</h3>
        {projects.map(project => (
          <button 
            key={project._id}
            onClick={() => setActiveProject(project._id)}
            className={`w-full text-left text-sm p-2 rounded-md truncate ${
              activeProject?._id === project._id ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            {project.name}
          </button>
        ))}
      </nav>
    </div>
  );
}