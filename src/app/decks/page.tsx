import Link from "next/link";
import { Header } from "@/components/organisms/header";
import { MainLayout } from "@/components/templates/main-layout";
import { AlertBox } from "@/components/molecules/alert-box";
import { DeckList } from "@/components/molecules/deck-list";
import { EmptyDecksState } from "@/components/molecules/empty-decks-state";
import { getDecksUseCase } from "@/infrastructure/container";
import type { DeckSummary } from "@/domain/deck/deck-types";
import { NAV_ITEMS } from "@/lib/nav-items";
import { getErrorMessage } from "@/lib/get-error-message";

export default async function DecksPage() {
  let decks: DeckSummary[] = [];
  let error: string | null = null;
  try {
    decks = await getDecksUseCase.execute();
  } catch (e) {
    error = getErrorMessage(e, "Error cargando mazos");
  }

  return (
    <MainLayout
      header={
        <Header
          navItems={NAV_ITEMS}
          rightContent={`${decks.length} ${decks.length === 1 ? "mazo" : "mazos"}`}
        />
      }
    >
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-10">
          <div className="flex items-baseline justify-between">
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Mazos
            </h1>
            <Link
              href="/cards"
              className="rounded px-3 py-1.5 text-sm font-medium"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              + Crear mazo
            </Link>
          </div>

          {error && <AlertBox>{error}</AlertBox>}

          {!error && decks.length === 0 && <EmptyDecksState padding={8} />}

          {decks.length > 0 && <DeckList decks={decks} showUpdatedLabel />}
        </div>
      </div>
    </MainLayout>
  );
}
