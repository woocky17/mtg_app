import { prisma } from "@/lib/prisma";
import type { CardRepository } from "@/domain/card/card-repository-port";
import type { CardSummary } from "@/domain/card/card-types";
import type { CardFilters, PaginationParams, PaginatedResult } from "@/domain/card/card-filters";

function resolveImageUrl(
  imageUris: unknown,
  cardFaces: unknown,
): string | null {
  if (imageUris && typeof imageUris === "object") {
    return (imageUris as Record<string, string>).normal ?? null;
  }
  if (Array.isArray(cardFaces)) {
    const face = (cardFaces as Array<Record<string, unknown>>)[0];
    if (face?.image_uris && typeof face.image_uris === "object") {
      return (face.image_uris as Record<string, string>).normal ?? null;
    }
  }
  return null;
}

export class PrismaCardRepository implements CardRepository {
  async findMany(
    filters: CardFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CardSummary>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (filters.name) where.name = { contains: filters.name, mode: "insensitive" };
    if (filters.rarity) where.rarity = filters.rarity;
    if (filters.type) where.type_line = { contains: filters.type, mode: "insensitive" };
    if (filters.set) where.set = { equals: filters.set.toLowerCase() };
    if (filters.color) where.color_identity = { has: filters.color };

    const [total, cards] = await Promise.all([
      prisma.card.count({ where }),
      prisma.card.findMany({
        where,
        orderBy: [{ name: "asc" }],
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        select: {
          id: true,
          name: true,
          type_line: true,
          mana_cost: true,
          rarity: true,
          set: true,
          set_name: true,
          image_uris: true,
          card_faces: true,
          colors: true,
          color_identity: true,
        },
      }),
    ]);

    const items: CardSummary[] = cards.map((card) => ({
      id: card.id,
      name: card.name,
      typeLine: card.type_line,
      manaCost: card.mana_cost,
      rarity: card.rarity,
      set: card.set,
      setName: card.set_name,
      colors: card.colors,
      colorIdentity: card.color_identity,
      imageUrl: resolveImageUrl(card.image_uris, card.card_faces),
    }));

    return {
      items,
      total,
      page: pagination.page,
      totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)),
    };
  }
}
