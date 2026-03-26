# Agent: Overview

## What Exists

Aplicación web de Magic: The Gathering para explorar cartas, construir mazos y gestionar colección.

### Entry Points
- `src/app/layout.tsx` — Root layout (Geist fonts, metadata, lang="es")
- `src/app/page.tsx` — Home: compone MainLayout + Header + SearchBar + CardPlaceholder grid + Sidebar
- `src/app/cards/page.tsx` — Card browser: use case + FilterBar + CardGrid + Pagination

### Stack
- **Framework**: Next.js 16 (App Router, React Compiler habilitado)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS v4 + CSS custom properties para theming
- **Base de datos**: PostgreSQL 16 (Docker) + Prisma 7 con adapter `@prisma/adapter-pg`
- **Datos**: Scryfall Bulk API (oracle_cards)

### Architecture
- **Backend**: Hexagonal — domain (types, ports) → application (use cases) → infrastructure (adapters)
- **Frontend**: Atomic Design — atoms → molecules → organisms → templates
- **Pages**: Thin composición de components + use cases

### Flujo principal
1. Docker levanta PostgreSQL en puerto 5433
2. `npm run sync-scryfall` descarga oracle_cards y upserta ~30k cartas
3. `/cards` → use case → Prisma repository → PaginatedResult<CardSummary> → componentes atómicos

### Path Aliases
- `@/*` → `./src/*`
- `@generated/*` → `./generated/*`

## Pending
- Mazos (crear, editar, listar) — navegación apunta a `#`
- Colección personal — navegación apunta a `#`
- Detalle de carta individual (`/cards/[id]`)
- Autenticación de usuarios
- Buscador funcional en la home (actualmente solo placeholder)
- Tests (no hay framework configurado)

## Key Decisions
- **Hexagonal architecture** — separar domain/application/infrastructure para testabilidad y mantenibilidad
- **Atomic design** — componentes reutilizables bottom-up (atoms → templates)
- **Server Components** para toda la UI — sin client-side fetching
- **CSS custom properties** para theming — permite dark/light sin recompilar
- **Scryfall oracle_cards** (no default_cards) — una carta por oracle_id
- **Prisma generated fuera de src** — en `generated/prisma/` con alias `@generated/*`
- **kebab-case** para todos los ficheros

## Configuration
- `DATABASE_URL` — connection string PostgreSQL
- `docker/docker-compose.yml` — PostgreSQL 16 Alpine, puerto 5433
- `next.config.ts` — React Compiler habilitado

## Dependencies
- next 16.1.6, react 19.2.3
- prisma 7.4.2 + @prisma/adapter-pg + pg
- tailwindcss 4 + @tailwindcss/postcss
- babel-plugin-react-compiler 1.0.0
