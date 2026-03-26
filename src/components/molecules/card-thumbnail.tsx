import Image from "next/image";
import type { CardSummary } from "@/domain/card/card-types";

const RARITY_COLOR: Record<string, string> = {
  common:   "var(--text-muted)",
  uncommon: "#9ab0c4",
  rare:     "#c8a86b",
  mythic:   "#e07a30",
};

interface CardThumbnailProps {
  card: CardSummary;
}

export function CardThumbnail({ card }: CardThumbnailProps) {
  return (
    <div
      className="rounded-lg overflow-hidden transition-transform hover:-translate-y-1 cursor-pointer flex flex-col"
      style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
      title={card.name}
    >
      <div className="aspect-[63/88] relative">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
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
