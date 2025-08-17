"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminModal from "../_components/AdminModal";

type Template = {
  id: string;
  title: string;
  body: string;
  price: string;
  deposit: string;
  updatedAt: string; // YYYY-MM-DD
};

const DEFAULT_BODY = `1) O cliente confirma estar ciente das condições de higiene e cuidados no pós-tatuagem.
2) Em caso de alteração de data, avisar com 48h de antecedência.
3) O sinal garante a reserva e é abatido do valor final.
4) Correções pequenas podem ser avaliadas após a cicatrização (4–6 semanas).`;

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminContractsPage() {
  const search = useSearchParams();

  // ===== state: templates (mock local) =====
  const [templates, setTemplates] = useState<Template[]>([
    { id: "t1", title: "Contrato padrão — pequenas", body: DEFAULT_BODY, price: "R$ 600,00", deposit: "R$ 100,00", updatedAt: "2025-07-20" },
    { id: "t2", title: "Contrato blackwork — médios", body: DEFAULT_BODY, price: "R$ 1.000,00", deposit: "R$ 200,00", updatedAt: "2025-06-05" },
  ]);

  // ===== composer (novo/editar) =====
  const [openComposer, setOpenComposer] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | null>(null);

  // fields do composer
  const [title, setTitle] = useState("Contrato padrão");
  const [body, setBody] = useState<string>(DEFAULT_BODY);
  const [price, setPrice] = useState("R$ 600,00");
  const [deposit, setDeposit] = useState("R$ 100,00");
  const [client, setClient] = useState(""); // opcional, útil quando vem da aba Clientes

  // ===== excluir (confirmação) =====
  const [toDelete, setToDelete] = useState<Template | null>(null);

  // abre composer a partir da query (?compose=ID&client=Nome)
  useEffect(() => {
    const compose = search.get("compose");
    const c = search.get("client");
    if (compose) {
      const tpl = templates.find((t) => t.id === compose);
      if (tpl) {
        setMode("edit");
        setEditingId(tpl.id);
        setTitle(tpl.title);
        setBody(tpl.body);
        setPrice(tpl.price);
        setDeposit(tpl.deposit);
        setClient(c ? decodeURIComponent(c) : "");
        setOpenComposer(true);
      } else {
        // se não achou o id, abre para novo com client preenchido (fallback)
        setMode("new");
        setEditingId(null);
        setTitle("Novo contrato");
        setBody(DEFAULT_BODY);
        setPrice("R$ 0,00");
        setDeposit("R$ 0,00");
        setClient(c ? decodeURIComponent(c) : "");
        setOpenComposer(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // apenas na primeira renderização

  // ações
  const openNew = () => {
    setMode("new");
    setEditingId(null);
    setTitle("Contrato padrão");
    setBody(DEFAULT_BODY);
    setPrice("R$ 600,00");
    setDeposit("R$ 100,00");
    setClient("");
    setOpenComposer(true);
  };

  const openEdit = (t: Template) => {
    setMode("edit");
    setEditingId(t.id);
    setTitle(t.title);
    setBody(t.body);
    setPrice(t.price);
    setDeposit(t.deposit);
    setOpenComposer(true);
  };

  const duplicate = (t: Template) => {
    const copy: Template = {
      ...t,
      id: `${Date.now()}`,
      title: `${t.title} (cópia)`,
      updatedAt: today(),
    };
    setTemplates((prev) => [copy, ...prev]);
  };

  const remove = (t: Template) => setToDelete(t);

  const confirmDelete = () => {
    if (!toDelete) return;
    setTemplates((prev) => prev.filter((x) => x.id !== toDelete.id));
    // se estava editando esse, fecha composer
    if (editingId === toDelete.id) setOpenComposer(false);
    setToDelete(null);
  };

  const onSave = () => {
    if (mode === "new") {
      const n: Template = {
        id: `${Date.now()}`,
        title: title.trim() || "Contrato",
        body,
        price,
        deposit,
        updatedAt: today(),
      };
      setTemplates((prev) => [n, ...prev]);
      setOpenComposer(false);
    } else {
      if (!editingId) return;
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, title: title.trim() || t.title, body, price, deposit, updatedAt: today() }
            : t
        )
      );
      setOpenComposer(false);
    }
  };

  const header = useMemo(() => {
    return mode === "edit" ? "Editar contrato" : "Novo contrato";
  }, [mode]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Contratos</h1>

      <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Modelos</h2>
          <button
            onClick={openNew}
            className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
          >
            Novo contrato
          </button>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {templates.map((t) => (
            <li key={t.id} className="rounded-xl border border-black/10 bg-white/70 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">{t.title}</div>
                  <div className="text-xs opacity-60">Atualizado em {t.updatedAt}</div>
                  <div className="mt-1 text-xs opacity-70">
                    <span className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5">Valor: {t.price}</span>
                    <span className="ml-2 rounded-full border border-black/10 bg-white/60 px-2 py-0.5">Sinal: {t.deposit}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openEdit(t)}
                    className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => duplicate(t)}
                    className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white"
                  >
                    Duplicar
                  </button>
                  <button
                    onClick={() => remove(t)}
                    className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-white text-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
          {templates.length === 0 && (
            <li className="rounded-xl border border-black/10 bg-white/70 p-6 text-center text-sm opacity-70">
              Nenhum modelo cadastrado.
            </li>
          )}
        </ul>
      </div>

      {/* Composer: criar/editar */}
      <AdminModal
        open={openComposer}
        onClose={() => setOpenComposer(false)}
        title={header}
        footer={
          <>
            <button
              onClick={() => setOpenComposer(false)}
              className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Fechar
            </button>
            <button
              onClick={onSave}
              className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              {mode === "edit" ? "Atualizar" : "Salvar modelo"}
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
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Valor</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Sinal</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Cliente (opcional)</label>
              <input
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                placeholder="Nome do cliente"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div className="rounded-xl border border-black/10 bg-white/70 p-3 text-xs opacity-80">
              Se você veio da aba **Clientes**, o nome já aparece aqui para facilitar.
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-black/10 bg-white/70 p-4">
            <div className="mb-2 text-xs font-semibold uppercase opacity-70">Pré-visualização</div>
            <div className="prose prose-sm max-w-none">
              <h2 className="mb-1">{title || "Contrato"}</h2>
              <p>
                <strong>Valor:</strong> {price || "—"} &nbsp; • &nbsp; <strong>Sinal:</strong> {deposit || "—"}
              </p>
              <hr className="my-3" />
              <pre className="whitespace-pre-wrap text-[var(--text)]/90">{body}</pre>
              <hr className="my-3" />
              <p className="text-xs opacity-70">Cliente: {client || "—"}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Conteúdo / Cláusulas</label>
            <textarea
              className="h-48 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
      </AdminModal>

      {/* Confirmar exclusão */}
      <AdminModal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Excluir contrato"
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
          Tem certeza que deseja excluir o modelo <strong>{toDelete?.title}</strong>? Esta ação não pode ser desfeita.
        </p>
      </AdminModal>
    </div>
  );
}
