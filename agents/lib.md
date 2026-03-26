# Agent: Lib

## What Exists

### `src/lib/prisma.ts`
- Singleton PrismaClient con `@prisma/adapter-pg` (PrismaPg)
- Patrón global para dev hot-reload: `globalForPrisma.prisma`
- Lee `DATABASE_URL` de env
- Import: `@generated/prisma/client`
- Export: `prisma` (PrismaClient instance)

## Pending
- Helpers compartidos si se necesitan (formateo de mana, etc.)

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
