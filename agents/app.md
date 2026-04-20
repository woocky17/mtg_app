# Agent: App (Pages & Layouts)

## What Exists

### `src/app/layout.tsx`
- Root layout con fuentes Geist Sans y Geist Mono
- Metadata: title "MTG App", description "Magic: The Gathering card browser"
- `<html lang="es" className="h-full">`

### `src/app/page.tsx`
- Server Component async. Llama `getHomeStatsUseCase.execute()` (try/catch con `getErrorMessage`).
- Secciones: hero, 3 StatCards, 3 ActionCards, lista de mazos recientes (via `<DeckList>` o `<EmptyDecksState>`).
- Helpers internos: `StatCard`, `ActionCard`. Error con `<AlertBox>`.
- `NAV_ITEMS` importado de `@/lib/nav-items`.

### `src/app/cards/page.tsx`
- Server Component async y thin. Parseo de params + construcción de URL viven en `search-params.ts`.
- Llama `getCardsUseCase` + `getSetsUseCase` via `Promise.all`. En catch renderiza `<DbErrorState />`.
- Compone: MainLayout + Header(navItems) + FilterBar + CardGrid + Pagination
- `NAV_ITEMS` importado de `@/lib/nav-items`.

### `src/app/cards/search-params.ts`
- `parseCardsQuery(rawParams)` → `ParsedCardsQuery { page, name, type, set, rarity, colors, colorMode, includeExtras, selected, filters }`
- `buildCardsUrl(CardsUrlParams, overrides?)` — reusado por la page (Pagination), `FilterBar` y `CardGrid`. Serializa `includeExtras` como `?extras=1`. `selected` es transitorio: solo se escribe al URL cuando se pasa explícitamente vía overrides (p. ej. al cruzar página desde el modal). No forma parte de `CardsUrlParams`.
- Constante interna `VALID_COLORS` para validar query params

### `src/app/decks/page.tsx`
- Server Component async que llama `getDecksUseCase.execute()` (try/catch con `getErrorMessage`).
- Renderiza `<DeckList showUpdatedLabel />` para los mazos, `<EmptyDecksState padding={8} />` si no hay, y `<AlertBox>` para errores.
- `NAV_ITEMS` importado de `@/lib/nav-items`. Link "+ Crear mazo" → `/cards`.

### `src/app/api/decks/route.ts`
- `POST /api/decks` — valida body `{ name: string, cards: { cardId, count }[] }`, llama `createDeckUseCase.execute`
- Devuelve 201 + Deck, o 400 con `{ error }` (formateado con `getErrorMessage`)

### `src/app/globals.css`
- Tailwind CSS v4 imports + `@theme inline` block
- CSS custom properties: --surface-0/1/2/3, --border, --accent, --accent-dim, --text-primary/secondary/muted
- Custom scrollbar, base resets

## Pending
- `/decks` — página de mazos
- `/collection` — página de colección
- `/cards/[id]` — detalle de carta
- Buscador funcional en home
- Responsive design / mobile

## Key Decisions
- Pages son thin: solo componen componentes y llaman use cases
- Filtros via `<form method="GET">` (no "use client")
- `PAGE_SIZE = 100`

## Dependencies
- Organisms: Header, FilterBar, CardGrid, Pagination, Sidebar
- Molecules: SearchBar
- Atoms: CardPlaceholder
- Templates: MainLayout
- Use case: `getCardsUseCase` desde `@/infrastructure/container`
- Domain types: `CardFilters`
