import type { DeckRepository } from "@/domain/deck/deck-repository-port";
import type { CreateDeckInput, Deck } from "@/domain/deck/deck-types";

export class CreateDeckUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

  async execute(input: CreateDeckInput): Promise<Deck> {
    const name = input.name.trim();
    if (!name) throw new Error("El mazo necesita un nombre");
    if (input.cards.length === 0) throw new Error("El mazo no tiene cartas");
    return this.deckRepository.create({ name, cards: input.cards });
  }
}
