import Card from "@/components/ui/Card";

function formatDuration(hrs) {
  if (!hrs || isNaN(hrs)) return "—";
  const minutes = Math.round(hrs * 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function StudyPlan({ schedule }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {schedule.map(day => (
        <Card key={day.day} className="p-5 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              Day {day.day}
            </h3>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
              {day.plan.length} session{day.plan.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-3 border-l-2 border-slate-100 pl-4">
            {day.plan.map((p, i) => (
              <div key={i} className="relative flex items-center justify-between">
                <span className="absolute -left-[1.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-teal-400 ring-2 ring-white" />
                <span className="text-sm text-slate-700">{p.topic}</span>
                <span className="ml-4 flex-shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {formatDuration(p.duration)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}