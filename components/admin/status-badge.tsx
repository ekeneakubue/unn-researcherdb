export const researchStatusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Recruiting: "bg-sky-100 text-sky-800",
  Completed: "bg-slate-100 text-slate-700",
  "Under review": "bg-amber-100 text-amber-800",
};

export const availabilityStyles: Record<string, string> = {
  Available: "bg-emerald-100 text-emerald-800",
  "In use": "bg-amber-100 text-amber-800",
  Maintenance: "bg-rose-100 text-rose-800",
};

export const researcherStatusStyles: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Suspended: "bg-rose-100 text-rose-800",
};

export const userStatusStyles = researcherStatusStyles;

export function StatusBadge({
  label,
  styles,
}: {
  label: string;
  styles: Record<string, string>;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[label] ?? "bg-slate-100 text-slate-700"}`}
    >
      {label}
    </span>
  );
}
