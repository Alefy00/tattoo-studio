"use client";

import Link from "next/link";
import QuoteFormButton from "./QuoteFormButton";

export default function Navbar() {
  return (
    <header className="sticky z-40 mx-3 mt-3 rounded-2xl border border-[var(--secondary)]/40 bg-[var(--primary)]/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 justify-center">
        <Link href="/" className="text-lg font-semibold tracking-tight text-[var(--text)] justify-center">
          Duda Tattoo
        </Link>

      </nav>
    </header>
  );
}
