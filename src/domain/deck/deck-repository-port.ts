import type { CreateDeckInput, Deck, DeckSummary } from "./deck-types";

export interface DeckRepository {
  create(input: CreateDeckInput): Promise<Deck>;
  countAll(): Promise<number>;
  findRecent(limit: number): Promise<DeckSummary[]>;
  findAll(): Promise<DeckSummary[]>;
}
