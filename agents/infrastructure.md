# Agent: Infrastructure

## What Exists

### `src/infrastructure/persistence/prisma-card-repository.ts`
- `PrismaCardRepository` — implementa `CardRepository` port
- `findMany(filters, pagination)` — builds Prisma where clause, executes count + findMany, maps to CardSummary
- Orden: `released_at desc, name asc` (cartas más nuevas primero)
- **Exclusión opt-out** de `set_type in ["memorabilia", "funny", "token"]` (tokens, Un-sets silver-bordered, art series / playtest cards). Se aplica por defecto en `findMany` y `findAllSets`, y desaparece cuando el caller pasa `filters.includeExtras = true` / `findAllSets(true)`. El FilterBar expone un toggle "+ Extras" (URL param `?extras=1`)
- Filtro de colores:
  - `colorMode === "or"` → `color_identity: { hasSome: colors }` (contiene al menos uno, puede tener más)
  - `colorMode === "and"` (default, "exact") → `hasEvery: colors` + `NOT hasSome: excluded` donde `excluded = WUBRG \ colors`, es decir, match exacto del color_identity
- `findAllSets(includeExtras)` — distinct set + set_name ordenado por nombre, retorna `SetSummary[]`. Si `includeExtras` es false, oculta los sets tipo token/funny/memorabilia
- `countAll()` — count honesto de toda la tabla `card` (sin filtros). Usado por Home para el stat "Cartas en la base"
- `resolveImageUrl(imageUris, cardFaces)` — función interna que resuelve URL de imagen (single-face y double-face, usa la primera cara para DFCs)
- `resolveBackImageUrl(cardFaces)` — función interna que devuelve la URL del reverso (`card_faces[1].image_uris.normal`) para DFCs (transform, modal_dfc, reversible_card, etc.). `null` si la carta es single-face
- Select optimizado: solo los campos necesarios para CardSummary

### `src/infrastructure/external/scryfall-client.ts`
- Types: `BulkDataType`, `BulkDataItem`, `BulkDataResponse`
- `getBulkData()` — lista bulk data endpoints
- `getBulkDataByType(type)` — metadata de un tipo
- `saveBulkDataToJson(type, outputDir)` — guarda metadata en JSON

### `src/infrastructure/persistence/prisma-deck-repository.ts`
- `PrismaDeckRepository` — implementa `DeckRepository`
- `create(input)` — inserta en tabla `decks`, devuelve Deck (cuid generado por Prisma)
- `countAll()` — count de decks
- `findRecent(limit)` — últimos N decks por `updated_at desc`, calcula `cardCount` sumando counts del JSON

### `src/infrastructure/container.ts`
- Factory que instancia repos y use cases
- Exports: `getCardsUseCase`, `getSetsUseCase`, `createDeckUseCase`, `getHomeStatsUseCase` (singletons)

## Pending
- Repositorios para Deck, Collection
- Cache layer (in-memory o Redis)
- Rate limiting para Scryfall API calls

## Key Decisions
- **Container como factory simple** — sin DI framework, suficiente para el tamaño actual
- **Singletons** en container — una instancia de cada repo/use case
- **resolveImageUrl privada** — lógica de resolución de imagen encapsulada en el adapter

## Configuration
- `DATABASE_URL` via `@/lib/prisma` singleton

## Dependencies
- `@/lib/prisma` (PrismaClient singleton)
- `@/domain/card/*` (ports y types)
- `@/application/card/*` (use cases)

## Gotchas
- `scryfall-client.ts` exporta funciones para bulk data metadata, pero `scripts/sync-scryfall.ts` hace su propio fetch directo
- El `where` clause usa `any` type cast por limitación de tipado de Prisma dinámico
- `resolveImageUrl` maneja el caso de cartas double-faced donde `image_uris` es null
