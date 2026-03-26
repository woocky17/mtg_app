import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  width?: string;
}

export function Input({ width, className = "", style, ...props }: InputProps) {
  return (
    <input
      className={`px-3 py-1.5 rounded text-sm outline-none ${className}`}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        width,
        ...style,
      }}
      {...props}
    />
  );
}
