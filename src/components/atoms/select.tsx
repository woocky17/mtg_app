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
  ...props
}: SelectProps) {
  const hasValue = defaultValue !== undefined && defaultValue !== "";

  return (
    <select
      className={`px-3 py-1.5 rounded text-sm outline-none ${className}`}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: hasValue ? "var(--text-primary)" : "var(--text-muted)",
        ...style,
      }}
      defaultValue={defaultValue}
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
