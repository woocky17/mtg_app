import type { SelectHTMLAttributes } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  options,
  placeholder,
  className = "",
  style,
  defaultValue,
  value,
  ...props
}: SelectProps) {
  const current = value !== undefined ? value : defaultValue;
  const hasValue = current !== undefined && current !== "";

  const controlled = value !== undefined;

  return (
    <select
      className={`px-3 py-1.5 rounded text-sm outline-none ${className}`}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: hasValue ? "var(--text-primary)" : "var(--text-muted)",
        ...style,
      }}
      {...(controlled ? { value } : { defaultValue })}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
