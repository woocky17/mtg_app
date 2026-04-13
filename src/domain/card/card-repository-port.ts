import type { CardSummary, SetSummary } from "./card-types";
import type { CardFilters, PaginationParams, PaginatedResult } from "./card-filters";

export interface CardRepository {
  findMany(
    filters: CardFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CardSummary>>;

  findAllSets(): Promise<SetSummary[]>;
}
