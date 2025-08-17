"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminModal from "../_components/AdminModal";
import WhatsAppButton from "../../(components)/WhatsAppButton";
import NewClientModal, { NewClientData } from "../_components/NewClientModal";
import SendContractModal, { Template } from "../_components/SendContractModal";

type Client = {
  id: string;
  name: string;
  contact: string;
  contactType: "whatsapp" | "email";
  style?: string;
  last?: string;
  instagram?: string;
  note?: string;
  refs?: { name: string; url: string; size: number }[];
};

const MOCK: Client[] = [
  {
    id: "4",
    name: "Eduarda Martins",
    contact: "5561998765432",
    contactType: "whatsapp",
    style: "Realismo",
    last: "2025-08-15",
    instagram: "@duda.tattoo",
    note:
      "Alergia leve a látex; prefere sessões à tarde. Projeto floral realista ~13cm no antebraço.",
    refs: [
      { name: "ref-2.jpg", url: "/branding/duda_new.png", size: 182000 },
    ],
  },
  { id: "1", name: "Ana Souza",   contact: "5561999887766", contactType: "whatsapp", style: "Fine line",  last: "2025-08-10" },
  { id: "2", name: "Rafael Lima", contact: "rafa@ex.com",   contactType: "email",    style: "Blackwork",  last: "2025-07-22" },
  { id: "3", name: "Júlia Reis",  contact: "5561981122334", contactType: "whatsapp", style: "Floral",     last: "2025-06-30" },
];

const TEMPLATES: Template[] = [
  { id: "t1", title: "Contrato padrão — pequenas" },
  { id: "t2", title: "Contrato blackwork — médios" },
];

export default function AdminClientsPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Client[]>(MOCK);
  const [current, setCurrent] = useState<Client | null>(null);
  const [openNew, setOpenNew] = useState(false);
  const [openSendFor, setOpenSendFor] = useState<Client | null>(null);
  const [toDelete, setToDelete] = useState<Client | null>(null); // 👈 seleção para excluir

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    return rows.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      (c.style ?? "").toLowerCase().includes(q.toLowerCase())
    );
  }, [q, rows]);

  const handleCreate = (c: NewClientData) => {
    const newClient: Client = {
      id: c.id,
      name: c.name,
      contact: c.contact,
      contactType: c.contactType,
      style: c.style || undefined,
      instagram: c.instagram,
      note: c.note,
      last: new Date().toISOString().slice(0,10),
      refs: c.refs ?? [],
    };
    setRows((prev) => [newClient, ...prev]);
  };

  const handleCreateAndSchedule = (c: NewClientData, date?: string) => {
    handleCreate(c);
    const day = date || new Date().toISOString().slice(0,10);
    router.push(`/admin/schedule?open=new&day=${encodeURIComponent(day)}&client=${encodeURIComponent(c.name)}`);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setRows((prev) => prev.filter((x) => x.id !== toDelete.id));
    // se estiver com modal "Ver" aberto deste cliente, fecha
    if (current?.id === toDelete.id) setCurrent(null);
    setToDelete(null);
  };

return (
  <div className="space-y-4">
    <h1 className="text-xl font-bold">Clientes</h1>

    {/* Filtro + Ações */}
    <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <input
          placeholder="Buscar por nome ou estilo..."
          value={q}
          onChange={(e)=> setQ(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
        />
        <button
          onClick={() => setOpenNew(true)}
          className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
        >
          Novo cliente
        </button>
      </div>

      {/* Tabela com scroll lateral no mobile */}
      <div className="relative rounded-xl border border-black/10 bg-white/70">
        {/* Hint mobile */}
        <div className="md:hidden px-3 py-2 text-xs opacity-60">
          Dica: arraste lateralmente para ver todas as colunas →
        </div>

        {/* Wrapper de rolagem horizontal */}
        <div
          className="overflow-x-auto overscroll-x-contain scroll-smooth border-t border-black/10"
          role="region"
          aria-label="Tabela de clientes com rolagem horizontal"
        >
          <table className="min-w-[780px] w-full text-sm">
            <thead
              className="
                sticky top-0 z-10 border-b border-black/10 text-left
                text-xs font-semibold uppercase tracking-wide opacity-70
                bg-white/80 backdrop-blur
              "
            >
              <tr>
                <th className="px-3 py-2">Nome</th>
                <th className="px-3 py-2">Contato</th>
                <th className="px-3 py-2">Estilo</th>
                <th className="px-3 py-2">Última visita</th>
                <th className="px-3 py-2 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-black/10 last:border-0">
                  <td className="px-3 py-2 font-medium whitespace-nowrap">{c.name}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full border border-black/15 bg-white/70 px-2 py-0.5 text-xs">
                      {c.contactType === "whatsapp" ? "WhatsApp" : "E-mail"}
                    </span>
                    <div className="opacity-80 whitespace-nowrap">{c.contact}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{c.style ?? "-"}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{c.last ?? "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setCurrent(c)}
                        className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => setOpenSendFor(c)}
                        className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                      >
                        Contrato
                      </button>

                      {/* Lixeira */}
                      <button
                        onClick={() => setToDelete(c)}
                        className="inline-flex items-center justify-center rounded-full border border-black/20 p-1.5 text-xs font-semibold hover:bg-white"
                        aria-label={`Excluir ${c.name}`}
                        title="Excluir"
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                        </svg>
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

        {/* Gradientes de borda (indicam conteúdo fora da tela) */}
        <div className="pointer-events-none absolute inset-y-[42px] left-0 w-6 bg-gradient-to-r from-white/70 to-transparent md:hidden" />
        <div className="pointer-events-none absolute inset-y-[42px] right-0 w-6 bg-gradient-to-l from-white/70 to-transparent md:hidden" />
      </div>
    </div>

    {/* Modal: detalhes do cliente */}
    <AdminModal
      open={!!current}
      onClose={() => setCurrent(null)}
      title={current?.name}
      footer={
        <>
          <button className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5">
            Editar
          </button>
          <button
            onClick={() => setCurrent(null)}
            className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
          >
            Fechar
          </button>
        </>
      }
    >
      {current && (
        <div className="space-y-3 text-sm">
          <div><span className="font-semibold">Contato: </span>{current.contact}</div>
          <div><span className="font-semibold">Via: </span>{current.contactType}</div>
          <div><span className="font-semibold">Estilo: </span>{current.style ?? "-"}</div>
          {current.instagram && <div><span className="font-semibold">Instagram: </span>{current.instagram}</div>}
          {current.note && <div><span className="font-semibold">Obs.: </span>{current.note}</div>}

          {current.refs && current.refs.length > 0 && (
            <div className="rounded-xl border border-black/10 bg-white/70 p-3">
              <div className="mb-2 text-xs font-semibold uppercase opacity-70">Referências</div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {current.refs.map((r) => (
                  <div key={r.url} className="overflow-hidden rounded-lg border border-black/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.url} alt={r.name} className="h-24 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-black/10 bg-white/70 p-3">
            <div className="mb-2 text-xs font-semibold uppercase opacity-70">Atalhos</div>
            <div className="flex flex-wrap gap-2">
              <WhatsAppButton label="Chamar no WhatsApp" source="Admin • Cliente" variant="outline" />
              <button
                onClick={() => setOpenSendFor(current)}
                className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
              >
                Enviar contrato
              </button>
              <button
                onClick={() => {
                  const day = new Date().toISOString().slice(0,10);
                  router.push(`/admin/schedule?open=new&day=${day}&client=${encodeURIComponent(current.name)}`);
                }}
                className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
              >
                Criar agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminModal>

    {/* Modal: novo cliente */}
    <NewClientModal
      open={openNew}
      onClose={() => setOpenNew(false)}
      onCreate={handleCreate}
      onCreateAndSchedule={handleCreateAndSchedule}
    />

    {/* Modal: enviar contrato */}
    <SendContractModal
      open={!!openSendFor}
      onClose={() => setOpenSendFor(null)}
      clientName={openSendFor?.name ?? ""}
      templates={TEMPLATES}
    />

    {/* Modal: confirmar exclusão */}
    <AdminModal
      open={!!toDelete}
      onClose={() => setToDelete(null)}
      title="Excluir cliente"
      footer={
        <>
          <button
            onClick={() => setToDelete(null)}
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
          >
            Cancelar
          </button>
          <button
            onClick={confirmDelete}
            className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Excluir
          </button>
        </>
      }
    >
      <p className="text-sm">
        Tem certeza que deseja excluir <strong>{toDelete?.name}</strong>? Esta ação não pode ser desfeita.
      </p>
    </AdminModal>
  </div>
);

}
