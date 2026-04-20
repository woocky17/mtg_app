import Image from "next/image";
import type { MouseEvent } from "react";
import type { CardSummary } from "@/domain/card/card-types";

const RARITY_COLOR: Record<string, string> = {
  common:   "var(--text-muted)",
  uncommon: "#9ab0c4",
  rare:     "#c8a86b",
  mythic:   "#e07a30",
};

interface CardThumbnailProps {
  card: CardSummary;
  added?: boolean;
  onAdd?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export function CardThumbnail({ card, added, onAdd }: CardThumbnailProps) {
  return (
    // `relative` sin `overflow-hidden` — el botón `+` se posiciona al borde
    // izquierdo sobresaliendo la mitad fuera. El border y radio se aplican al
    // wrapper pero el clip de la imagen se hace en el div interno.
    <div
      className="relative rounded-lg transition-transform hover:-translate-y-1 cursor-pointer flex flex-col"
      style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
      title={card.name}
    >
      <div className="aspect-[63/88] relative overflow-hidden rounded-t-lg">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            sizes="200px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-sm text-center px-2"
            style={{ color: "var(--text-muted)" }}
          >
            {card.name}
          </div>
        )}
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          aria-label={added ? "Quitar de la lista" : "Añadir a la lista"}
          title={added ? "Añadida — click para quitar" : "Añadir a la lista"}
          // `left-0 -translate-x-1/2` coloca el centro del botón en el borde
          // izquierdo de la carta → mitad dentro, mitad fuera.
          className="absolute top-2 left-0 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-base font-bold shadow-md transition-transform hover:scale-110"
          style={{
            background: added ? "var(--accent)" : "rgba(0, 0, 0, 0.75)",
            color: "#fff",
            border: added ? "1px solid var(--accent)" : "1px solid rgba(255,255,255,0.25)",
          }}
        >
          {added ? "✓" : "+"}
        </button>
      )}
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
          {card.typeLine}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span
            className="text-xs uppercase"
            style={{
              color: RARITY_COLOR[card.rarity] ?? "var(--text-muted)",
              fontSize: "9px",
              letterSpacing: "0.05em",
            }}
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
}
