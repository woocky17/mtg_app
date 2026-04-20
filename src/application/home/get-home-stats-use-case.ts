import type { CardRepository } from "@/domain/card/card-repository-port";
import type { DeckRepository } from "@/domain/deck/deck-repository-port";
import type { DeckSummary } from "@/domain/deck/deck-types";

export interface HomeStats {
  cardCount: number;
  deckCount: number;
  recentDecks: DeckSummary[];
}

export class GetHomeStatsUseCase {
  constructor(
    private readonly cardRepository: CardRepository,
    private readonly deckRepository: DeckRepository,
  ) {}

  async execute(): Promise<HomeStats> {
    const [cardCount, deckCount, recentDecks] = await Promise.all([
      this.cardRepository.countAll(),
      this.deckRepository.countAll(),
      this.deckRepository.findRecent(5),
    ]);
    return { cardCount, deckCount, recentDecks };
  }
}
