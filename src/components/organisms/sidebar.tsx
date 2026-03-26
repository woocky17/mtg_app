import { StatBlock } from "@/components/molecules/stat-block";
import { ManaCurve } from "@/components/molecules/mana-curve";
import { Badge } from "@/components/atoms/badge";

export function Sidebar() {
  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: "280px",
        borderLeft: "1px solid var(--border)",
        background: "var(--surface-1)",
      }}
    >
      {/* Header */}
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

      {/* Stats */}
      <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex justify-between mb-3">
          <StatBlock label="Cartas" value="0" />
          <StatBlock label="Tierra" value="0" />
          <StatBlock label="CMC avg" value="—" />
        </div>
        <ManaCurve
          values={[3, 6, 9, 7, 4, 2, 1]}
          labels={[1, 2, 3, 4, 5, 6, "7+"]}
        />
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          No hay cartas en el mazo.
        </p>
      </div>

      {/* Format */}
      <div
        className="px-5 py-3 shrink-0 flex items-center gap-2"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <Badge>Standard</Badge>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>60 cartas mín.</span>
      </div>
    </aside>
  );
}
