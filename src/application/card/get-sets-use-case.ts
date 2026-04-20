import type { CardRepository } from "@/domain/card/card-repository-port";
import type { SetSummary } from "@/domain/card/card-types";

export class GetSetsUseCase {
  constructor(private readonly cardRepository: CardRepository) {}

  async execute(includeExtras: boolean): Promise<SetSummary[]> {
    return this.cardRepository.findAllSets(includeExtras);
  }
}
