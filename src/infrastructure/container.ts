import { PrismaCardRepository } from "./persistence/prisma-card-repository";
import { PrismaDeckRepository } from "./persistence/prisma-deck-repository";
import { GetCardsUseCase } from "@/application/card/get-cards-use-case";
import { GetSetsUseCase } from "@/application/card/get-sets-use-case";
import { CreateDeckUseCase } from "@/application/deck/create-deck-use-case";
import { GetDecksUseCase } from "@/application/deck/get-decks-use-case";
import { GetHomeStatsUseCase } from "@/application/home/get-home-stats-use-case";

const cardRepository = new PrismaCardRepository();
const deckRepository = new PrismaDeckRepository();

export const getCardsUseCase = new GetCardsUseCase(cardRepository);
export const getSetsUseCase = new GetSetsUseCase(cardRepository);
export const createDeckUseCase = new CreateDeckUseCase(deckRepository);
export const getDecksUseCase = new GetDecksUseCase(deckRepository);
export const getHomeStatsUseCase = new GetHomeStatsUseCase(cardRepository, deckRepository);
