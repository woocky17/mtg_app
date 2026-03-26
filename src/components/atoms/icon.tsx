interface IconProps {
  name: "search";
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
