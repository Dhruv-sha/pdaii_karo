"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projectId, setProjectId] = useState("");
  const [projectIds, setProjectIds] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Fetch all available project IDs from the DB
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjectIds(data.projectIds || []);
          // Auto-select first project if none selected
          if (!projectId && data.projectIds?.length > 0) {
            setProjectId(data.projectIds[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId, projectIds, loadingProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within a ProjectProvider");
  return ctx;
}
