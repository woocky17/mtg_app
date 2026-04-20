import type { CardSummary, SetSummary } from "./card-types";
import type { CardFilters, PaginationParams, PaginatedResult } from "./card-filters";

export interface CardRepository {
  findMany(
    filters: CardFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CardSummary>>;

  findAllSets(includeExtras: boolean): Promise<SetSummary[]>;

  countAll(): Promise<number>;
}
