import type { CardRepository } from "@/domain/card/card-repository-port";
import type { CardFilters, PaginationParams, PaginatedResult } from "@/domain/card/card-filters";
import type { CardSummary } from "@/domain/card/card-types";

export class GetCardsUseCase {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(
    filters: CardFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<CardSummary>> {
    return this.cardRepository.findMany(filters, pagination);
  }
}
