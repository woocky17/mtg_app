"use client";

import type { ReactNode } from "react";
import { useModalDismiss } from "@/lib/use-modal-dismiss";

interface ModalShellProps {
  onClose: () => void;
  children: ReactNode;
}

/**
 * Backdrop oscurecido fijo + bloqueo de scroll + cierre con Escape / click fuera.
 * El contenido interior detiene la propagación del click para no cerrar al
 * interactuar con él.
 */
export function ModalShell({ onClose, children }: ModalShellProps) {
  useModalDismiss(onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0, 0, 0, 0.75)" }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="contents">
        {children}
      </div>
    </div>
  );
}
