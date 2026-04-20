import { getCardsUseCase, getSetsUseCase } from "@/infrastructure/container";
import { Header } from "@/components/organisms/header";
import { FilterBar } from "@/components/organisms/filter-bar";
import { CardGrid } from "@/components/organisms/card-grid";
import { Pagination } from "@/components/organisms/pagination";
import { DbErrorState } from "@/components/organisms/db-error-state";
import { MainLayout } from "@/components/templates/main-layout";
import { NAV_ITEMS } from "@/lib/nav-items";
import {
  buildCardsUrl,
  parseCardsQuery,
  type RawSearchParams,
} from "./search-params";

const PAGE_SIZE = 100;

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const query = parseCardsQuery(await searchParams);
  const { filters, page } = query;

  let result;
  let sets;
  try {
    [result, sets] = await Promise.all([
      getCardsUseCase.execute(filters, { page, pageSize: PAGE_SIZE }),
      getSetsUseCase.execute(query.includeExtras),
    ]);
  } catch (error) {
    return (
      <MainLayout header={<Header navItems={NAV_ITEMS} />}>
        <DbErrorState error={error} />
      </MainLayout>
    );
  }

  const buildUrl = (overrides: { page?: string; selected?: string | null }) =>
    buildCardsUrl(query, overrides);

  return (
    <MainLayout
      header={
        <Header
          navItems={NAV_ITEMS}
          rightContent={`${result.total.toLocaleString("es")} cartas encontradas`}
        />
      }
    >
      <FilterBar
        name={query.name}
        type={query.type}
        set={query.set}
        colors={query.colors}
        colorMode={query.colorMode}
        rarity={query.rarity}
        includeExtras={query.includeExtras}
        sets={sets}
      />
      <div className="flex-1 overflow-y-auto p-6">
        <CardGrid
          cards={result.items}
          initialSelectedIndex={query.selected}
          currentPage={result.page}
          totalPages={result.totalPages}
          pageSize={PAGE_SIZE}
          urlQuery={query}
        />
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
