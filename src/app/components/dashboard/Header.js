"use client";

import { usePathname } from "next/navigation";
import { useProject } from "@/context/ProjectContext";

const titles = {
  "/dashboard": { title: "Overview", desc: "Your progress and top priorities at a glance." },
  "/dashboard/upload": { title: "Upload Materials", desc: "Add syllabus and past papers to generate insights." },
  "/dashboard/analytics": { title: "Insights", desc: "Deep dive into topic frequency and coverage." },
  "/dashboard/planner": { title: "Study Plan", desc: "Your personalized timeline and roadmap." },
  "/dashboard/practice/chat": { title: "AI Chat", desc: "Ask your AI tutor anything about your uploaded material." },
  "/dashboard/practice/quiz": { title: "Quiz", desc: "Test yourself with AI-generated MCQs from your syllabus." },
};

export default function Header() {
  const pathname = usePathname();
  const { projectId, setProjectId, projectIds, loadingProjects } = useProject();

  const matchedRoute = Object.keys(titles)
    .sort((a, b) => b.length - a.length)
    .find(route => pathname.startsWith(route));
  const current = titles[matchedRoute] || titles["/dashboard"];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">
          {current.title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {current.desc}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Project Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <svg className="h-4 w-4 text-teal-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          {loadingProjects ? (
            <span className="text-sm text-slate-400">Loading...</span>
          ) : projectIds.length === 0 ? (
            <span className="text-sm text-slate-400 italic">No projects yet</span>
          ) : (
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="text-sm font-medium text-slate-700 bg-transparent border-none outline-none cursor-pointer pr-1"
            >
              {projectIds.map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
          )}
        </div>


      </div>
    </div>
  );
}