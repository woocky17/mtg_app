"use client";

import { useState } from "react";
import type { CardSummary } from "@/domain/card/card-types";
import { ExportModal } from "@/components/organisms/export-modal";
import { aggregateCardCounts } from "@/lib/aggregate-card-counts";
import { getErrorMessage } from "@/lib/get-error-message";

interface DeckToolbarProps {
  cards: CardSummary[];
  onClear: () => void;
}

function buildDeckText(cards: CardSummary[]): string {
  const lines = ["Deck"];
  for (const { count, card } of aggregateCardCounts(cards)) {
    lines.push(`${count} ${card.name} (${card.set.toUpperCase()})`);
  }
  return lines.join("\n");
}

export function DeckToolbar({ cards, onClear }: DeckToolbarProps) {
  const [showExport, setShowExport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleImport = async () => {
    const name = window.prompt("Nombre del mazo:");
    if (!name) return;
    setImporting(true);
    setFeedback(null);
    try {
      const payload = {
        name,
        cards: aggregateCardCounts(cards).map(({ cardId, count }) => ({ cardId, count })),
      };
      const res = await fetch("/api/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      setFeedback(`Mazo "${name}" guardado`);
      setTimeout(() => setFeedback(null), 2500);
    } catch (error) {
      setFeedback(`Error: ${getErrorMessage(error, "Error al guardar el mazo")}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <>
      <div
        className="fixed bottom-16 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 shadow-xl"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
        }}
      >
        <span
          className="px-2 text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {cards.length} {cards.length === 1 ? "carta" : "cartas"}
        </span>
        <div className="h-5" style={{ borderLeft: "1px solid var(--border)" }} />
        <button
          type="button"
          onClick={handleImport}
          disabled={importing}
          className="rounded-full px-3 py-1.5 text-sm font-medium disabled:opacity-50"
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          {importing ? "Guardando..." : "Importar a mazo"}
        </button>
        <button
          type="button"
          onClick={() => setShowExport(true)}
          className="rounded-full px-3 py-1.5 text-sm"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        >
          Exportar
        </button>
        <button
          type="button"
          onClick={onClear}
          aria-label="Vaciar lista"
          title="Vaciar lista"
          className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          ×
        </button>
        {feedback && (
          <span
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-3 py-1 text-xs"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {feedback}
          </span>
        )}
      </div>
      {showExport && (
        <ExportModal text={buildDeckText(cards)} onClose={() => setShowExport(false)} />
      )}
    </>
  );
}
