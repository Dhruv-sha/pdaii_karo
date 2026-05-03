"use client";

export default function TrendChart({ points = [] }) {
  const safePoints = points.length
    ? points
    : [12, 18, 14, 20, 24, 19, 27, 22];

  const max = Math.max(...safePoints);
  const min = Math.min(...safePoints);
  const range = Math.max(max - min, 1);

  const path = safePoints
    .map((value, index) => {
      const x = (index / (safePoints.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Momentum
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            Weekly study trend
          </h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
          Last 8 sessions
        </span>
      </div>

      <div className="mt-6">
        <svg
          viewBox="0 0 100 100"
          className="h-24 w-full text-slate-500"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points={path}
          />
        </svg>
      </div>
    </div>
  );
}
