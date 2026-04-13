# Agent: Application (Use Cases)

## What Exists

### `src/application/card/get-cards-use-case.ts`
- `GetCardsUseCase` — class con constructor(CardRepository)
- `execute(filters, pagination)` → `PaginatedResult<CardSummary>`
- Actualmente es un pass-through al repository (la lógica de negocio crecerá aquí)

### `src/application/card/get-sets-use-case.ts`
- `GetSetsUseCase` — class con constructor(CardRepository)
- `execute()` → `SetSummary[]` (lista distinct de sets para dropdowns)

## Pending
- GetCardByIdUseCase — detalle de carta individual
- CreateDeckUseCase, AddCardToDeckUseCase
- SearchCardsUseCase — búsqueda avanzada con texto completo

## Key Decisions
- **Constructor injection** — recibe el port (interface), no la implementación
- **Use cases como clases** — permite inyección de dependencias y testing
- **Thin initially** — la capa de application crecerá con lógica de negocio

## Dependencies
- `@/domain/card/card-repository-port` (CardRepository interface)
- `@/domain/card/card-filters` (CardFilters, PaginationParams, PaginatedResult)
- `@/domain/card/card-types` (CardSummary)
