"use client";

const barWidths = [
  "w-[10%]",
  "w-[20%]",
  "w-[30%]",
  "w-[40%]",
  "w-[50%]",
  "w-[60%]",
  "w-[70%]",
  "w-[80%]",
  "w-[90%]",
  "w-full",
];

export default function TopicChart({ topics }) {
  if (!topics || topics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
        No topic scores yet. Run analysis after uploading a syllabus and question set.
      </div>
    );
  }

  const maxScore = Math.max(...topics.map(t => t.score || 0), 1);

  return (
    <div className="space-y-4">
      {topics.slice(0, 8).map(topic => {
        const ratio = (topic.score || 0) / maxScore;
        const index = Math.min(
          barWidths.length - 1,
          Math.floor(ratio * (barWidths.length - 1))
        );
        const widthClass = barWidths[index];

        return (
          <div key={topic.topic} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-800">
                {topic.topic}
              </span>
              <span className="text-xs text-slate-500">{topic.score}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full bg-slate-900/80 transition ${widthClass}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}