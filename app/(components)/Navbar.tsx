"use client";

import Link from "next/link";
import QuoteFormButton from "./QuoteFormButton";

export default function Navbar() {
  return (
    <header className="sticky border border-[var(--secondary)]/40 bg-[var(--primary)]/70 backdrop-blur mx-3 rounded-2xl mt-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 ">
        {/* Logo / Nome */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-[var(--text)]"
        >
          Duda Tattoo
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm font-medium">

          {/* Botão abre o modal de orçamento */}
          <QuoteFormButton label="Orçamento" source="Navbar" variant="secondary" className="px-4 py-1.5" />
        </div>
      </nav>
    </header>
  );
}
