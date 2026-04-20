import { NextResponse } from "next/server";
import { createDeckUseCase } from "@/infrastructure/container";
import type { DeckCard } from "@/domain/deck/deck-types";
import { getErrorMessage } from "@/lib/get-error-message";

interface CreateDeckBody {
  name?: unknown;
  cards?: unknown;
}

export async function POST(request: Request) {
  let body: CreateDeckBody;
  try {
    body = (await request.json()) as CreateDeckBody;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body.name !== "string" || !Array.isArray(body.cards)) {
    return NextResponse.json(
      { error: "Se requiere `name` (string) y `cards` (array)" },
      { status: 400 },
    );
  }

  const cards: DeckCard[] = [];
  for (const raw of body.cards) {
    if (
      typeof raw !== "object" ||
      raw === null ||
      typeof (raw as DeckCard).cardId !== "string" ||
      typeof (raw as DeckCard).count !== "number"
    ) {
      return NextResponse.json(
        { error: "Cada carta necesita { cardId: string, count: number }" },
        { status: 400 },
      );
    }
    cards.push({ cardId: (raw as DeckCard).cardId, count: (raw as DeckCard).count });
  }

  try {
    const deck = await createDeckUseCase.execute({ name: body.name, cards });
    return NextResponse.json(deck, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error, "Error creando el mazo") },
      { status: 400 },
    );
  }
}
