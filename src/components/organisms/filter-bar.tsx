import Link from "next/link";
import { Input } from "@/components/atoms/input";
import { Select } from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";

const COLORS = [
  { value: "W", label: "☀ Blanco" },
  { value: "U", label: "💧 Azul" },
  { value: "B", label: "💀 Negro" },
  { value: "R", label: "🔥 Rojo" },
  { value: "G", label: "🌲 Verde" },
];

const RARITIES = [
  { value: "common",   label: "Common" },
  { value: "uncommon", label: "Uncommon" },
  { value: "rare",     label: "Rare" },
  { value: "mythic",   label: "Mythic" },
];

interface FilterBarProps {
  name: string;
  type: string;
  set: string;
  color: string;
  rarity: string;
}

export function FilterBar({ name, type, set, color, rarity }: FilterBarProps) {
  const hasFilters = name || color || rarity || type || set;

  return (
    <form
      key={`${name}-${type}-${set}-${color}-${rarity}`}
      method="GET"
      action="/cards"
      className="flex flex-wrap items-center gap-2 px-6 py-3 shrink-0"
      style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-1)" }}
    >
      <Input name="name" defaultValue={name} placeholder="Nombre..." width="200px" />
      <Input name="type" defaultValue={type} placeholder="Tipo..." width="160px" />
      <Input name="set" defaultValue={set} placeholder="Código set..." width="120px" />
      <Select
        name="color"
        defaultValue={color}
        placeholder="Color..."
        options={COLORS}
      />
      <Select
        name="rarity"
        defaultValue={rarity}
        placeholder="Rareza..."
        options={RARITIES}
      />
      <Button type="submit">Filtrar</Button>
      {hasFilters && (
        <Link
          href="/cards"
          className="px-3 py-1.5 rounded text-sm"
          style={{ color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          Limpiar
        </Link>
      )}
    </form>
  );
}
