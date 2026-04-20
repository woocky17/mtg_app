import type { DeckSummary } from "@/domain/deck/deck-types";
import { formatDate } from "@/lib/format-date";

interface DeckListProps {
  decks: DeckSummary[];
  showUpdatedLabel?: boolean;
}

export function DeckList({ decks, showUpdatedLabel = false }: DeckListProps) {
  return (
    <ul
      className="overflow-hidden rounded-lg"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      {decks.map((deck) => (
        <li
          key={deck.id}
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {deck.name}
            </p>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              {deck.cardCount} {deck.cardCount === 1 ? "carta" : "cartas"} ·{" "}
              {showUpdatedLabel ? "actualizado " : ""}
              {formatDate(deck.updatedAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
