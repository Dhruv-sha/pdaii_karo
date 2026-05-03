"use client";

import { useState, useEffect } from "react";
import StudyPlan from "@/components/planner/StudyPlan";
import Card from "@/components/ui/Card";
import { useProject } from "@/context/ProjectContext";

export default function PlannerPage() {
  const { projectId } = useProject();
  const [days, setDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [schedule, setSchedule] = useState(null);
  const [status, setStatus] = useState("idle");
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [error, setError] = useState("");

  // Load the most recent saved plan whenever the project changes
  useEffect(() => {
    if (!projectId) return;
    setSchedule(null);
    setError("");
    loadExistingPlan();
  }, [projectId]);

  const loadExistingPlan = async () => {
    setLoadingExisting(true);
    try {
      const res = await fetch(`/api/planner?projectId=${encodeURIComponent(projectId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.schedule) {
          setSchedule(data.schedule);
          if (data.days) setDays(data.days);
          if (data.hoursPerDay) setHoursPerDay(data.hoursPerDay);
        }
      }
    } catch (_) {}
    finally { setLoadingExisting(false); }
  };

  const buildPlan = async () => {
    if (!projectId) return;
    setStatus("loading");
    setError("");
    setSchedule(null);

    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          days: Number(days),
          hoursPerDay: Number(hoursPerDay),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Planner failed");

      setSchedule(data.schedule);
      setStatus("idle");
    } catch (err) {
      setError(err.message || "Planner failed");
      setStatus("idle");
    }
  };

  return (
    <div className="space-y-8">
      {/* Config Card */}
      <Card className="border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Build a Study Plan</h3>
            <p className="text-sm text-slate-500 mt-1">
              {projectId
                ? `Generating plan for: ${projectId}`
                : "Select a project from the header dropdown first"}
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <label className="text-sm font-medium text-slate-700">
              Study Days
              <input
                type="number"
                min="1"
                max="60"
                value={days}
                onChange={e => setDays(e.target.value)}
                className="mt-1 block w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Hours / Day
              <input
                type="number"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={e => setHoursPerDay(e.target.value)}
                className="mt-1 block w-24 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </label>

            <button
              onClick={buildPlan}
              disabled={status === "loading" || !projectId}
              className="rounded-xl bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {status === "loading" ? "Building..." : "Generate Plan"}
            </button>
          </div>
        </div>

        {!projectId && (
          <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
            ⚠️ Select a project from the dropdown in the header to generate a study plan.
          </div>
        )}
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
          {error === "Run importance engine first"
            ? "⚠️ Please go to the Overview page first and click \"Refresh Insights\" to run the analysis engine before building a plan."
            : error}
        </div>
      )}

      {loadingExisting && (
        <div className="text-sm text-slate-400 text-center py-8 animate-pulse">Loading your saved plan...</div>
      )}

      {schedule ? (
        <div>
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <svg className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Study plan loaded — {schedule.length} days scheduled
          </div>
          <StudyPlan schedule={schedule} />
        </div>
      ) : !loadingExisting && projectId && status === "idle" && !error ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-sm text-slate-500">
          <svg className="mx-auto mb-3 h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          No saved plan found for this project. Configure your preferences above and click "Generate Plan".
        </div>
      ) : null}
    </div>
  );
}
