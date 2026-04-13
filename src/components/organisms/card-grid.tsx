"use client";

import { useState } from "react";
import { CardThumbnail } from "@/components/molecules/card-thumbnail";
import { CardModal } from "@/components/organisms/card-modal";
import type { CardSummary } from "@/domain/card/card-types";

interface CardGridProps {
  cards: CardSummary[];
  emptyMessage?: string;
}

export function CardGrid({
  cards,
  emptyMessage = "No se encontraron cartas con estos filtros.",
}: CardGridProps) {
  const [selected, setSelected] = useState<CardSummary | null>(null);

  if (cards.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelected(card)}
            className="text-left"
          >
            <CardThumbnail card={card} />
          </button>
        ))}
      </div>
      {selected && <CardModal card={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
