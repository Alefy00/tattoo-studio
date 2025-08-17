"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  question: string;
  answer: React.ReactNode;
};

export default function FaqModal({ open, onClose, question, answer }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex min-h-dvh items-end justify-center p-3 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-modal-title"
      ref={dialogRef}
      onMouseDown={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {/* overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* card */}
      <div className="relative z-[121] w-full max-w-xl rounded-2xl border border-black/10 bg-[var(--background)] p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[var(--text)] hover:bg-white"
          aria-label="Fechar"
          title="Fechar"
          type="button"
        >
          ✕
        </button>

        <h3 id="faq-modal-title" className="mb-2 text-lg font-bold">
          {question}
        </h3>

        <div className="max-h-[60vh] overflow-y-auto pr-1">
          <div className="prose prose-sm max-w-none text-[var(--text)]/90">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}
