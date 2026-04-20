"use client";

import { useEffect } from "react";

/**
 * Escucha la tecla Escape y bloquea el scroll del body mientras el modal esté
 * montado. Llama a `onClose` cuando se pulsa Escape.
 */
export function useModalDismiss(onClose: () => void): void {
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
}
