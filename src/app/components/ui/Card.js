export default function Card({ children, className = "" }) {
  const classes = [
    "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
