# Agent: Components (Atomic Design)

## What Exists

### Atoms (`src/components/atoms/`)
- **button.tsx** — `Button` con variants (primary/secondary/ghost), sizes (sm/md). Usa CSS vars para styling.
- **input.tsx** — `Input` con prop `width`. Styled con surface-2/border/text-primary.
- **select.tsx** — `Select` con `options[]` y `placeholder`. Color muted cuando no hay valor.
- **badge.tsx** — `Badge` con `color` opcional. Background surface-3, border.
- **icon.tsx** — `Icon` con prop `name: "search"`. SVG inline, extensible.
- **card-placeholder.tsx** — `CardPlaceholder`. Skeleton card con aspect-ratio 63/88.

### Molecules (`src/components/molecules/`)
- **search-bar.tsx** — `SearchBar` compone Icon(search) + input nativo. Props: placeholder, defaultValue, name.
- **card-thumbnail.tsx** — `CardThumbnail` con Image de next/image. Props: `card: CardSummary`. Muestra imagen, nombre, tipo, rarity badge, set code. Constante `RARITY_COLOR` interna.
- **stat-block.tsx** — `StatBlock` con label + value. Usado en Sidebar.
- **mana-curve.tsx** — `ManaCurve` con values[] y labels[]. Barras proporcionales al máximo.
- **page-button.tsx** — `PageButton` Link styled. Props: href, active, children.

### Organisms (`src/components/organisms/`)
- **header.tsx** — `Header` con logo MTG + navItems[] opcionales + rightContent slot.
- **filter-bar.tsx** — `FilterBar` form GET con Input×3, Select×2, Button, Link limpiar. Constantes COLORS/RARITIES internas. Props: name, type, set, color, rarity.
- **card-grid.tsx** — `CardGrid` responsive grid de CardThumbnail. Props: cards: CardSummary[], emptyMessage.
- **pagination.tsx** — `Pagination` con PageButton. Props: currentPage, totalPages, total, buildUrl.
- **sidebar.tsx** — `Sidebar` con StatBlock×3, ManaCurve, card list, Badge format. Datos hardcoded (placeholder).

### Templates (`src/components/templates/`)
- **main-layout.tsx** — `MainLayout` flex container. Props: header, sidebar?, children.

## Pending
- Componente de detalle de carta (modal o page)
- Card list item para sidebar (cuando haya mazos reales)
- Loading skeletons / Suspense boundaries
- Responsive adaptations

## Key Decisions
- **Todo Server Components** — ningún componente usa "use client"
- **CSS variables** via inline styles — no hardcoded colors, todo themeable
- **Props tipados** con interfaces locales — sin barrel exports por ahora
- **CardSummary** del domain como tipo compartido entre molecules/organisms

## Dependencies
- `next/link`, `next/image`
- `@/domain/card/card-types` (CardSummary)

## Gotchas
- `CardThumbnail` usa `unoptimized` en Image porque Scryfall ya sirve optimizado
- `FilterBar` tiene `key` en el form para resetear defaultValues cuando cambian los filtros
- `Select` determina color muted basado en si `defaultValue` es vacío
