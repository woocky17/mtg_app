# Agent: Domain

## What Exists

### `src/domain/card/card-types.ts`
- `CardFace` — interface: name, imageUris?
- `CardSummary` — interface: id, name, typeLine, manaCost, rarity, set, setName, colors, colorIdentity, imageUrl (ya resuelto)

### `src/domain/card/card-filters.ts`
- `CardFilters` — interface: name?, color?, rarity?, type?, set?
- `PaginationParams` — interface: page, pageSize
- `PaginatedResult<T>` — interface: items, total, page, totalPages

### `src/domain/card/card-repository-port.ts`
- `CardRepository` — interface con `findMany(filters, pagination) → PaginatedResult<CardSummary>`

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
