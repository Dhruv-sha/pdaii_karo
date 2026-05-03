"use client";

import { useEffect, useState } from "react";
import TopicChart from "@/components/analytics/TopicChart";
import TrendChart from "@/components/analytics/TrendChart";
import Card from "@/components/ui/Card";
import { useProject } from "@/context/ProjectContext";

export default function Dashboard() {
  const { projectId } = useProject();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const loadImportance = async () => {
    setStatus("loading");
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/importance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!res.ok) {
        let errorMsg = "Importance failed";
        try {
          const errorPayload = await res.json();
          errorMsg = errorPayload.error || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${res.status}`;
        }
        throw new Error(errorMsg);
      }

      let payload;
      try {
        payload = await res.json();
      } catch (e) {
        throw new Error("Invalid format from server");
      }
      setData(payload);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Importance failed");
      setStatus("idle");
    }
  };

  useEffect(() => {
    loadImportance();
  }, []);

  const coverage = data?.coverage || {
    covered: [],
    weak: [],
    missing: [],
  };
  const totalTopics =
    (coverage.covered?.length || 0) +
    (coverage.weak?.length || 0) +
    (coverage.missing?.length || 0);
  const topTopic = data?.rankedTopics?.[0];
  const trendPoints = data?.rankedTopics
    ?.slice(0, 8)
    .map(topic => topic.score);

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
        <div className="text-sm font-medium text-slate-600">
          {projectId ? `Showing insights for project: ${projectId}` : "Select a project from the header dropdown"}
        </div>
        <button
          onClick={loadImportance}
          disabled={status === "loading" || !projectId}
          className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {status === "loading" ? "Analyzing..." : "Refresh Insights"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-50 text-red-600 p-4 text-sm border border-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 border-slate-200 shadow-sm hover:shadow-md transition">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            Priority Topic
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {topTopic?.topic || "Waiting for data"}
          </p>
          <p className="text-sm text-slate-500">
            {topTopic
              ? `Highest exam probability (Score: ${topTopic.score})`
              : "Upload documents to unlock insights."}
          </p>
        </Card>

        <Card className="space-y-2 border-slate-200 shadow-sm hover:shadow-md transition">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
            Syllabus Coverage
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {totalTopics ? `${coverage.covered.length} of ${totalTopics}` : "--"}
          </p>
          <p className="text-sm text-slate-500">
            {totalTopics
              ? "Topics found in past papers"
              : "Coverage updates after analysis."}
          </p>
        </Card>

        <Card className="space-y-2 border-slate-200 shadow-sm hover:shadow-md transition">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            What to do next
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {coverage.missing.length ? "Review blind spots" : "You're all set"}
          </p>
          <p className="text-sm text-slate-500">
            {coverage.missing.length
              ? `${coverage.missing.length} important topics need attention.`
              : "You are staying on track with your study plan."}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-4 border-slate-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Exam Probability
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Topics sorted by how often they show up in past papers and their overall weight.
            </p>
          </div>
          <TopicChart topics={data?.rankedTopics || []} />
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Focus Trend
            </h3>
          </div>
          <TrendChart points={trendPoints} />
        </Card>
      </div>
    </div>
  );
}