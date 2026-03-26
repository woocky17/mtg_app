import { PrismaCardRepository } from "./persistence/prisma-card-repository";
import { GetCardsUseCase } from "@/application/card/get-cards-use-case";

const cardRepository = new PrismaCardRepository();

export const getCardsUseCase = new GetCardsUseCase(cardRepository);
