export interface DeckCard {
  cardId: string;
  count: number;
}

export interface Deck {
  id: string;
  name: string;
  cards: DeckCard[];
}

export interface CreateDeckInput {
  name: string;
  cards: DeckCard[];
}

export interface DeckSummary {
  id: string;
  name: string;
  cardCount: number;
  updatedAt: Date;
}
