interface IconProps {
  name: "search" | "clear-filter";
  size?: number;
  className?: string;
}

const icons = {
  search: (size: number) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  // Lucide "filter-x" — embudo de filtro con una X arriba.
  "clear-filter": (size: number) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.013 3H2l8 9.46V19l4 2v-8.54l.9-1.055" />
      <path d="m22 3-5 5" />
      <path d="m17 3 5 5" />
    </svg>
  ),
};

export function Icon({ name, size = 14, className }: IconProps) {
  return (
    <span
      className={className}
      style={{ color: "var(--text-muted)", flexShrink: 0, display: "inline-flex" }}
    >
      {icons[name](size)}
    </span>
  );
}
