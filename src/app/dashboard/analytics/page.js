"use client";

import { useEffect, useState } from "react";
import TopicChart from "@/components/analytics/TopicChart";
import TrendChart from "@/components/analytics/TrendChart";
import Card from "@/components/ui/Card";
import { useProject } from "@/context/ProjectContext";

export default function AnalyticsPage() {
  const { projectId } = useProject();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    if (!projectId) return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/importance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.error || "Analytics failed");
      }

      setData(payload);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Analytics failed");
      setStatus("idle");
    }
  };

  // Auto-load whenever the selected project changes
  useEffect(() => {
    loadAnalytics();
  }, [projectId]);

  const coverage = data?.coverage || { covered: [], weak: [], missing: [] };
  const trendPoints = data?.rankedTopics?.slice(0, 8).map(t => t.score);

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-medium text-slate-600">
          {projectId ? `Showing insights for project: ${projectId}` : "Select a project from the header dropdown"}
        </div>
        <button
          onClick={loadAnalytics}
          disabled={status === "loading" || !projectId}
          className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {status === "loading" ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 text-red-600 p-4 text-sm border border-red-200">{error}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4 border-slate-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Exam Probability</h3>
            <p className="text-sm text-slate-500 mt-1">Topics ranked by frequency and coverage weight.</p>
          </div>
          <TopicChart topics={data?.rankedTopics || []} />
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Focus Trend</h3>
            <TrendChart points={trendPoints} />
          </Card>
          <Card className="space-y-3 border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Coverage Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3">
                <span className="text-teal-700 font-medium">✅ Covered topics</span>
                <span className="font-bold text-teal-800">{coverage.covered.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                <span className="text-amber-700 font-medium">⚠️ Weak topics</span>
                <span className="font-bold text-amber-800">{coverage.weak.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3">
                <span className="text-red-700 font-medium">❌ Missing topics</span>
                <span className="font-bold text-red-800">{coverage.missing.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
