# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Next.js 16 App Router** + **Hexagonal Architecture** (backend) + **Atomic Design** (frontend).

### Backend (Hexagonal)
- `src/domain/card/` — Types puros, filtros, port (interface CardRepository)
- `src/application/card/` — Use cases (GetCardsUseCase)
- `src/infrastructure/persistence/` — Prisma adapter (implementa CardRepository)
- `src/infrastructure/external/` — Scryfall client
- `src/infrastructure/container.ts` — Factory que conecta ports con adapters
- `src/lib/prisma.ts` — Singleton PrismaClient

### Frontend (Atomic Design)
- `src/components/atoms/` — Button, Input, Select, Badge, Icon, CardPlaceholder
- `src/components/molecules/` — SearchBar, CardThumbnail, StatBlock, ManaCurve, PageButton
- `src/components/organisms/` — Header, FilterBar, CardGrid, Pagination, Sidebar
- `src/components/templates/` — MainLayout

### Pages
- `src/app/page.tsx` — Home (compone MainLayout + Header + SearchBar + placeholders + Sidebar)
- `src/app/cards/page.tsx` — Card browser (use case + FilterBar + CardGrid + Pagination)

### Other
- `generated/prisma/` — Prisma generated client (fuera de src, alias `@generated/*`)
- `prisma/schema.prisma` — Model Card
- `docker/docker-compose.yml` — PostgreSQL 16
- `scripts/sync-scryfall.ts` — Bulk sync desde Scryfall API

**Key setup details:**
- React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- Tailwind CSS v4 via `@tailwindcss/postcss`
- TypeScript strict mode
- Path aliases: `@/*` → `./src/*`, `@generated/*` → `./generated/*`
- No test framework configured yet

## Agent Routing

**Antes de leer o editar código en `src/`, lee el fichero agent correspondiente en `agents/`.** Esto es obligatorio.

| Trabajando en... | Lee primero |
|-------------------|-------------|
| `src/app/` | `agents/app.md` |
| `src/components/` | `agents/components.md` |
| `src/domain/` | `agents/domain.md` |
| `src/application/` | `agents/application.md` |
| `src/infrastructure/` | `agents/infrastructure.md` |
| `src/lib/` | `agents/lib.md` |
| `prisma/` | `agents/database.md` |
| `docker/` | `agents/database.md` |
| `scripts/` | `agents/scripts.md` |
| General / overview | `agents/overview.md` |

### Agent Maintenance Rules

**Después de implementar o cambiar cualquier cosa, actualiza el fichero agent correspondiente.**

1. **Nueva implementación** → Actualiza "What Exists", mueve item de "Pending" a documentado
2. **Nuevo módulo/package** → Crea `agents/<nombre>.md` usando el template de `agents/README.md`, añade fila a la tabla de routing
3. **Config/env vars cambiados** → Actualiza "Configuration"
4. **Nueva dependencia** → Actualiza "Dependencies"
5. **Bug fix que revela comportamiento no obvio** → Añade a "Gotchas"
6. **Decisión de diseño** → Añade a "Key Decisions" con justificación

## Conventions

- **File naming**: kebab-case para todos los ficheros (ej: `card-types.ts`, `search-bar.tsx`, `get-cards-use-case.ts`)
