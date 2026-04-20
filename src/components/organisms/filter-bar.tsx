"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Combobox } from "@/components/molecules/combobox";
import { useDebouncedRouterPush } from "@/lib/use-debounced-router-push";
import { buildCardsUrl } from "@/app/cards/search-params";
import type { SetSummary } from "@/domain/card/card-types";
import type { ColorMatchMode } from "@/domain/card/card-filters";

const COLORS = [
  { value: "W", label: "☀", title: "Blanco" },
  { value: "U", label: "💧", title: "Azul" },
  { value: "B", label: "💀", title: "Negro" },
  { value: "R", label: "🔥", title: "Rojo" },
  { value: "G", label: "🌲", title: "Verde" },
];

const RARITIES = [
  { value: "common",   label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare",     label: "Rare" },
  { value: "mythic",   label: "Mythic" },
];

const COLOR_MODES = [
  { value: "and", label: "Todos" },
  { value: "or",  label: "Alguno" },
];

const CARD_TYPES = [
  { value: "Creature",     label: "Creature" },
  { value: "Planeswalker", label: "Planeswalker" },
  { value: "Instant",      label: "Instant" },
  { value: "Sorcery",      label: "Sorcery" },
  { value: "Artifact",     label: "Artifact" },
  { value: "Enchantment",  label: "Enchantment" },
  { value: "Land",         label: "Land" },
  { value: "Battle",       label: "Battle" },
  { value: "Kindred",      label: "Kindred" },
];

const DEBOUNCE_MS = 1000;

interface FilterBarProps {
  name: string;
  type: string;
  set: string;
  colors: string[];
  colorMode: ColorMatchMode;
  rarity: string;
  includeExtras: boolean;
  sets: SetSummary[];
}

type FilterState = Omit<FilterBarProps, "sets">;

function stateToUrl(state: FilterState): string {
  return buildCardsUrl(state, { page: "1" });
}

export function FilterBar({
  name,
  type,
  set,
  colors,
  colorMode,
  rarity,
  includeExtras,
  sets,
}: FilterBarProps) {
  const initial: FilterState = { name, type, set, colors, colorMode, rarity, includeExtras };
  const [state, setState] = useState<FilterState>(initial);
  // `true` mientras haya un input de texto del FilterBar con foco. Evita que
  // un response stale del server (p. ej. un push antiguo que termina de volver
  // mientras el usuario sigue tecleando) pise el estado local y le borre la
  // escritura en curso.
  const [anyInputFocused, setAnyInputFocused] = useState(false);

  const { pushNow, pushDebounced, cancel } = useDebouncedRouterPush(
    DEBOUNCE_MS,
    stateToUrl(initial),
  );

  const propsKey = `${name}|${type}|${set}|${colors.join(",")}|${colorMode}|${rarity}|${includeExtras}`;
  const stateKey = `${state.name}|${state.type}|${state.set}|${state.colors.join(",")}|${state.colorMode}|${state.rarity}|${state.includeExtras}`;
  const [lastPropsKey, setLastPropsKey] = useState(propsKey);
  if (lastPropsKey !== propsKey) {
    // Dos guards:
    // (1) Si `stateKey === propsKey`, es el echo de un push propio — nada que
    //     sincronizar, el estado ya coincide.
    // (2) Si hay un input con foco, puede ser un response stale llegando
    //     mientras el usuario sigue tecleando; NO pisamos su escritura.
    //     Dejamos `lastPropsKey` sin actualizar para reintentarlo en un
    //     render posterior (p. ej. tras el blur).
    if (stateKey === propsKey) {
      setLastPropsKey(propsKey);
    } else if (!anyInputFocused) {
      setLastPropsKey(propsKey);
      setState(initial);
    }
  }

  const update = (patch: Partial<FilterState>, immediate = true) => {
    const next = { ...state, ...patch };
    setState(next);
    if (immediate) pushNow(stateToUrl(next));
    else pushDebounced(stateToUrl(next));
  };

  const toggleColor = (color: string) => {
    const nextColors = state.colors.includes(color)
      ? state.colors.filter((c) => c !== color)
      : [...state.colors, color];
    update({ colors: nextColors });
  };

  const hasFilters =
    state.name || state.colors.length > 0 || state.rarity || state.type || state.set;

  return (
    <div
      className="flex flex-wrap items-center gap-2 px-6 py-3 shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}
      onFocusCapture={(e) => {
        if ((e.target as HTMLElement).tagName === "INPUT") setAnyInputFocused(true);
      }}
      onBlurCapture={(e) => {
        if ((e.target as HTMLElement).tagName === "INPUT") setAnyInputFocused(false);
      }}
    >
      <Input
        name="name"
        value={state.name}
        onChange={(e) => update({ name: e.target.value }, false)}
        placeholder="Nombre..."
        width="200px"
        className="h-9"
      />

      <Combobox
        name="type"
        value={state.type}
        options={CARD_TYPES}
        onChange={(value) => update({ type: value }, false)}
        onCommit={(value) => {
          cancel();
          update({ type: value });
        }}
        placeholder="Tipo..."
      />

      <Combobox
        name="set"
        value={state.set}
        options={sets.map((s) => ({
          value: s.code,
          label: `${s.code.toUpperCase()} — ${s.name}`,
        }))}
        // Tecleo manual: solo estado local, sin push hasta Enter / blur / click
        // en una opción del dropdown.
        onChange={(value) => setState((prev) => ({ ...prev, set: value }))}
        onCommit={(value) => {
          cancel();
          const next = { ...state, set: value };
          setState(next);
          pushNow(stateToUrl(next));
        }}
        placeholder="Set..."
        width="170px"
        filterByInput
        commitOnEnter
        commitOnBlur
      />

      <div
        className="flex h-9 items-center gap-1 rounded px-1.5"
        style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        {COLORS.map((c) => {
          const checked = state.colors.includes(c.value);
          return (
            <button
              key={c.value}
              type="button"
              title={c.title}
              onClick={() => toggleColor(c.value)}
              aria-pressed={checked}
              className="flex h-7 w-7 items-center justify-center rounded text-sm transition-colors"
              style={{
                background: checked ? "var(--accent-dim)" : "transparent",
                border: checked ? "1px solid var(--accent)" : "1px solid transparent",
              }}
            >
              <span aria-hidden>{c.label}</span>
            </button>
          );
        })}
      </div>

      <Select
        value={state.colorMode}
        onChange={(e) => update({ colorMode: e.target.value as ColorMatchMode })}
        options={COLOR_MODES}
        className="h-9"
      />

      <Select
        value={state.rarity}
        onChange={(e) => update({ rarity: e.target.value })}
        placeholder="Rareza..."
        options={RARITIES}
        className="h-9"
      />

      <button
        type="button"
        onClick={() => update({ includeExtras: !state.includeExtras })}
        aria-pressed={state.includeExtras}
        title="Incluir tokens, Un-sets y memorabilia (art series, playtests)"
        className="flex h-9 items-center rounded px-3 text-sm transition-colors"
        style={{
          background: state.includeExtras ? "var(--accent-dim)" : "var(--surface-2)",
          border: state.includeExtras
            ? "1px solid var(--accent)"
            : "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        + Extras
      </button>

      {hasFilters && (
        <Link
          href="/cards"
          aria-label="Limpiar filtros"
          title="Limpiar filtros"
          className="flex h-9 w-9 items-center justify-center rounded"
          style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          <Icon name="clear-filter" size={16} />
        </Link>
      )}
    </div>
  );
}
