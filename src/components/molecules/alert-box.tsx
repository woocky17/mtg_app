import type { ReactNode } from "react";

interface AlertBoxProps {
  children: ReactNode;
  showIcon?: boolean;
}

export function AlertBox({ children, showIcon = true }: AlertBoxProps) {
  return (
    <div
      className="rounded-lg p-4 text-sm"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      {showIcon ? "⚠️ " : null}
      {children}
    </div>
  );
}
