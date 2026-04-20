"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CardSummary } from "@/domain/card/card-types";
import { ModalShell } from "@/components/organisms/modal-shell";

interface CardModalProps {
  card: CardSummary;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function CardModal({
  card,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: CardModalProps) {
  const [showBack, setShowBack] = useState(false);
  // Reset al pasar a otra carta (nueva prop `card`).
  const [lastCardId, setLastCardId] = useState(card.id);
  if (lastCardId !== card.id) {
    setLastCardId(card.id);
    setShowBack(false);
  }

  const hasBack = !!card.backImageUrl;
  const flip = () => setShowBack((v) => !v);

  // Navegación con teclado ← / → y flip con tecla `r`. `ModalShell` captura Escape.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev && onPrev) {
        e.preventDefault();
        onPrev();
      } else if (e.key === "ArrowRight" && hasNext && onNext) {
        e.preventDefault();
        onNext();
      } else if ((e.key === "r" || e.key === "R") && hasBack) {
        e.preventDefault();
        flip();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onPrev, onNext, hasPrev, hasNext, hasBack]);

  const displayUrl = showBack && card.backImageUrl ? card.backImageUrl : card.imageUrl;
  const displayLabel = showBack && hasBack ? `${card.name} (reverso)` : card.name;

  return (
    <ModalShell onClose={onClose}>
      <div className="relative" style={{ width: "min(420px, 90vw)" }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute -top-3 -right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold shadow-lg transition-transform hover:scale-110"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        >
          ×
        </button>

        {onPrev && (
          <NavArrow direction="left" onClick={onPrev} disabled={!hasPrev} />
        )}
        {onNext && (
          <NavArrow direction="right" onClick={onNext} disabled={!hasNext} />
        )}
        {hasBack && <FlipButton onClick={flip} pressed={showBack} />}

        <div
          className="overflow-hidden rounded-xl"
          style={{ border: "1px solid var(--border)", background: "var(--surface-2)" }}
        >
          <div className="aspect-[63/88] relative">
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt={displayLabel}
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
          {displayLabel} · {card.set.toUpperCase()}
        </p>
      </div>
    </ModalShell>
  );
}

interface NavArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}

function NavArrow({ direction, onClick, disabled }: NavArrowProps) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Carta anterior" : "Carta siguiente"}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-2xl font-bold shadow-lg transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-20 disabled:hover:scale-100 ${
        isLeft ? "left-2 md:-left-14" : "right-2 md:-right-14"
      }`}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      {isLeft ? "‹" : "›"}
    </button>
  );
}

interface FlipButtonProps {
  onClick: () => void;
  pressed: boolean;
}

/**
 * Botón para girar la carta (solo DFCs). Posicionado a la derecha, justo
 * debajo del NavArrow derecho: mismo offset horizontal (`right-2` en móvil,
 * `md:-right-14` en desktop) y `top` calculado para quedar 8 px debajo del
 * arrow (que está centrado verticalmente con `top-1/2 -translate-y-1/2`).
 */
function FlipButton({ onClick, pressed }: FlipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Girar carta"
      aria-pressed={pressed}
      title="Girar carta (R)"
      className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 md:-right-14"
      style={{
        top: "calc(50% + 30px)",
        background: pressed ? "var(--accent-dim)" : "var(--surface-2)",
        border: pressed ? "1px solid var(--accent)" : "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </button>
  );
}
