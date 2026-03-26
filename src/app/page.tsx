import Link from "next/link";

export default function Home() {
  const navItems = [
    { label: "Cartas", href: "/cards" },
    { label: "Mazos",  href: "#" },
    { label: "Colección", href: "#" },
  ];

  return (
    <div className="flex h-full" style={{ background: "var(--surface-0)" }}>

      {/* Main area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 shrink-0"
          style={{
            height: "52px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-1)",
          }}
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "var(--accent)", letterSpacing: "0.18em" }}
          >
            MTG
          </span>
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
        </header>

        {/* Search bar */}
        <div
          className="px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="flex items-center gap-3 px-4 rounded-md"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              height: "38px",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Buscar carta, set, tipo..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        {/* Card grid placeholder */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg aspect-[63/88] transition-transform hover:-translate-y-1"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Right sidebar */}
      <aside
        className="flex flex-col shrink-0"
        style={{
          width: "280px",
          borderLeft: "1px solid var(--border)",
          background: "var(--surface-1)",
        }}
      >
        {/* Sidebar header */}
        <div
          className="px-5 flex items-center justify-between shrink-0"
          style={{
            height: "52px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Mazo activo
          </span>
          <button
            className="text-xs px-2 py-1 rounded"
            style={{
              background: "var(--surface-3)",
              color: "var(--accent)",
              border: "1px solid var(--border)",
            }}
          >
            + Nuevo
          </button>
        </div>

        {/* Deck stats */}
        <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex justify-between mb-3">
            {[
              { label: "Cartas", value: "0" },
              { label: "Tierra", value: "0" },
              { label: "CMC avg", value: "—" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-lg font-semibold" style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                  {value}
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Mana curve placeholder */}
          <div className="flex items-end gap-1" style={{ height: "40px" }}>
            {[3, 6, 9, 7, 4, 2, 1].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${(h / 9) * 100}%`,
                  background: "var(--surface-3)",
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {[1, 2, 3, 4, 5, 6, "7+"].map((n) => (
              <span key={n} className="flex-1 text-center" style={{ fontSize: "9px", color: "var(--text-muted)" }}>
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Card list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            No hay cartas en el mazo.
          </p>
        </div>

        {/* Format badge */}
        <div
          className="px-5 py-3 shrink-0 flex items-center gap-2"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--surface-3)",
              color: "var(--accent-dim)",
              border: "1px solid var(--border)",
            }}
          >
            Standard
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>60 cartas mín.</span>
        </div>
      </aside>
    </div>
  );
}
