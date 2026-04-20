"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/atoms/input";

export interface ComboOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  value: string;
  options: ComboOption[];
  onChange: (value: string) => void;
  onCommit: (value: string) => void;
  placeholder?: string;
  width?: string;
  name?: string;
  /**
   * Si es `true`, filtra `options` mostrando solo las que contienen (case-
   * insensitive) la substring que el usuario ha tecleado. Cuando el campo
   * está vacío se muestran todas. Por defecto muestra todas sin filtrar.
   */
  filterByInput?: boolean;
  /** Llama a `onCommit` al pulsar Enter. */
  commitOnEnter?: boolean;
  /** Llama a `onCommit` al perder el foco si el valor cambió desde el último commit. */
  commitOnBlur?: boolean;
}

export function Combobox({
  value,
  options,
  onChange,
  onCommit,
  placeholder,
  width = "160px",
  name,
  filterByInput = false,
  commitOnEnter = false,
  commitOnBlur = false,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Valor del último commit — sirve para decidir si el blur debe disparar un
  // commit adicional. Se actualiza en cada commit y cuando el prop `value`
  // cambia externamente (p. ej. "Limpiar filtros" o navegación).
  const lastCommittedRef = useRef(value);
  // Flag que se levanta durante `selectOption` para evitar que un blur
  // inmediato posterior (click en otro elemento) dispare `onCommit` con el
  // valor stale del prop (React no ha re-renderizado todavía con el valor de
  // la opción elegida). Se baja en el siguiente tick.
  const isCommittingRef = useRef(false);

  const selectOption = (v: string) => {
    isCommittingRef.current = true;
    lastCommittedRef.current = v;
    onCommit(v);
    setOpen(false);
    // NO llamamos `inputRef.current?.blur()` — disparaba onBlur ANTES de que
    // React re-renderizase con el nuevo value, haciendo que el commit-on-blur
    // pisara la selección con el valor stale que el usuario había tecleado.
    // El input mantiene el foco; si el usuario teclea más, el dropdown se
    // reabre vía el `setOpen(true)` del onChange.
    setTimeout(() => {
      isCommittingRef.current = false;
    }, 100);
  };

  const clear = () => {
    lastCommittedRef.current = "";
    onCommit("");
    inputRef.current?.focus();
  };

  const visibleOptions =
    filterByInput && value
      ? options.filter((o) => {
          const needle = value.toLowerCase();
          return (
            o.value.toLowerCase().includes(needle) ||
            o.label.toLowerCase().includes(needle)
          );
        })
      : options;

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          // Reabre el dropdown al teclear tras una selección previa (cuando
          // `selectOption` lo cerró pero el input mantuvo el foco).
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
          // Skip si estamos en mitad de un selectOption — el blur podría
          // dispararse antes de que React re-renderice el prop `value` con
          // el valor de la opción elegida.
          if (isCommittingRef.current) return;
          if (commitOnBlur && value !== lastCommittedRef.current) {
            lastCommittedRef.current = value;
            onCommit(value);
          }
        }}
        onKeyDown={(e) => {
          if (commitOnEnter && e.key === "Enter") {
            e.preventDefault();
            lastCommittedRef.current = value;
            onCommit(value);
            setOpen(false);
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        width={width}
        className="h-9"
        style={{ paddingRight: value ? "28px" : undefined }}
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          aria-label="Limpiar"
          title="Limpiar"
          onMouseDown={(e) => {
            e.preventDefault();
            clear();
          }}
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-sm"
          style={{ background: "var(--surface-3)", color: "var(--text-secondary)" }}
        >
          ×
        </button>
      )}
      {open && visibleOptions.length > 0 && (
        <ul
          className="absolute left-0 top-full z-30 mt-1 max-h-60 w-full overflow-y-auto rounded text-sm shadow-lg"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
        >
          {visibleOptions.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(o.value);
                }}
                className="block w-full px-3 py-1.5 text-left hover:brightness-125"
                style={{ color: "var(--text-primary)" }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
