"use client";

import { useState } from "react";
import { ModalShell } from "@/components/organisms/modal-shell";

interface ExportModalProps {
  text: string;
  onClose: () => void;
}

export function ExportModal({ text, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mazo.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ModalShell onClose={onClose}>
      <div
        className="flex w-full max-w-xl flex-col rounded-xl"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Exportar mazo (texto)
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-8 w-8 items-center justify-center rounded text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            ×
          </button>
        </div>
        <textarea
          readOnly
          value={text}
          className="m-5 h-80 resize-none rounded p-3 font-mono text-sm outline-none"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
        />
        <div
          className="flex items-center justify-end gap-2 px-5 py-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            type="button"
            onClick={download}
            className="rounded px-3 py-1.5 text-sm"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            Descargar .txt
          </button>
          <button
            type="button"
            onClick={copy}
            className="rounded px-3 py-1.5 text-sm font-medium"
            style={{
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            {copied ? "¡Copiado!" : "Copiar"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
