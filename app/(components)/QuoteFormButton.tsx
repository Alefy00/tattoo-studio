"use client";

import { useState } from "react";
import QuoteFormModal from "./QuoteFormModal";

type Props = {
  label?: string;
  source?: string;
  initialStyle?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
};

export default function QuoteFormButton({
  label = "Solicitar orçamento",
  source,
  initialStyle,
  variant = "secondary",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  const base =
    "rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none";
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-[var(--primary)] text-[var(--text)] hover:opacity-90",
    secondary: "bg-[var(--secondary)] text-[var(--text)] hover:opacity-90",
    outline: "border border-black/20 hover:bg-black/5",
    ghost: "hover:bg-black/5",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {label}
      </button>

      <QuoteFormModal
        open={open}
        onClose={() => setOpen(false)}
        source={source}
        initialStyle={initialStyle}
      />
    </>
  );
}
