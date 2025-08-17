"use client";

import { useEffect, useRef } from "react";

export default function AdminModal({
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
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className="fixed inset-0 z-[200] flex min-h-dvh items-end justify-center p-3 md:items-center"
      ref={ref}
      onMouseDown={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-[201] w-full max-w-xl rounded-2xl border border-black/10 bg-[var(--background)] p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 hover:bg-white"
        >
          ✕
        </button>
        {title && <h3 className="mb-3 text-lg font-bold">{title}</h3>}
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
