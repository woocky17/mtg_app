import Link from "next/link";

interface PageButtonProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

export function PageButton({ href, active = false, children }: PageButtonProps) {
  return (
    <Link
      href={href}
      className="px-3 py-1 rounded text-xs"
      style={{
        background: active ? "var(--accent)" : "var(--surface-2)",
        border: "1px solid var(--border)",
        color: active ? "#0d0d10" : "var(--text-secondary)",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </Link>
  );
}
