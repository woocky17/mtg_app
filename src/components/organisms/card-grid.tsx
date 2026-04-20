"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardThumbnail } from "@/components/molecules/card-thumbnail";
import { CardModal } from "@/components/organisms/card-modal";
import { DeckToolbar } from "@/components/organisms/deck-toolbar";
import type { CardSummary } from "@/domain/card/card-types";
import {
  buildCardsUrl,
  type CardsUrlParams,
} from "@/app/cards/search-params";

interface CardGridProps {
  cards: CardSummary[];
  initialSelectedIndex: number | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  // Objeto plano serializable (no una función). CardGrid construye URLs
  // internamente vía `buildCardsUrl`.
  urlQuery: CardsUrlParams;
  emptyMessage?: string;
}

function clampIndex(idx: number | null, len: number): number | null {
  return idx !== null && idx >= 0 && idx < len ? idx : null;
}

/** Elimina `?selected=...` de la URL sin disparar un server round-trip. */
function clearSelectedParam() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (url.searchParams.has("selected")) {
    url.searchParams.delete("selected");
    window.history.replaceState(null, "", url.toString());
  }
}

export function CardGrid({
  cards,
  initialSelectedIndex,
  currentPage,
  totalPages,
  pageSize,
  urlQuery,
  emptyMessage = "No se encontraron cartas con estos filtros.",
}: CardGridProps) {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    clampIndex(initialSelectedIndex, cards.length),
  );
  const [addedCards, setAddedCards] = useState<Map<string, CardSummary>>(new Map());
  // Flag para evitar que un auto-repeat de ← / → dispare múltiples
  // `router.push` mientras un cross-page está en vuelo. Se baja cuando el
  // server commit trae props nuevas (sync block).
  const [isNavigating, setIsNavigating] = useState(false);

  // Cuando el server re-renderiza con una página distinta o con un nuevo
  // `initialSelectedIndex` (navegación cross-page desde el modal, o refresh
  // con `?selected=N`) sincronizamos el estado local. Patrón "reset on prop
  // change" vía useState, no useRef (sin violar react-hooks/refs).
  // IMPORTANTE: trackeamos también `currentPage` porque dos páginas distintas
  // pueden compartir `initialSelectedIndex=0` y el sync no se dispararía.
  const [lastPage, setLastPage] = useState(currentPage);
  const [lastInitial, setLastInitial] = useState<number | null>(initialSelectedIndex);
  if (lastPage !== currentPage || lastInitial !== initialSelectedIndex) {
    setLastPage(currentPage);
    setLastInitial(initialSelectedIndex);
    setSelectedIndex(clampIndex(initialSelectedIndex, cards.length));
    setIsNavigating(false);
  }

  if (cards.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {emptyMessage}
      </p>
    );
  }

  const toggleAdded = (card: CardSummary) => {
    setAddedCards((prev) => {
      const next = new Map(prev);
      if (next.has(card.id)) next.delete(card.id);
      else next.set(card.id, card);
      return next;
    });
  };

  const selected = selectedIndex !== null ? cards[selectedIndex] : null;
  const hasPrev =
    selectedIndex !== null && (selectedIndex > 0 || currentPage > 1);
  const hasNext =
    selectedIndex !== null &&
    (selectedIndex < cards.length - 1 || currentPage < totalPages);

  const goPrev = () => {
    if (selectedIndex === null) return;
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      return;
    }
    // Cruzamos a la página anterior: aterrizamos en su última carta. Las
    // páginas anteriores a `currentPage` son siempre completas, así que el
    // índice de la última es `pageSize - 1`.
    if (currentPage > 1 && !isNavigating) {
      setIsNavigating(true);
      router.push(
        buildCardsUrl(urlQuery, {
          page: String(currentPage - 1),
          selected: String(pageSize - 1),
        }),
        { scroll: false },
      );
    }
  };

  const goNext = () => {
    if (selectedIndex === null) return;
    if (selectedIndex < cards.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      return;
    }
    if (currentPage < totalPages && !isNavigating) {
      setIsNavigating(true);
      router.push(
        buildCardsUrl(urlQuery, {
          page: String(currentPage + 1),
          selected: "0",
        }),
        { scroll: false },
      );
    }
  };

  const handleClose = () => {
    setSelectedIndex(null);
    // Evita que un refresh posterior reabra el modal con la misma selección.
    // NOTA: NO tocamos `lastInitial` aquí. Si lo reseteásemos, el sync block
    // vería `lastInitial !== initialSelectedIndex` (porque el prop sigue con
    // el valor del último cross-page) y reabriría el modal en el siguiente
    // render. El sync se dispara solo cuando cambia `currentPage` o cuando el
    // prop `initialSelectedIndex` cambia — ambos implican navegación real.
    clearSelectedParam();
  };

  return (
    <>
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedIndex(index);
              }
            }}
            className="text-left outline-none"
          >
            <CardThumbnail
              card={card}
              added={addedCards.has(card.id)}
              onAdd={(e) => {
                e.stopPropagation();
                toggleAdded(card);
              }}
            />
          </div>
        ))}
      </div>
      {selected && (
        <CardModal
          card={selected}
          onClose={handleClose}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
      {addedCards.size > 0 && (
        <DeckToolbar
          cards={Array.from(addedCards.values())}
          onClear={() => setAddedCards(new Map())}
        />
      )}
    </>
  );
}
