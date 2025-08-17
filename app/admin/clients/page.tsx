// app/admin/clients/page.tsx
"use client";

import { useMemo, useState } from "react";
import AdminModal from "../_components/AdminModal";
import WhatsAppButton from "../../(components)/WhatsAppButton";

type Client = { id: string; name: string; contact: string; style?: string; last?: string };

const MOCK: Client[] = [
  { id: "1", name: "Ana Souza", contact: "5561999887766", style: "Fine line", last: "2025-08-10" },
  { id: "2", name: "Rafael Lima", contact: "5562987654321", style: "Blackwork", last: "2025-07-22" },
  { id: "3", name: "Júlia Reis", contact: "5561981122334", style: "Floral", last: "2025-06-30" },
];

export default function AdminClientsPage() {
  const [q, setQ] = useState("");
  const [current, setCurrent] = useState<Client | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return MOCK;
    return MOCK.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Clientes</h1>

      <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <input
            placeholder="Buscar por nome..."
            value={q}
            onChange={(e)=> setQ(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          />
          <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5">
            Novo cliente
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 text-left text-xs font-semibold uppercase tracking-wide opacity-70">
              <tr>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">Contato</th>
                <th className="px-3 py-2">Estilo</th>
                <th className="px-3 py-2">Última visita</th>
                <th className="px-3 py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c)=> (
                <tr key={c.id} className="border-b border-black/10 last:border-0">
                  <td className="px-3 py-2 font-medium">{c.name}</td>
                  <td className="px-3 py-2">{c.contact}</td>
                  <td className="px-3 py-2">{c.style ?? "-"}</td>
                  <td className="px-3 py-2">{c.last ?? "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={()=> setCurrent(c)}
                        className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                      >
                        Ver
                      </button>
                      <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">
                        Contrato
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center opacity-70">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalhes do cliente */}
      <AdminModal
        open={!!current}
        onClose={() => setCurrent(null)}
        title={current?.name}
        footer={
          <>
            <button className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5">
              Editar
            </button>
            <button className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90">
              Fechar
            </button>
          </>
        }
      >
        {current && (
          <div className="space-y-3 text-sm">
            <div><span className="font-semibold">Contato: </span>{current.contact}</div>
            <div><span className="font-semibold">Estilo: </span>{current.style ?? "-"}</div>
            <div><span className="font-semibold">Última visita: </span>{current.last ?? "-"}</div>

            <div className="rounded-xl border border-black/10 bg-white/70 p-3">
              <div className="mb-2 text-xs font-semibold uppercase opacity-70">Atalhos</div>
              <div className="flex flex-wrap gap-2">
                <WhatsAppButton label="Chamar no WhatsApp" source="Admin • Cliente" variant="outline" />
                <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">
                  Enviar contrato
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-white/70 p-3">
              <div className="mb-2 text-xs font-semibold uppercase opacity-70">Histórico</div>
              <ul className="space-y-1">
                <li>2025-06-30 — Floral (consulta)</li>
                <li>2025-03-12 — Fine line (retoque)</li>
              </ul>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
