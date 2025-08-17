"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SiteModal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    // cria/recicla um nó único no <body>
    let el = document.getElementById("modal-root") as HTMLDivElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = "modal-root";
      document.body.appendChild(el);
    }
    hostRef.current = el;
    setReady(true);
    return () => { /* não remove o root para ser reutilizado */ };
  }, []);

  // scroll lock + fechar com ESC
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !ready || !hostRef.current) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] isolate"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      aria-modal="true"
      role="dialog"
    >
      {/* backdrop cobrindo TUDO */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      {/* container central */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="relative w-full max-w-lg rounded-2xl border border-black/20 bg-[var(--background)] p-5 shadow-2xl">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/20 bg-white/80 hover:bg-white"
          >
            ✕
          </button>
          {title && <h3 className="mb-3 text-lg font-bold">{title}</h3>}
          <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
          {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
        </div>
      </div>
    </div>,
    hostRef.current
  );
}
