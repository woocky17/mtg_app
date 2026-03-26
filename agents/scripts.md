# Agent: Scripts

## What Exists

### `scripts/sync-scryfall.ts`
- Script CLI: `npm run sync-scryfall` (usa `npx tsx`)
- Descarga oracle_cards desde Scryfall Bulk API y upserta en batches de 500
- `mapCard()` transforma JSON de Scryfall al shape del modelo Prisma
- Crea su propio PrismaClient (no usa el singleton de lib/)
- Import: `../generated/prisma/client.ts` (path relativo, scripts excluido de tsconfig)

## Pending
- Sync incremental
- Seed script para desarrollo
- Script de reset DB

## Key Decisions
- Descarga completa en memoria — simple pero ~200MB+ RAM
- Batch size 500
- oracle_cards (no default_cards) — ~30k vs ~90k+

## Configuration
- `DATABASE_URL` via dotenv

## Dependencies
- `@prisma/adapter-pg`, `pg`, `dotenv`, `tsx`

## Gotchas
- PrismaClient propio, independiente del singleton de `src/lib/prisma.ts`
- Import relativo (no alias) porque `scripts/` está en `tsconfig.exclude`
- Descarga TODO en memoria antes de procesar
