// app/admin/contracts/page.tsx
"use client";

import { useState } from "react";
import AdminModal from "../_components/AdminModal";

type Template = { id: string; title: string; updatedAt: string };
const TEMPLATES: Template[] = [
  { id: "t1", title: "Contrato padrão — pequenas", updatedAt: "2025-07-20" },
  { id: "t2", title: "Contrato blackwork — médios", updatedAt: "2025-06-05" },
];

export default function AdminContractsPage() {
  const [openNew, setOpenNew] = useState(false);
  const [openSend, setOpenSend] = useState(false);
  const [title, setTitle] = useState("Contrato padrão");
  const [body, setBody] = useState<string>(DEFAULT_BODY);
  const [price, setPrice] = useState("R$ 600,00");
  const [deposit, setDeposit] = useState("R$ 100,00");
  const [client, setClient] = useState("");

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Contratos</h1>

      <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Modelos</h2>
          <button
            onClick={() => setOpenNew(true)}
            className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
          >
            Novo contrato
          </button>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <li key={t.id} className="rounded-xl border border-black/10 bg-white/70 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="text-xs opacity-60">Atualizado em {t.updatedAt}</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">Editar</button>
                  <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">Duplicar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Composer de contrato (visual) */}
      <AdminModal
        open={openNew}
        onClose={() => setOpenNew(false)}
        title="Novo contrato"
        footer={
          <>
            <button
              onClick={() => setOpenNew(false)}
              className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Fechar
            </button>
            <button
              onClick={() => setOpenSend(true)}
              className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              Enviar
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Título</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                value={title}
                onChange={(e)=> setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valor</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                value={price}
                onChange={(e)=> setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sinal</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                value={deposit}
                onChange={(e)=> setDeposit(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cliente</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                placeholder="Nome do cliente"
                value={client}
                onChange={(e)=> setClient(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Conteúdo / Cláusulas</label>
              <textarea
                className="h-48 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                value={body}
                onChange={(e)=> setBody(e.target.value)}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-black/10 bg-white/70 p-4">
            <div className="mb-2 text-xs font-semibold uppercase opacity-70">Pré-visualização</div>
            <div className="prose prose-sm max-w-none">
              <h2 className="mb-1">{title}</h2>
              <p><strong>Valor:</strong> {price} &nbsp; • &nbsp; <strong>Sinal:</strong> {deposit}</p>
              <hr className="my-3"/>
              <pre className="whitespace-pre-wrap text-[var(--text)]/90">{body}</pre>
              <hr className="my-3"/>
              <p className="text-xs opacity-70">Cliente: {client || "—"}</p>
            </div>
          </div>
        </div>
      </AdminModal>

      {/* Enviar contrato (visual) */}
      <AdminModal
        open={openSend}
        onClose={() => setOpenSend(false)}
        title="Enviar contrato"
        footer={
          <>
            <button
              onClick={() => setOpenSend(false)}
              className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              onClick={() => setOpenSend(false)}
              className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              Enviar (mock)
            </button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="mb-1 block font-medium">Enviar via</label>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">E-mail</button>
              <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">WhatsApp</button>
              <button className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white">Link direto</button>
            </div>
          </div>
          <div>
            <label className="mb-1 block font-medium">Mensagem opcional</label>
            <textarea className="min-h-24 w-full rounded-xl border border-black/15 bg-white px-3 py-2" placeholder="Olá! Segue seu contrato para assinatura." />
          </div>
          <div className="rounded-xl border border-black/10 bg-white/70 p-3">
            <div className="text-xs font-semibold uppercase opacity-70 mb-2">Fluxo de assinatura (visual)</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Cliente abre o link e confere o contrato</li>
              <li>Cliente assina digitalmente (toque/caneta)</li>
              <li>Assinado, o PDF é enviado a ambas as partes</li>
            </ol>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}

const DEFAULT_BODY = `1) O cliente confirma estar ciente das condições de higiene e cuidados no pós-tatuagem.
2) Em caso de alteração de data, avisar com 48h de antecedência.
3) O sinal garante a reserva e é abatido do valor final.
4) Correções pequenas podem ser avaliadas após a cicatrização (4–6 semanas).`;
