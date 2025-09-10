"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminModal from "../_components/AdminModal";
import { Template } from "@/app/types/templates";



const DEFAULT_BODY = `1) O cliente confirma estar ciente das condições de higiene e cuidados no pós-tatuagem.
2) Em caso de alteração de data, avisar com 48h de antecedência.
3) O sinal garante a reserva e é abatido do valor final.
4) Correções pequenas podem ser avaliadas após a cicatrização (4–6 semanas).`;

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminContractsPage() {
  const search = useSearchParams();

  // ===== state: templates (mock local) =====
const [templates, setTemplates] = useState<Template[]>([]);

  // ===== composer (novo/editar) =====
  const [openComposer, setOpenComposer] = useState(false);
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [editingId, setEditingId] = useState<string | null>(null);
  

  // fields do composer
  const [title, setTitle] = useState("Contrato padrão");
  const [body, setBody] = useState<string>(DEFAULT_BODY);
  const [price, setPrice] = useState("");
  const [deposit, setDeposit] = useState("");
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
    setPrice("");
    setDeposit("");
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
// ====== GERAR CONTRATO (modal) ======
const [openGenerate, setOpenGenerate] = useState(false);
const [loadingPreview, setLoadingPreview] = useState(false);
const [renderedPreview, setRenderedPreview] = useState<string>("");

// lista de templates do Supabase
type TemplateDb = { id: string; name: string; content_md: string | null };
const [templatesDb, setTemplatesDb] = useState<TemplateDb[]>([]);
const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

// campos (variáveis do template)
const [gArtistName, setGArtistName] = useState("");
const [gArtistCpf, setGArtistCpf] = useState("");
const [gArtistAddress, setGArtistAddress] = useState("");
const [gArtistCity, setGArtistCity] = useState("");
const [gArtistPhone, setGArtistPhone] = useState("");
const [gArtistEmail, setGArtistEmail] = useState("");

const [gClientName, setGClientName] = useState("");
const [gClientEmail, setGClientEmail] = useState("");
const [gClientPhone, setGClientPhone] = useState("");
const [gClientAddress, setGClientAddress] = useState("");
const [gClientCity, setGClientCity] = useState("");

const [gTattooLocation, setGTattooLocation] = useState("");
const [gTattooStyle, setGTattooStyle] = useState("");
const [gTattooDescription, setGTattooDescription] = useState("");
const [gTattooSize, setGTattooSize] = useState("");
const [gTattooColors, setGTattooColors] = useState("");
const [gSessionDate, setGSessionDate] = useState("");

// pagamento
const [gAmountBRL, setGAmountBRL] = useState("");
const [gDepositBRL, setGDepositBRL] = useState("");
const [gInstallments, setGInstallments] = useState("");
const [gPaymentTerms, setGPaymentTerms] = useState("");

// util
function todayBR() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// busca TODOS os templates quando abrir o modal
useEffect(() => {
  (async () => {
    if (!openGenerate) return;
    try {
      const res = await fetch("/api/contract-templates");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Falha ao buscar templates");
      const list: TemplateDb[] = (json.data ?? []).map((t: any) => ({
        id: t.id,
        name: t.name,
        content_md: t.content_md ?? null,
      }));
      setTemplatesDb(list);
      // seleciona o primeiro automaticamente
      if (list.length > 0) setSelectedTemplateId(list[0].id);
      else setSelectedTemplateId(null);
    } catch (e) {
      console.error(e);
      setTemplatesDb([]);
      setSelectedTemplateId(null);
      setRenderedPreview("Nenhum template encontrado.");
    }
  })();
}, [openGenerate]);

// renderiza preview substituindo {{variavel}}
function renderTemplate(source: string | null | undefined) {
  const tpl = source ?? DEFAULT_BODY;
  const vars: Record<string, string> = {
    artist_name: gArtistName,
    artist_cpf: gArtistCpf,
    artist_address: gArtistAddress,
    artist_city: gArtistCity,
    artist_phone: gArtistPhone,
    artist_email: gArtistEmail,

    client_name: gClientName,
    client_email: gClientEmail,
    client_phone: gClientPhone,
    client_address: gClientAddress,
    client_city: gClientCity,

    tattoo_location: gTattooLocation,
    tattoo_style: gTattooStyle,
    tattoo_description: gTattooDescription,
    tattoo_size: gTattooSize,
    tattoo_colors: gTattooColors,
    session_date: gSessionDate,

    amount_brl: gAmountBRL,
    deposit_brl: gDepositBRL,
    installments: gInstallments,
    payment_terms: gPaymentTerms,

    city: gClientCity || gArtistCity || "",
    today: todayBR(),
    short_id: "—",
  };

  setLoadingPreview(true);
  let out = tpl;
  for (const [key, value] of Object.entries(vars)) {
    const re = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    out = out.replace(re, value || "—");
  }
  setRenderedPreview(out);
  setLoadingPreview(false);
}

// quando muda o template selecionado OU algum campo, re-render
useEffect(() => {
  if (!openGenerate) return;
  const tpl = templatesDb.find((x) => x.id === selectedTemplateId)?.content_md ?? DEFAULT_BODY;
  renderTemplate(tpl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  openGenerate, selectedTemplateId,
  gArtistName, gArtistCpf, gArtistAddress, gArtistCity, gArtistPhone, gArtistEmail,
  gClientName, gClientEmail, gClientPhone, gClientAddress, gClientCity,
  gTattooLocation, gTattooStyle, gTattooDescription, gTattooSize, gTattooColors, gSessionDate,
  gAmountBRL, gDepositBRL, gInstallments, gPaymentTerms
]);

// submit: cria contrato com o template selecionado
async function onGenerateSubmit() {
  try {
    if (!selectedTemplateId) throw new Error("Selecione um modelo de contrato.");
    if (!gClientName || !gClientEmail) {
      alert("Preencha ao menos Nome e E‑mail do cliente.");
      return;
    }

    const res = await fetch("/api/contracts/from-template", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: selectedTemplateId,
        clientName: gClientName,
        clientEmail: gClientEmail,
        typeLabel: "Tatuagem",
        priceBRL: gAmountBRL,
        sessionDate: gSessionDate || null,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Falha ao criar contrato");

    await navigator.clipboard.writeText(data.publicUrl);
    setOpenGenerate(false);
    alert("Contrato criado! Link público copiado para a área de transferência.");
  } catch (e: any) {
    alert(e.message);
  }
}

      return (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Contratos</h1>

          <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Modelos</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenGenerate(true)}
                  className="rounded-full bg-[var(--secondary)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  Gerar contrato
                </button>
                <button
                  onClick={openNew}
                  className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
                >
                  Novo contrato (modelo)
                </button>
              </div>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2">
              {templates.map((t) => (
                <li key={t.id} className="rounded-xl border border-black/10 bg-white/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">{t.title}</div>
                      <div className="text-xs opacity-60">Atualizado em {t.updatedAt}</div>
                      <div className="mt-1 text-xs opacity-70">
                        <span className="rounded-full border border-black/10 bg-white/60 px-2 py-0.5">
                          Valor: {t.price}
                        </span>
                        <span className="ml-2 rounded-full border border-black/10 bg-white/60 px-2 py-0.5">
                          Sinal: {t.deposit}
                        </span>
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

          {/* Modal de GERAR CONTRATO (lista todos templates e pré-visualiza em tempo real) */}
          <AdminModal
            open={openGenerate}
            onClose={() => setOpenGenerate(false)}
            title="Gerar contrato"
            size="xl"
            stickyFooter
            footer={
              <>
                <button
                  onClick={() => setOpenGenerate(false)}
                  className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
                >
                  Cancelar
                </button>
                <button
                  onClick={onGenerateSubmit}
                  className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  disabled={loadingPreview || !selectedTemplateId}
                >
                  Criar e copiar link
                </button>
              </>
            }
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* Coluna esquerda: select + formulário */}
              <div className="space-y-3">
                {/* Select de modelos */}
                <div>
                  <label className="mb-1 block text-sm font-medium">Modelo</label>
                  <select
                    className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                    value={selectedTemplateId ?? ""}
                    onChange={(e) => setSelectedTemplateId(e.target.value || null)}
                  >
                    {templatesDb.length === 0 && <option value="">Nenhum modelo encontrado</option>}
                    {templatesDb.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase opacity-70">Prestador</div>
                  <div className="grid grid-cols-1 gap-2">
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Nome da artista"
                      value={gArtistName} onChange={(e) => setGArtistName(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="CPF/CNPJ"
                      value={gArtistCpf} onChange={(e) => setGArtistCpf(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Endereço"
                      value={gArtistAddress} onChange={(e) => setGArtistAddress(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Cidade/Estado"
                      value={gArtistCity} onChange={(e) => setGArtistCity(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Telefone"
                      value={gArtistPhone} onChange={(e) => setGArtistPhone(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Email"
                      value={gArtistEmail} onChange={(e) => setGArtistEmail(e.target.value)} />
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase opacity-70">Cliente</div>
                  <div className="grid grid-cols-1 gap-2">
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Nome do cliente"
                      value={gClientName} onChange={(e) => setGClientName(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="E-mail"
                      value={gClientEmail} onChange={(e) => setGClientEmail(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Telefone"
                      value={gClientPhone} onChange={(e) => setGClientPhone(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Endereço"
                      value={gClientAddress} onChange={(e) => setGClientAddress(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Cidade/Estado"
                      value={gClientCity} onChange={(e) => setGClientCity(e.target.value)} />
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase opacity-70">Tatuagem</div>
                  <div className="grid grid-cols-1 gap-2">
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Local do corpo"
                      value={gTattooLocation} onChange={(e) => setGTattooLocation(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Estilo"
                      value={gTattooStyle} onChange={(e) => setGTattooStyle(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Descrição / referência"
                      value={gTattooDescription} onChange={(e) => setGTattooDescription(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Tamanho"
                      value={gTattooSize} onChange={(e) => setGTattooSize(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Cores"
                      value={gTattooColors} onChange={(e) => setGTattooColors(e.target.value)} />
                    <input type="date" className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
                      value={gSessionDate} onChange={(e) => setGSessionDate(e.target.value)} />
                  </div>
                </div>

                <div className="rounded-xl border border-black/10 bg-white/70 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase opacity-70">Pagamento</div>
                  <div className="grid grid-cols-1 gap-2">
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Valor (R$)"
                      value={gAmountBRL} onChange={(e) => setGAmountBRL(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Sinal (R$)"
                      value={gDepositBRL} onChange={(e) => setGDepositBRL(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Parcelas (ex.: 3x de R$ 200)"
                      value={gInstallments} onChange={(e) => setGInstallments(e.target.value)} />
                    <input className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm" placeholder="Forma de pagamento"
                      value={gPaymentTerms} onChange={(e) => setGPaymentTerms(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Coluna direita: pré-visualização */}
              <div className="rounded-xl border border-black/10 bg-white/70 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase opacity-70">Pré‑visualização</div>
                  {loadingPreview && <span className="text-xs opacity-60">Renderizando…</span>}
                </div>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                  {renderedPreview || "Selecione um modelo e preencha os campos para visualizar o contrato…"}
                </div>
              </div>
            </div>
          </AdminModal>


          {/* Composer de MODELOS (como já existia) */}
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
                  Se você veio da aba <strong>Clientes</strong>, o nome já aparece aqui para facilitar.
                </div>
              </div>

              {/* Preview do MODELO (como já estava) */}
              <div className="rounded-xl border border-black/10 bg-white/70 p-4">
                <div className="mb-2 text-xs font-semibold uppercase opacity-70">Pré-visualização (modelo)</div>
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

          {/* Confirmar exclusão (modelos) */}
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
