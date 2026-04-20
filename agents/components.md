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
- **combobox.tsx** — `Combobox` Client Component genérico (antes `TypeCombobox`). Input + dropdown custom con opciones. Props: value, options: `ComboOption[]`, onChange, onCommit, placeholder?, width?, name?, `filterByInput?` (filtra opciones por substring del valor tecleado, case-insensitive, sobre `value` y `label`; default false), `commitOnEnter?` (commit al pulsar Enter), `commitOnBlur?` (commit al perder foco si el valor cambió desde el último commit). `onChange` se dispara en cada keystroke (el consumer decide debounce/local); `onCommit` se dispara al elegir opción del dropdown, limpiar, y adicionalmente si se activan los flags Enter/blur. Usado para el filtro Type (sin flags) y para Set (con `filterByInput commitOnEnter commitOnBlur`).
- **card-thumbnail.tsx** — `CardThumbnail` con Image de next/image. Props: `card: CardSummary`, `added?`, `onAdd?`. Muestra imagen, nombre, tipo, rarity badge, set code. Si recibe `onAdd`, renderiza un botón `+` circular en el borde izquierdo (centrado en `top: 8px`, posicionado con `left-0 -translate-x-1/2` para quedar mitad dentro / mitad fuera de la carta). Cambia a `✓` cuando `added` es true. El wrapper exterior ya **no** usa `overflow-hidden` (el clip del radio se aplica solo al div interno con la imagen vía `overflow-hidden rounded-t-lg`) para permitir que el botón sobresalga. Constante `RARITY_COLOR` interna.
- **stat-block.tsx** — `StatBlock` con label + value. Usado en Sidebar.
- **mana-curve.tsx** — `ManaCurve` con values[] y labels[]. Barras proporcionales al máximo.
- **page-button.tsx** — `PageButton` Link styled. Props: href, active, children.
- **alert-box.tsx** — `AlertBox` presentational. Div `surface-1` + border + `text-secondary` con icono ⚠️ opcional. Props: children, showIcon?.
- **deck-list.tsx** — `DeckList` renderiza `<ul>` con `<li>` por mazo (nombre + `N carta(s) · fecha`). Usa `formatDate` de `@/lib/format-date`. Props: decks: DeckSummary[], showUpdatedLabel? (prefijo "actualizado ").
- **empty-decks-state.tsx** — `EmptyDecksState` bloque vacío con borde dashed y CTA a `/cards`. Props: padding?: 6 | 8.

### Organisms (`src/components/organisms/`)
- **header.tsx** — `Header` con logo MTG + navItems[] opcionales + rightContent slot.
- **filter-bar.tsx** — `FilterBar` **Client Component**. Usa `useDebouncedRouterPush` (debounce 1000ms para Nombre y Tipo; commit explícito para Set; inmediato para toggles/selects) y `buildCardsUrl` de `search-params.ts`. Dos instancias de `Combobox` molecule: una para Type (sin filtrado, onChange debounced), otra para Set (con `filterByInput commitOnEnter commitOnBlur`, onChange = solo estado local). Mantiene `FilterState` local y lo sincroniza con props cuando el server cambia, con dos guards en el sync block: (a) skip si `stateKey === propsKey` (echo del propio push), (b) skip si hay algún `<input>` con foco (detectado vía `onFocusCapture`/`onBlurCapture` en el div raíz) — evita que responses stale pisen el tecleo en curso. Incluye toggle "+ Extras" y botón "Limpiar filtros" (icono `clear-filter`). Props: name, type, set, colors, colorMode, rarity, includeExtras, sets.
- **db-error-state.tsx** — `DbErrorState` presentacional. Detecta errores de conexión Prisma (P1001/P1002/ECONNREFUSED/"Can't reach database") y muestra mensaje + comando docker. Fallback genérico para otros errores. Props: error (unknown).
- **card-grid.tsx** — `CardGrid` responsive grid de CardThumbnail (minmax 180px). **Client Component** — trackea `selectedIndex: number | null` y `addedCards: Map<id, CardSummary>`. El índice inicial viene del URL param `?selected=N` (vía prop `initialSelectedIndex`) y se sincroniza con el patrón `lastInitial`/`setLastInitial` cuando el server re-renderiza (p. ej. al cruzar página). `hasPrev`/`hasNext` consideran fronteras de página (no sólo del array local), y `goPrev`/`goNext` llaman a `router.push({ scroll: false })` con `buildCardsUrl(urlQuery, { page, selected })` cuando cruzan frontera — así el modal permanece abierto al paginar. `handleClose` usa `window.history.replaceState` para borrar `?selected` sin disparar round-trip al server. Props: cards, initialSelectedIndex, currentPage, totalPages, pageSize, urlQuery (objeto plano serializable — NO función), emptyMessage.
- **modal-shell.tsx** — `ModalShell` Client Component. Backdrop fijo `rgba(0,0,0,0.75)` + cierre con click fuera / Escape (via `useModalDismiss`) + bloqueo de scroll. Los hijos reciben propagación detenida automáticamente. Props: onClose, children.
- **card-modal.tsx** — `CardModal` popup con imagen grande de la carta. Client Component. Envuelto en `<ModalShell>`. Navegación prev/next entre cartas del grid con flechas `‹` / `›` (botones overlay a los lados de la imagen en móvil, flotando fuera en `md+`) y teclas `ArrowLeft` / `ArrowRight`; deshabilitadas en los bordes. Si `card.backImageUrl` existe (DFCs), muestra además un `FlipButton` (icono rotate-ccw) posicionado en el lado derecho justo debajo del NavArrow derecho (`right-2 md:-right-14`, `top: calc(50% + 30px)`); alterna entre `imageUrl` y `backImageUrl` con estado local `showBack`. También activable con tecla `R`. Al navegar a otra carta resetea `showBack=false`. Helpers internos: `NavArrow`, `FlipButton`. Props: card, onClose, onPrev?, onNext?, hasPrev?, hasNext?.
- **deck-toolbar.tsx** — `DeckToolbar` Client Component. Barra flotante (bottom-center) que aparece cuando hay cartas añadidas. Botones: **Importar a mazo** (prompt nombre → POST `/api/decks`), **Exportar** (abre `ExportModal`), vaciar lista. Genera texto de exportación estilo MTGA (`Deck\n<count> <name> (<SET>)`). Props: cards: CardSummary[], onClear.
- **export-modal.tsx** — `ExportModal` Client Component. Envuelto en `<ModalShell>`. Textarea readonly con el texto del mazo y botones **Copiar** (clipboard) / **Descargar .txt**. Props: text, onClose.
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
- **Mayoría Server Components** — `card-grid`, `card-modal` y `filter-bar` usan "use client" (popup de carta y auto-filtro con debounce)
- **CSS variables** via inline styles — no hardcoded colors, todo themeable
- **Props tipados** con interfaces locales — sin barrel exports por ahora
- **CardSummary** del domain como tipo compartido entre molecules/organisms

## Dependencies
- `next/link`, `next/image`
- `@/domain/card/card-types` (CardSummary)
- `@/domain/deck/deck-types` (DeckSummary — usado por `DeckList`)
- `@/lib/format-date`, `@/lib/use-modal-dismiss`, `@/lib/aggregate-card-counts`, `@/lib/get-error-message`

## Gotchas
- `CardThumbnail` usa `unoptimized` en Image porque Scryfall ya sirve optimizado
- `FilterBar` tiene `key` en el form para resetear defaultValues cuando cambian los filtros
- `Select` determina color muted basado en si `defaultValue` es vacío
