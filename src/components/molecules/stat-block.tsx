interface StatBlockProps {
  label: string;
  value: string;
}

export function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="text-center">
      <div
        className="text-lg font-semibold"
        style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}
