import { getCardsUseCase } from "@/infrastructure/container";
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

  const result = await getCardsUseCase.execute(filters, { page, pageSize: PAGE_SIZE });

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
      <FilterBar name={name} type={type} set={set} color={color} rarity={rarity} />
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
