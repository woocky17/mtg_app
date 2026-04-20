import { prisma } from "@/lib/prisma";
import type { Prisma } from "@generated/prisma/client";
import type { DeckRepository } from "@/domain/deck/deck-repository-port";
import type {
  CreateDeckInput,
  Deck,
  DeckCard,
  DeckSummary,
} from "@/domain/deck/deck-types";

export class PrismaDeckRepository implements DeckRepository {
  async create(input: CreateDeckInput): Promise<Deck> {
    const row = await prisma.deck.create({
      data: {
        name: input.name,
        cards: input.cards as unknown as Prisma.InputJsonValue,
      },
    });
    return {
      id: row.id,
      name: row.name,
      cards: row.cards as unknown as DeckCard[],
    };
  }

  async countAll(): Promise<number> {
    return prisma.deck.count();
  }

  async findRecent(limit: number): Promise<DeckSummary[]> {
    return this.#listDecks({ take: limit });
  }

  async findAll(): Promise<DeckSummary[]> {
    return this.#listDecks({});
  }

  async #listDecks({ take }: { take?: number }): Promise<DeckSummary[]> {
    const rows = await prisma.deck.findMany({
      orderBy: { updated_at: "desc" },
      ...(take !== undefined ? { take } : {}),
      select: { id: true, name: true, cards: true, updated_at: true },
    });
    return rows.map((r) => {
      const cards = (r.cards as unknown as DeckCard[]) ?? [];
      const cardCount = cards.reduce((sum, c) => sum + (c.count ?? 0), 0);
      return {
        id: r.id,
        name: r.name,
        cardCount,
        updatedAt: r.updated_at,
      };
    });
  }
}
