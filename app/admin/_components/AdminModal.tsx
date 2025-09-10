// app/admin/_components/AdminModal.tsx
"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export default function AdminModal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  disableBackdropClose = false,
  stickyFooter = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: Size;
  disableBackdropClose?: boolean;
  stickyFooter?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // bloquear scroll da página + ESC para fechar
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

  if (!open) return null;

  const maxW = {
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    "2xl": "max-w-4xl",
    "3xl": "max-w-5xl",
    "4xl": "max-w-6xl",
  }[size];

  return (
    <div
      className="fixed inset-0 z-[200] flex min-h-dvh items-end justify-center p-3 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "admin-modal-title" : undefined}
      ref={containerRef}
      onMouseDown={(e) => {
        // fecha só se clicar no backdrop (fora da caixa)
        if (!disableBackdropClose && e.currentTarget === e.target) onClose();
      }}
    >
      {/* Backdrop clicável */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Caixa do modal */}
      <div
        className={clsx(
          "relative z-[201] w-full rounded-2xl border border-black/10 bg-[var(--background)] shadow-xl",
          maxW
        )}
        // impedir que o clique dentro da caixa borbulhe para o container
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 hover:bg-white"
          aria-label="Fechar"
        >
          ✕
        </button>

        {title && (
          <h3 id="admin-modal-title" className="mb-3 px-5 pt-5 text-lg font-bold">
            {title}
          </h3>
        )}

        <div className={clsx("max-h-[70vh] overflow-y-auto px-5", stickyFooter ? "pb-20" : "pb-5")}>
          {children}
        </div>

        {footer && (
          <div
            className={clsx(
              "border-t border-black/10 bg-[var(--background)]",
              stickyFooter
                ? "sticky bottom-0 z-[202] px-5 py-4"
                : "px-5 py-4"
            )}
          >
            <div className="flex justify-end gap-2">{footer}</div>
          </div>
        )}
      </div>
    </div>
  );
}
