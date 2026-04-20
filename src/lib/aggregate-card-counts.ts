import type { CardSummary } from "@/domain/card/card-types";

export interface AggregatedCard {
  cardId: string;
  count: number;
  card: CardSummary;
}

export function aggregateCardCounts(cards: CardSummary[]): AggregatedCard[] {
  const counts = new Map<string, AggregatedCard>();
  for (const card of cards) {
    const existing = counts.get(card.id);
    if (existing) existing.count += 1;
    else counts.set(card.id, { cardId: card.id, count: 1, card });
  }
  return Array.from(counts.values());
}
