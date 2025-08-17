"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserName, signOut } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function AdminTopbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [name, setName] = useState<string>("");

    useEffect(() => {
    setName(getUserName() ?? "Duda");
  }, []);


  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[var(--background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Mobile menu */}
        <button
          className="md:hidden rounded-lg border border-black/10 px-3 py-1.5 text-sm font-semibold hover:bg-black/5"
          onClick={() => setOpen((s) => !s)}
        >
          Menu
        </button>

        <div className="hidden md:block text-sm opacity-70">
          Bem-vinda, <span className="font-semibold">Duda</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
          >
            Ver site
          </Link>
          <button
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
            className="rounded-full bg-[var(--secondary)] px-3 py-1.5 text-xs font-semibold hover:opacity-90"
          >
            Sair
          </button>

        </div>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="md:hidden border-t border-black/10 bg-[var(--primary)] px-4 py-3">
          <nav className="grid gap-2">
            <Link href="/admin" className="rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold">Dashboard</Link>
            <Link href="/admin/schedule" className="rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold">Agenda</Link>
            <Link href="/admin/clients" className="rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold">Clientes</Link>
            <Link href="/admin/contracts" className="rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold">Contratos</Link>
            <Link href="/admin/settings" className="rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold">Configurações</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
