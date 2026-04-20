# Agent: Scripts

## What Exists

### `scripts/sync-scryfall.ts`
- Script CLI: `npm run sync-scryfall` (usa `npx tsx`)
- Descarga `oracle_cards` de Scryfall Bulk API (~37k cartas, ~171 MB gzip) y hace **replace-all**: `deleteMany()` + `createMany()` en batches de 500
- `mapCard()` transforma JSON de Scryfall al shape del modelo Prisma
- Crea su propio PrismaClient (no usa el singleton de lib/)
- Import: `../generated/prisma/client.ts` (path relativo, scripts excluido de tsconfig)

## Pending
- Sync incremental
- Seed script para desarrollo
- Script de reset DB

## Key Decisions
- Descarga completa en memoria — simple pero ~1GB+ RAM (171MB gzip, ~1GB desempaquetado)
- Batch size 500 vía `createMany` (una sola sentencia INSERT por lote)
- **Replace-all** en lugar de upsert por fila: el bulk de Scryfall ES la fuente de verdad, wipeando + bulk insert es ~10× más rápido y evita el timeout de 5s que tenía el `prisma.$transaction([upsert...])` anterior (~batch 29 moría con `Transaction API error: timeout 5000 ms` y se colaban ~20k cartas)
- Safe hacer `deleteMany()` porque `decks.cards` es JSON sin FK — las referencias por id sobreviven
- oracle_cards (no default_cards) — ~37k vs ~90k+

## Configuration
- `DATABASE_URL` via dotenv

## Dependencies
- `@prisma/adapter-pg`, `pg`, `dotenv`, `tsx`

## Gotchas
- PrismaClient propio, independiente del singleton de `src/lib/prisma.ts`
- Import relativo (no alias) porque `scripts/` está en `tsconfig.exclude`
- Descarga TODO en memoria antes de procesar
- Cualquier cambio al script requiere **rebuild de la imagen** `mtg-sync` (`docker compose build mtg-sync`) porque el script está COPY-ado en el Dockerfile, no bind-mounted
