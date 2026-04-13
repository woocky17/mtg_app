# Agent: App (Pages & Layouts)

## What Exists

### `src/app/layout.tsx`
- Root layout con fuentes Geist Sans y Geist Mono
- Metadata: title "MTG App", description "Magic: The Gathering card browser"
- `<html lang="es" className="h-full">`

### `src/app/page.tsx` (~30 líneas)
- Compone: MainLayout + Header(navItems) + SearchBar + CardPlaceholder grid (24) + Sidebar
- Navegación: Cartas(/cards), Mazos(#), Colección(#)

### `src/app/cards/page.tsx`
- Server Component async con `searchParams` (Promise-based, Next.js 16)
- Parsea filtros de query params → CardFilters
- Llama `getCardsUseCase.execute(filters, pagination)` desde `@/infrastructure/container`
- Compone: MainLayout + Header(rightContent=count) + FilterBar + CardGrid + Pagination
- `buildUrl()` helper para construir URLs preservando filtros
- Try/catch alrededor del use case: renderiza estado de error amigable inline (detecta errores de conexión Prisma P1001/P1002/ECONNREFUSED)

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
