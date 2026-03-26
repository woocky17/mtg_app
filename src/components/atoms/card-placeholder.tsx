export function CardPlaceholder() {
  return (
    <div
      className="rounded-lg aspect-[63/88] transition-transform hover:-translate-y-1"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        cursor: "pointer",
      }}
    />
  );
}
