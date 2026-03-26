interface ManaCurveProps {
  values: number[];
  labels: (string | number)[];
}

export function ManaCurve({ values, labels }: ManaCurveProps) {
  const max = Math.max(...values, 1);

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: "40px" }}>
        {values.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${(h / max) * 100}%`,
              background: "var(--surface-3)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {labels.map((n) => (
          <span
            key={n}
            className="flex-1 text-center"
            style={{ fontSize: "9px", color: "var(--text-muted)" }}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}
