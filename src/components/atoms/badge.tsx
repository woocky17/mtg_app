interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export function Badge({ children, color, className = "" }: BadgeProps) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded ${className}`}
      style={{
        background: "var(--surface-3)",
        border: "1px solid var(--border)",
        color: color ?? "var(--accent-dim)",
      }}
    >
      {children}
    </span>
  );
}
