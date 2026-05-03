"use client";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import { ProjectProvider } from "@/context/ProjectContext";

export default function DashboardLayout({ children }) {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <aside className="w-full border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
            <Sidebar />
          </aside>

          <main className="flex-1">
            <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 backdrop-blur md:px-10">
              <Header />
            </div>
            <div className="px-6 py-8 md:px-10 md:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}