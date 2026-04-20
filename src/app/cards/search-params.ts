import type { CardFilters, ColorMatchMode } from "@/domain/card/card-filters";

const VALID_COLORS = ["W", "U", "B", "R", "G"];

export interface RawSearchParams {
  page?: string;
  name?: string;
  color?: string | string[];
  colorMode?: string;
  rarity?: string;
  type?: string;
  set?: string;
  extras?: string;
  selected?: string;
}

export interface ParsedCardsQuery {
  page: number;
  name: string;
  type: string;
  set: string;
  rarity: string;
  colors: string[];
  colorMode: ColorMatchMode;
  includeExtras: boolean;
  /** Índice (dentro de la página actual) de la carta cuyo modal debe abrirse al cargar la página. `null` si no hay selección. */
  selected: number | null;
  filters: CardFilters;
}

function parseColors(raw: RawSearchParams["color"]): string[] {
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.filter((c) => VALID_COLORS.includes(c));
}

export function parseCardsQuery(params: RawSearchParams): ParsedCardsQuery {
  const page     = Math.max(1, parseInt(params.page ?? "1", 10));
  const name     = params.name?.trim()   ?? "";
  const rarity   = params.rarity?.trim() ?? "";
  const type     = params.type?.trim()   ?? "";
  const set      = params.set?.trim()    ?? "";
  const colors   = parseColors(params.color);
  const colorMode: ColorMatchMode = params.colorMode === "or" ? "or" : "and";
  const includeExtras = params.extras === "1";
  const selectedParsed = params.selected !== undefined ? parseInt(params.selected, 10) : NaN;
  const selected = Number.isFinite(selectedParsed) && selectedParsed >= 0 ? selectedParsed : null;

  const filters: CardFilters = {};
  if (name)   filters.name   = name;
  if (rarity) filters.rarity = rarity;
  if (type)   filters.type   = type;
  if (set)    filters.set    = set;
  if (colors.length > 0) {
    filters.colors = colors;
    filters.colorMode = colorMode;
  }
  if (includeExtras) filters.includeExtras = true;

  return { page, name, type, set, rarity, colors, colorMode, includeExtras, selected, filters };
}

export interface CardsUrlParams {
  name: string;
  type: string;
  set: string;
  rarity: string;
  colors: string[];
  colorMode: ColorMatchMode;
  includeExtras: boolean;
  page?: number;
}

export function buildCardsUrl(
  query: CardsUrlParams,
  overrides: { page?: string; selected?: string | null } = {},
): string {
  const sp = new URLSearchParams();
  if (query.name)   sp.set("name",   query.name);
  if (query.rarity) sp.set("rarity", query.rarity);
  if (query.type)   sp.set("type",   query.type);
  if (query.set)    sp.set("set",    query.set);
  for (const c of query.colors) sp.append("color", c);
  if (query.colors.length > 0 && query.colorMode === "or") {
    sp.set("colorMode", "or");
  }
  if (query.includeExtras) sp.set("extras", "1");
  const nextPage = overrides.page ?? String(query.page ?? 1);
  if (nextPage !== "1") sp.set("page", nextPage);
  // `selected` es transitorio — solo se serializa cuando se pasa explícitamente
  // como override (p. ej. navegación prev/next del modal cruzando páginas).
  if (overrides.selected !== undefined && overrides.selected !== null) {
    sp.set("selected", overrides.selected);
  }
  const qs = sp.toString();
  return qs ? `/cards?${qs}` : "/cards";
}
