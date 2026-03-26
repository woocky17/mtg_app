import { CardThumbnail } from "@/components/molecules/card-thumbnail";
import type { CardSummary } from "@/domain/card/card-types";

interface CardGridProps {
  cards: CardSummary[];
  emptyMessage?: string;
}

export function CardGrid({
  cards,
  emptyMessage = "No se encontraron cartas con estos filtros.",
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
    >
      {cards.map((card) => (
        <CardThumbnail key={card.id} card={card} />
      ))}
    </div>
  );
}
