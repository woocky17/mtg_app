# Agent: Domain

## What Exists

### `src/domain/card/card-types.ts`
- `CardFace` — interface: name, imageUris?
- `CardSummary` — interface: id, name, typeLine, manaCost, rarity, set, setName, colors, colorIdentity, imageUrl (frontal, ya resuelto), backImageUrl (reverso para DFCs, `null` para single-face)
- `SetSummary` — interface: code, name (para dropdowns de filtros)

### `src/domain/card/card-filters.ts`
- `CardFilters` — interface: name?, colors? (string[]), colorMode? ("and" | "or"), rarity?, type?, set?, `includeExtras?` (true = incluye tokens/un-sets/memorabilia; default/false = los oculta)
- `ColorMatchMode` — "and" (tiene todos los colores marcados) | "or" (tiene alguno de los colores marcados)
- `PaginationParams` — interface: page, pageSize
- `PaginatedResult<T>` — interface: items, total, page, totalPages

### `src/domain/card/card-repository-port.ts`
- `CardRepository` — interface con `findMany(filters, pagination) → PaginatedResult<CardSummary>`, `findAllSets(includeExtras) → SetSummary[]` y `countAll() → number` (cuenta honesta de toda la tabla, sin filtros)

### `src/domain/deck/deck-types.ts`
- `DeckCard` — interface: cardId, count
- `Deck` — interface: id, name, cards: DeckCard[]
- `CreateDeckInput` — interface: name, cards
- `DeckSummary` — interface: id, name, cardCount, updatedAt (para listados/home)

### `src/domain/deck/deck-repository-port.ts`
- `DeckRepository` — interface con `create(input)`, `countAll()`, `findRecent(limit) → DeckSummary[]`

## Pending
- Card entity completa (con todos los campos de Prisma model para detalle)
- Deck entity, DeckCard
- User entity
- Ports para Deck y Collection repositories

## Key Decisions
- **Tipos puros sin dependencia de Prisma** — el domain no importa nada de infrastructure
- **CardSummary** es un DTO de lectura optimizado para el grid — `imageUrl` ya resuelto, `typeLine` en camelCase
- **PaginatedResult<T>** genérico — reutilizable para cualquier entidad paginada

## Gotchas
- `CardSummary.imageUrl` puede ser null (cartas sin imagen)
- Los nombres de campo usan camelCase (no snake_case como en Prisma/Scryfall)
