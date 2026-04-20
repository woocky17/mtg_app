import { prisma } from "@/lib/prisma";
import type { CardRepository } from "@/domain/card/card-repository-port";
import type { CardSummary, SetSummary } from "@/domain/card/card-types";
import type {
  CardFilters,
  PaginationParams,
  PaginatedResult,
} from "@/domain/card/card-filters";

// Set types que quedan fuera por defecto: tokens, un-sets silver-bordered y
// memorabilia (art series, playtest cards). Se incluyen cuando el usuario
// activa `includeExtras` en el FilterBar.
const EXTRA_SET_TYPES = ["memorabilia", "funny", "token"];
const EXCLUDE_EXTRAS_CLAUSE = { set_type: { notIn: EXTRA_SET_TYPES } };

const ALL_COLORS = ["W", "U", "B", "R", "G"];

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

/**
 * Devuelve la URL de la imagen de la segunda cara (reverso) para cartas
 * double-faced — transform, modal_dfc, reversible_card, etc. Devuelve `null`
 * si la carta es single-faced.
 */
function resolveBackImageUrl(cardFaces: unknown): string | null {
  if (!Array.isArray(cardFaces)) return null;
  const back = (cardFaces as Array<Record<string, unknown>>)[1];
  if (back?.image_uris && typeof back.image_uris === "object") {
    return (back.image_uris as Record<string, string>).normal ?? null;
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildColorClause(colors: string[], mode: CardFilters["colorMode"]): any {
  if (mode === "or") {
    return { color_identity: { hasSome: colors } };
  }
  const excluded = ALL_COLORS.filter((c) => !colors.includes(c));
  const and: unknown[] = [{ color_identity: { hasEvery: colors } }];
  if (excluded.length > 0) {
    and.push({ NOT: { color_identity: { hasSome: excluded } } });
  }
  return { AND: and };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildWhereClause(filters: CardFilters): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = filters.includeExtras ? {} : { ...EXCLUDE_EXTRAS_CLAUSE };

  if (filters.name)   where.name      = { contains: filters.name, mode: "insensitive" };
  if (filters.rarity) where.rarity    = filters.rarity;
  if (filters.type)   where.type_line = { contains: filters.type, mode: "insensitive" };
  if (filters.set)    where.set       = { equals: filters.set.toLowerCase() };

  if (filters.colors && filters.colors.length > 0) {
    Object.assign(where, buildColorClause(filters.colors, filters.colorMode));
  }

  return where;
}

const CARD_SELECT = {
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
} as const;

export class PrismaCardRepository implements CardRepository {
  async findMany(
    filters: CardFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CardSummary>> {
    const where = buildWhereClause(filters);

    const [total, cards] = await Promise.all([
      prisma.card.count({ where }),
      prisma.card.findMany({
        where,
        orderBy: [{ released_at: "desc" }, { name: "asc" }],
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        select: CARD_SELECT,
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
      backImageUrl: resolveBackImageUrl(card.card_faces),
    }));

    return {
      items,
      total,
      page: pagination.page,
      totalPages: Math.max(1, Math.ceil(total / pagination.pageSize)),
    };
  }

  async countAll(): Promise<number> {
    return prisma.card.count();
  }

  async findAllSets(includeExtras: boolean): Promise<SetSummary[]> {
    const rows = await prisma.card.findMany({
      where: includeExtras ? undefined : EXCLUDE_EXTRAS_CLAUSE,
      distinct: ["set"],
      select: { set: true, set_name: true },
      orderBy: { set_name: "asc" },
    });
    return rows.map((r) => ({ code: r.set, name: r.set_name }));
  }
}
