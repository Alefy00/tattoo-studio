"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Row = {
  id: string;
  short_id: string;
  type_label: string;
  status: string;
  updated_at: string;
  client?: { name?: string; email?: string };
};

const STATUS: { key: string; label: string }[] = [
  { key: "DRAFT", label: "Rascunho" },
  { key: "SENT", label: "Enviado" },
  { key: "VIEWED", label: "Visualizado" },
  { key: "SIGNED", label: "Assinado" },
  { key: "DECLINED", label: "Recusado" },
  { key: "EXPIRED", label: "Expirado" },
  { key: "CANCELED", label: "Cancelado" },
];

export default function ContractsListPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string[]>([]); // status selecionados
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const url = new URL("/api/contracts", window.location.origin);
    if (q) url.searchParams.set("q", q);
    active.forEach((s) => url.searchParams.append("status", s));
    const res = await fetch(url.toString(), { cache: "no-store" });
    const j = await res.json();
    setRows(j.items ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-line */ }, []);

  function toggleStatus(s: string) {
    setActive((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Contratos</h1>

      {/* Filtros no seu visual */}
      <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-4 space-y-3">
        <div className="flex gap-2">
          <input
            className="w-full rounded-full border border-black/20 bg-white/70 px-3 py-2 text-sm"
            placeholder="Buscar por #ID, tipo ou e-mail do cliente"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            onClick={load}
            className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
          >
            Buscar
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS.map((s) => (
            <button
              key={s.key}
              onClick={() => toggleStatus(s.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold border border-black/20 hover:bg-white
                ${active.includes(s.key) ? "bg-white" : "bg-white/60"}`}
            >
              {s.label}
            </button>
          ))}
          {active.length > 0 && (
            <button
              onClick={() => { setActive([]); setQ(""); }}
              className="ml-auto rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Tabela/cards */}
      <div className="rounded-2xl border border-black/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/70">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Atualizado</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="p-3 text-xs opacity-70" colSpan={6}>Carregando…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td className="p-6 text-center text-sm opacity-70" colSpan={6}>Nenhum contrato encontrado.</td></tr>
            )}
            {rows.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.short_id}</td>
                <td className="p-3">
                  {c.client?.name ?? "—"} <span className="opacity-60">{c.client?.email ?? ""}</span>
                </td>
                <td className="p-3">{c.type_label}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{new Date(c.updated_at).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <Link href={`/admin/contracts/${c.id}`} className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
