# Agent: Infrastructure

## What Exists

### `src/infrastructure/persistence/prisma-card-repository.ts`
- `PrismaCardRepository` — implementa `CardRepository` port
- `findMany(filters, pagination)` — builds Prisma where clause, executes count + findMany, maps to CardSummary
- Orden: `released_at desc, name asc` (cartas más nuevas primero)
- `findAllSets()` — distinct set + set_name ordenado por nombre, retorna `SetSummary[]`
- `resolveImageUrl(imageUris, cardFaces)` — función interna que resuelve URL de imagen (single-face y double-face)
- Select optimizado: solo los campos necesarios para CardSummary

### `src/infrastructure/external/scryfall-client.ts`
- Types: `BulkDataType`, `BulkDataItem`, `BulkDataResponse`
- `getBulkData()` — lista bulk data endpoints
- `getBulkDataByType(type)` — metadata de un tipo
- `saveBulkDataToJson(type, outputDir)` — guarda metadata en JSON

### `src/infrastructure/container.ts`
- Factory que instancia `PrismaCardRepository`, `GetCardsUseCase` y `GetSetsUseCase`
- Exports: `getCardsUseCase`, `getSetsUseCase` (singletons)

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
