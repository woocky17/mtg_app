import { Icon } from "@/components/atoms/icon";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  name?: string;
}

export function SearchBar({
  placeholder = "Buscar carta, set, tipo...",
  defaultValue,
  name,
}: SearchBarProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 rounded-md"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        height: "38px",
      }}
    >
      <Icon name="search" />
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="flex-1 bg-transparent text-sm outline-none"
        style={{ color: "var(--text-primary)" }}
      />
    </div>
  );
}
