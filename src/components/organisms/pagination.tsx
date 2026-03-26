import { PageButton } from "@/components/molecules/page-button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  buildUrl: (overrides: { page: string }) => string;
}

export function Pagination({ currentPage, totalPages, total, buildUrl }: PaginationProps) {
  return (
    <div
      className="flex items-center justify-between px-6 py-3 shrink-0"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface-1)" }}
    >
      <span className="text-xs" style={{ color: "var(--text-muted)" }}>
        Página {currentPage} de {totalPages} · {total.toLocaleString("es")} cartas
      </span>

      <div className="flex items-center gap-1">
        {currentPage > 1 && (
          <PageButton href={buildUrl({ page: "1" })}>«</PageButton>
        )}
        {currentPage > 1 && (
          <PageButton href={buildUrl({ page: String(currentPage - 1) })}>
            ‹ Anterior
          </PageButton>
        )}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
          const p = start + i;
          return (
            <PageButton
              key={p}
              href={buildUrl({ page: String(p) })}
              active={p === currentPage}
            >
              {p}
            </PageButton>
          );
        })}
        {currentPage < totalPages && (
          <PageButton href={buildUrl({ page: String(currentPage + 1) })}>
            Siguiente ›
          </PageButton>
        )}
        {currentPage < totalPages && (
          <PageButton href={buildUrl({ page: String(totalPages) })}>»</PageButton>
        )}
      </div>
    </div>
  );
}
