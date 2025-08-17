"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/schedule", label: "Agenda" },
  { href: "/admin/clients", label: "Clientes" },
  { href: "/admin/contracts", label: "Contratos" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 h-dvh border-r border-black/10 bg-[var(--primary)] p-4">
      <div className="mb-6 px-2">
        <div className="text-xs font-semibold uppercase opacity-70">Painel</div>
        <div className="text-lg font-bold">Tatuadora • Admin</div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "block rounded-lg px-3 py-2 text-sm font-semibold transition",
                active
                  ? "bg-[var(--secondary)]"
                  : "hover:bg-white/60 border border-transparent hover:border-black/10",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
