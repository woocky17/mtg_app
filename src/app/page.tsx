import Link from "next/link";
import { Header } from "@/components/organisms/header";
import { MainLayout } from "@/components/templates/main-layout";
import { AlertBox } from "@/components/molecules/alert-box";
import { DeckList } from "@/components/molecules/deck-list";
import { EmptyDecksState } from "@/components/molecules/empty-decks-state";
import { getHomeStatsUseCase } from "@/infrastructure/container";
import type { HomeStats } from "@/application/home/get-home-stats-use-case";
import { NAV_ITEMS } from "@/lib/nav-items";
import { getErrorMessage } from "@/lib/get-error-message";

const ACTIONS = [
  {
    href: "/cards",
    title: "Explorar cartas",
    description: "Busca entre todas las cartas por nombre, color, tipo, set o rareza.",
    icon: "🔍",
    cta: "Abrir buscador →",
  },
  {
    href: "/decks",
    title: "Mazos",
    description: "Consulta los mazos que has guardado o crea uno nuevo desde el buscador de cartas.",
    icon: "🃏",
    cta: "Ver mazos →",
  },
  {
    href: "#",
    title: "Colección",
    description: "Gestiona tu colección personal y consulta qué tienes disponible. (Próximamente)",
    icon: "📚",
    cta: "Próximamente",
    disabled: true,
  },
];

export default async function Home() {
  let stats: HomeStats | null = null;
  let error: string | null = null;
  try {
    stats = await getHomeStatsUseCase.execute();
  } catch (e) {
    error = getErrorMessage(e, "Error cargando datos");
  }

  return (
    <MainLayout header={<Header navItems={NAV_ITEMS} />}>
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
          <section>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              MTG App
            </h1>
            <p
              className="mt-3 max-w-2xl text-base"
              style={{ color: "var(--text-secondary)" }}
            >
              Busca cartas de Magic: The Gathering, construye tus mazos y
              expórtalos en el formato estándar.
            </p>
          </section>

          <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard
              label="Cartas en la base"
              value={stats ? stats.cardCount.toLocaleString("es") : "—"}
              error={!!error}
            />
            <StatCard
              label="Mazos creados"
              value={stats ? stats.deckCount.toLocaleString("es") : "—"}
              error={!!error}
            />
            <StatCard
              label="Formato"
              value="Texto MTGA"
              subtle
            />
          </section>

          {error && (
            <AlertBox>No se han podido cargar las estadísticas: {error}</AlertBox>
          )}

          <section>
            <h2
              className="mb-4 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Acciones rápidas
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ACTIONS.map((a) => (
                <ActionCard key={a.title} {...a} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Mazos recientes
              </h2>
              <Link
                href="/decks"
                className="text-xs"
                style={{ color: "var(--accent)" }}
              >
                Ver todos →
              </Link>
            </div>
            {stats && stats.recentDecks.length > 0 ? (
              <DeckList decks={stats.recentDecks} />
            ) : (
              <EmptyDecksState />
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}

function StatCard({
  label,
  value,
  error,
  subtle,
}: {
  label: string;
  value: string;
  error?: boolean;
  subtle?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
      }}
    >
      <p
        className="text-xs uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-2xl font-bold"
        style={{
          color: error
            ? "var(--text-muted)"
            : subtle
              ? "var(--text-secondary)"
              : "var(--accent)",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon,
  cta,
  disabled,
}: {
  href: string;
  title: string;
  description: string;
  icon: string;
  cta: string;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className="flex h-full flex-col rounded-lg p-5 transition-transform"
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      <div className="text-3xl">{icon}</div>
      <h3
        className="mt-3 text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      <p
        className="mt-1 flex-1 text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>
      <p
        className="mt-4 text-xs font-medium"
        style={{ color: disabled ? "var(--text-muted)" : "var(--accent)" }}
      >
        {cta}
      </p>
    </div>
  );

  if (disabled) return inner;
  return (
    <Link href={href} className="block hover:-translate-y-0.5">
      {inner}
    </Link>
  );
}
