import { getCardsUseCase, getSetsUseCase } from "@/infrastructure/container";
import { Header } from "@/components/organisms/header";
import { FilterBar } from "@/components/organisms/filter-bar";
import { CardGrid } from "@/components/organisms/card-grid";
import { Pagination } from "@/components/organisms/pagination";
import { MainLayout } from "@/components/templates/main-layout";
import type { CardFilters } from "@/domain/card/card-filters";

const PAGE_SIZE = 100;

interface SearchParams {
  page?: string;
  name?: string;
  color?: string;
  rarity?: string;
  type?: string;
  set?: string;
}

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page   = Math.max(1, parseInt(params.page  ?? "1", 10));
  const name   = params.name?.trim()   ?? "";
  const color  = params.color?.trim()  ?? "";
  const rarity = params.rarity?.trim() ?? "";
  const type   = params.type?.trim()   ?? "";
  const set    = params.set?.trim()    ?? "";

  const filters: CardFilters = {};
  if (name) filters.name = name;
  if (color) filters.color = color;
  if (rarity) filters.rarity = rarity;
  if (type) filters.type = type;
  if (set) filters.set = set;

  let result;
  let sets;
  try {
    [result, sets] = await Promise.all([
      getCardsUseCase.execute(filters, { page, pageSize: PAGE_SIZE }),
      getSetsUseCase.execute(),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isConnectionError =
      message.includes("Can't reach database server") ||
      message.includes("ECONNREFUSED") ||
      message.includes("P1001") ||
      message.includes("P1002");

    return (
      <MainLayout header={<Header />}>
        <div className="flex flex-1 items-center justify-center p-6">
          <div
            className="max-w-lg rounded-lg border p-8 text-center"
            style={{
              background: "var(--surface-1)",
              borderColor: "var(--border)",
            }}
          >
            <div className="mb-4 text-5xl">🔌</div>
            <h2
              className="mb-2 text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {isConnectionError
                ? "No hay conexión con la base de datos"
                : "Algo ha ido mal"}
            </h2>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              {isConnectionError
                ? "Comprueba que el contenedor de PostgreSQL está levantado."
                : "No se han podido cargar las cartas."}
            </p>
            {isConnectionError && (
              <pre
                className="rounded px-3 py-2 text-left text-sm"
                style={{
                  background: "var(--surface-2)",
                  color: "var(--text-muted)",
                }}
              >
                docker compose -f docker/docker-compose.yml up -d
              </pre>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  function buildUrl(overrides: { page: string }) {
    const p: Record<string, string> = {};
    if (name)   p.name   = name;
    if (color)  p.color  = color;
    if (rarity) p.rarity = rarity;
    if (type)   p.type   = type;
    if (set)    p.set    = set;
    p.page = String(page);
    Object.assign(p, overrides);
    if (p.page === "1") delete p.page;
    return "/cards?" + new URLSearchParams(p).toString();
  }

  return (
    <MainLayout
      header={
        <Header rightContent={`${result.total.toLocaleString("es")} cartas encontradas`} />
      }
    >
      <FilterBar name={name} type={type} set={set} color={color} rarity={rarity} sets={sets} />
      <div className="flex-1 overflow-y-auto p-6">
        <CardGrid cards={result.items} />
      </div>
      <Pagination
        currentPage={result.page}
        totalPages={result.totalPages}
        total={result.total}
        buildUrl={buildUrl}
      />
    </MainLayout>
  );
}
