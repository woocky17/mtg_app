import { PrismaCardRepository } from "./persistence/prisma-card-repository";
import { GetCardsUseCase } from "@/application/card/get-cards-use-case";
import { GetSetsUseCase } from "@/application/card/get-sets-use-case";

const cardRepository = new PrismaCardRepository();

export const getCardsUseCase = new GetCardsUseCase(cardRepository);
export const getSetsUseCase = new GetSetsUseCase(cardRepository);
