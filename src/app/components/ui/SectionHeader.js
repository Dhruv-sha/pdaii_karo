export default function SectionHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 font-serif">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
