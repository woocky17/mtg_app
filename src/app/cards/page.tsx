import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../lib/prisma";

const PAGE_SIZE = 100;

const COLORS = [
  { value: "W", label: "Blanco", symbol: "☀" },
  { value: "U", label: "Azul",   symbol: "💧" },
  { value: "B", label: "Negro",  symbol: "💀" },
  { value: "R", label: "Rojo",   symbol: "🔥" },
  { value: "G", label: "Verde",  symbol: "🌲" },
];

const RARITIES = [
  { value: "common",   label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare",     label: "Rare" },
  { value: "mythic",   label: "Mythic" },
];

interface SearchParams {
  page?: string;
  name?: string;
  color?: string;
  rarity?: string;
  type?: string;
  set?: string;
}

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const page   = Math.max(1, parseInt(params.page  ?? "1", 10));
  const name   = params.name?.trim()   ?? "";
  const color  = params.color?.trim()  ?? "";
  const rarity = params.rarity?.trim() ?? "";
  const type   = params.type?.trim()   ?? "";
  const set    = params.set?.trim()    ?? "";

  // Build Prisma where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (name)   where.name       = { contains: name,   mode: "insensitive" };
  if (rarity) where.rarity     = rarity;
  if (type)   where.type_line  = { contains: type,   mode: "insensitive" };
  if (set)    where.set        = { equals: set.toLowerCase() };
  if (color)  where.color_identity = { has: color };

  const [total, cards] = await Promise.all([
    prisma.card.count({ where }),
    prisma.card.findMany({
      where,
      orderBy: [{ name: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        type_line: true,
        mana_cost: true,
        rarity: true,
        set: true,
        set_name: true,
        image_uris: true,
        card_faces: true,
        colors: true,
        color_identity: true,
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Helper to build URL with updated params
  function buildUrl(overrides: Partial<SearchParams>) {
    const p: Record<string, string> = {};
    if (name)   p.name   = name;
    if (color)  p.color  = color;
    if (rarity) p.rarity = rarity;
    if (type)   p.type   = type;
    if (set)    p.set    = set;
    p.page = String(page);
    Object.assign(p, overrides);
    if (p.page === "1") delete p.page;
    return "/cards?" + new URLSearchParams(p).toString();
  }

  function getImageUrl(card: typeof cards[number]): string | null {
    if (card.image_uris && typeof card.image_uris === "object") {
      return (card.image_uris as Record<string, string>).normal ?? null;
    }
    // double-faced card
    if (Array.isArray(card.card_faces)) {
      const face = (card.card_faces as Array<Record<string, unknown>>)[0];
      if (face?.image_uris && typeof face.image_uris === "object") {
        return (face.image_uris as Record<string, string>).normal ?? null;
      }
    }
    return null;
  }

  const rarityColor: Record<string, string> = {
    common:   "var(--text-muted)",
    uncommon: "#9ab0c4",
    rare:     "#c8a86b",
    mythic:   "#e07a30",
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--surface-0)" }}>

      {/* Top bar */}
      <header
        className="flex items-center justify-between px-6 shrink-0"
        style={{ height: "52px", borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}
      >
        <Link
          href="/"
          className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "var(--accent)", letterSpacing: "0.18em" }}
        >
          MTG
        </Link>
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {total.toLocaleString("es")} cartas encontradas
        </span>
      </header>

      {/* Filter bar */}
      <form
        key={`${name}-${type}-${set}-${color}-${rarity}`}
        method="GET"
        action="/cards"
        className="flex flex-wrap items-center gap-2 px-6 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}
      >
        {/* Name */}
        <input
          name="name"
          defaultValue={name}
          placeholder="Nombre..."
          className="px-3 py-1.5 rounded text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            width: "200px",
          }}
        />

        {/* Type */}
        <input
          name="type"
          defaultValue={type}
          placeholder="Tipo..."
          className="px-3 py-1.5 rounded text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            width: "160px",
          }}
        />

        {/* Set */}
        <input
          name="set"
          defaultValue={set}
          placeholder="Código set..."
          className="px-3 py-1.5 rounded text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            width: "120px",
          }}
        />

        {/* Color */}
        <select
          name="color"
          defaultValue={color}
          className="px-3 py-1.5 rounded text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: color ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          <option value="">Color...</option>
          {COLORS.map((c) => (
            <option key={c.value} value={c.value}>{c.symbol} {c.label}</option>
          ))}
        </select>

        {/* Rarity */}
        <select
          name="rarity"
          defaultValue={rarity}
          className="px-3 py-1.5 rounded text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: rarity ? "var(--text-primary)" : "var(--text-muted)",
          }}
        >
          <option value="">Rareza...</option>
          {RARITIES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="px-4 py-1.5 rounded text-sm font-medium"
          style={{ background: "var(--accent)", color: "#0d0d10" }}
        >
          Filtrar
        </button>

        {/* Clear */}
        {(name || color || rarity || type || set) && (
          <Link
            href="/cards"
            className="px-3 py-1.5 rounded text-sm"
            style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {cards.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            No se encontraron cartas con estos filtros.
          </p>
        ) : (
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
          >
            {cards.map((card) => {
              const imgUrl = getImageUrl(card);
              return (
                <div
                  key={card.id}
                  className="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer flex flex-col"
                  style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
                  title={card.name}
                >
                  {/* Card image */}
                  <div className="aspect-[63/88] relative">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={card.name}
                        fill
                        sizes="160px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-xs text-center px-2"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {card.name}
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="px-2 py-1.5">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {card.name}
                    </p>
                    <p
                      className="text-xs truncate mt-0.5"
                      style={{ color: "var(--text-muted)", fontSize: "10px" }}
                    >
                      {card.type_line}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span
                        className="text-xs uppercase"
                        style={{ color: rarityColor[card.rarity] ?? "var(--text-muted)", fontSize: "9px", letterSpacing: "0.05em" }}
                      >
                        {card.rarity[0].toUpperCase()}
                      </span>
                      <span
                        className="text-xs uppercase"
                        style={{ color: "var(--text-muted)", fontSize: "9px" }}
                      >
                        {card.set.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-6 py-3 shrink-0"
        style={{ borderTop: "1px solid var(--border)", background: "var(--surface-1)" }}
      >
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Página {page} de {totalPages} · {total.toLocaleString("es")} cartas
        </span>

        <div className="flex items-center gap-1">
          {/* First */}
          {page > 1 && (
            <Link
              href={buildUrl({ page: "1" })}
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              «
            </Link>
          )}

          {/* Prev */}
          {page > 1 && (
            <Link
              href={buildUrl({ page: String(page - 1) })}
              className="px-3 py-1 rounded text-xs"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              ‹ Anterior
            </Link>
          )}

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p = start + i;
            return (
              <Link
                key={p}
                href={buildUrl({ page: String(p) })}
                className="px-3 py-1 rounded text-xs"
                style={{
                  background: p === page ? "var(--accent)" : "var(--surface-2)",
                  border: "1px solid var(--border)",
                  color: p === page ? "#0d0d10" : "var(--text-secondary)",
                  fontWeight: p === page ? 600 : 400,
                }}
              >
                {p}
              </Link>
            );
          })}

          {/* Next */}
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(page + 1) })}
              className="px-3 py-1 rounded text-xs"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              Siguiente ›
            </Link>
          )}

          {/* Last */}
          {page < totalPages && (
            <Link
              href={buildUrl({ page: String(totalPages) })}
              className="px-2 py-1 rounded text-xs"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}
            >
              »
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
