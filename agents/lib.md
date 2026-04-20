# Agent: Lib

## What Exists

### `src/lib/use-debounced-router-push.ts`
- Hook `useDebouncedRouterPush(delayMs, initialUrl?)` — devuelve `{ pushNow, pushDebounced, cancel }`
- Navega vía `router.push` dentro de `startTransition`, deduplica URLs idénticas
- Limpia el timer pendiente al desmontar

### `src/lib/format-date.ts`
- `formatDate(date: Date): string` — `Intl.DateTimeFormat("es", { day: "2-digit", month: "short", year: "numeric" })`. Usado por Home y `/decks`.

### `src/lib/nav-items.ts`
- `NAV_ITEMS` — constante con las 3 entradas del header (Cartas, Mazos, Colección). Fuente única usada por Home, `/cards` y `/decks`.

### `src/lib/get-error-message.ts`
- `getErrorMessage(error: unknown, fallback: string): string` — devuelve `error.message` si es `Error`, si no el fallback. Usado en pages server, API routes y componentes cliente.

### `src/lib/aggregate-card-counts.ts`
- `aggregateCardCounts(cards: CardSummary[]): AggregatedCard[]` — agrupa por `card.id` devolviendo `{ cardId, count, card }`. Usado por `DeckToolbar` para texto de exportación y payload POST a `/api/decks`.

### `src/lib/use-modal-dismiss.ts`
- Hook client `useModalDismiss(onClose)` — añade listener de Escape y bloquea `body.style.overflow` durante el mount. Usado por `<ModalShell>`.

### `src/lib/prisma.ts`
- Singleton PrismaClient con `@prisma/adapter-pg` (PrismaPg)
- Patrón global para dev hot-reload: `globalForPrisma.prisma`
- Lee `DATABASE_URL` de env
- Import: `@generated/prisma/client`
- Export: `prisma` (PrismaClient instance)

## Pending
- Helpers de formateo de mana / símbolos

## Key Decisions
- Prisma con adapter pg (no driver nativo) — requerido por Prisma 7
- Singleton con globalThis para evitar múltiples conexiones en dev

## Configuration
- `DATABASE_URL` — requerido

## Dependencies
- `@prisma/adapter-pg`, `pg`
- `@generated/prisma/client` (generado fuera de src)

## Gotchas
- El PrismaClient importa de `@generated/prisma/client` (alias tsconfig, no path relativo)
- El client generado vive en `generated/prisma/` (raíz del proyecto, no en src)
