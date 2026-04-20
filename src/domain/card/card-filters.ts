export type ColorMatchMode = "and" | "or";

export interface CardFilters {
  name?: string;
  colors?: string[];
  colorMode?: ColorMatchMode;
  rarity?: string;
  type?: string;
  set?: string;
  /**
   * Cuando es `true` incluye tokens, un-sets (`funny`) y memorabilia
   * (art series, playtest cards). Por defecto/undefined estos quedan fuera
   * del listado y del contador.
   */
  includeExtras?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
