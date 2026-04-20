import Link from "next/link";

interface EmptyDecksStateProps {
  padding?: 6 | 8;
}

export function EmptyDecksState({ padding = 6 }: EmptyDecksStateProps) {
  return (
    <div
      className={`rounded-lg ${padding === 8 ? "p-8" : "p-6"} text-center text-sm`}
      style={{
        background: "var(--surface-1)",
        border: "1px dashed var(--border)",
        color: "var(--text-muted)",
      }}
    >
      Aún no has creado ningún mazo.{" "}
      <Link
        href="/cards"
        className="underline"
        style={{ color: "var(--accent)" }}
      >
        Empieza explorando cartas
      </Link>
      .
    </div>
  );
}
