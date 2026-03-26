import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

interface HeaderProps {
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
}

export function Header({ navItems, rightContent }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 shrink-0"
      style={{
        height: "52px",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface-1)",
      }}
    >
      <Link
        href="/"
        className="text-sm font-semibold tracking-widest uppercase"
        style={{ color: "var(--accent)", letterSpacing: "0.18em" }}
      >
        MTG
      </Link>
      {navItems && (
        <div className="flex items-center gap-1">
          {navItems.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-1 rounded text-sm transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
      {rightContent && (
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {rightContent}
        </span>
      )}
    </header>
  );
}
