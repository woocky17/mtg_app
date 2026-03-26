# Agent: Database (Prisma & Docker)

## What Exists

### `prisma/schema.prisma`
- Generator: `prisma-client` con output `../generated/prisma` (fuera de src)
- Datasource: PostgreSQL (sin URL en schema, usa env)
- **Model Card** (tabla `cards`): ~50 campos incluyendo identifiers, core data, mana/stats, text, colors, legalities, print flags, set info, appearance, artist, rankings, URIs, market data, image URIs, timestamps

### `prisma/migrations/`
- Migraciones generadas

### `prisma.config.ts`
- Configuración de Prisma CLI con dotenv

### `docker/docker-compose.yml`
- PostgreSQL 16 Alpine, container `mtg_db`
- Credenciales: user=mtg, password=mtg_password, db=mtg_db
- Puerto: **5433**:5432, volume persistente

### `generated/prisma/` (raíz del proyecto)
- Client generado por Prisma (gitignored)
- Accesible via alias `@generated/*`

## Pending
- Modelos: Deck, DeckCard, User, Collection
- Índices en Card (name, set, rarity, color_identity)
- Seed script alternativo

## Key Decisions
- Scryfall UUID como PK
- Campos JSON para estructuras anidadas
- Puerto 5433 para evitar conflictos
- Generated fuera de src con alias `@generated/*`

## Configuration
- `DATABASE_URL=postgresql://mtg:mtg_password@localhost:5433/mtg_db`

## Gotchas
- El client se genera en `generated/prisma/` (NO en src ni en node_modules)
- `released_at` usa `@db.Date`
- `@@map("cards")` — modelo Card, tabla `cards`
- No hay índices explícitos
