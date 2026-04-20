import type { DeckRepository } from "@/domain/deck/deck-repository-port";
import type { DeckSummary } from "@/domain/deck/deck-types";

export class GetDecksUseCase {
  constructor(private readonly deckRepository: DeckRepository) {}

  async execute(): Promise<DeckSummary[]> {
    return this.deckRepository.findAll();
  }
}
