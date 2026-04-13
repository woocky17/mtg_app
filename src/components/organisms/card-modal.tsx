"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { CardSummary } from "@/domain/card/card-types";

interface CardModalProps {
  card: CardSummary;
  onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0, 0, 0, 0.75)" }}
      onClick={onClose}
    >
      <div
        className="relative"
        style={{ width: "min(420px, 90vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-110"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        >
          ×
        </button>
        <div
          className="overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <div className="aspect-[63/88] relative">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                sizes="420px"
                className="object-contain"
                unoptimized
                priority
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center p-6 text-center"
                style={{ color: "var(--text-muted)" }}
              >
                {card.name}
              </div>
            )}
          </div>
        </div>
        <p
          className="mt-3 text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {card.name} · {card.set.toUpperCase()}
        </p>
      </div>
    </div>
  );
}
