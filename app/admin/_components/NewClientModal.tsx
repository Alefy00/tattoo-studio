"use client";

import { useEffect, useMemo, useState } from "react";
import AdminModal from "./AdminModal";

const TATTOO_STYLES = ["Fine line","Blackwork","Realismo","Minimalista","Floral","Geométrico"] as const;

export type ImageRef = { name: string; url: string; size: number };

export type NewClientData = {
  id: string;
  name: string;
  contact: string; // whatsapp ou e-mail
  contactType: "whatsapp" | "email";
  style?: (typeof TATTOO_STYLES)[number] | "";
  instagram?: string;
  note?: string;
  refs?: ImageRef[];            // 👈 referências (imagens)
};

export default function NewClientModal({
  open,
  onClose,
  onCreate,
  onCreateAndSchedule,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (c: NewClientData) => void;
  onCreateAndSchedule: (c: NewClientData, date?: string) => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [contactType, setContactType] = useState<"whatsapp" | "email">("whatsapp");
  const [style, setStyle] = useState<NewClientData["style"]>("");
  const [instagram, setInstagram] = useState("");
  const [note, setNote] = useState("");

  const [preferredDate, setPreferredDate] = useState<string>(""); // YYYY-MM-DD
  const [files, setFiles] = useState<ImageRef[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Deduz tipo de contato automaticamente
  useEffect(() => {
    if (!contact) return;
    if (contact.includes("@")) setContactType("email");
    else setContactType("whatsapp");
  }, [contact]);

  // Limpa ao fechar
  useEffect(() => {
    if (!open) {
      // revoga URLs depois de fechar
      files.forEach((f) => URL.revokeObjectURL(f.url));
      setTimeout(() => {
        setName(""); setContact(""); setContactType("whatsapp"); setStyle("");
        setInstagram(""); setNote(""); setPreferredDate(""); setFiles([]); setErrors({});
      }, 200);
    }
  }, [open]); // eslint-disable-line

  const canSubmit = useMemo(() => name.trim() && contact.trim(), [name, contact]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Informe o nome.";
    if (!contact.trim()) e.contact = "Informe um contato.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const baseClient = (): NewClientData => ({
    id: `${Date.now()}`,
    name: name.trim(),
    contact: contact.trim(),
    contactType,
    style: style ?? "",
    instagram: instagram.trim() || undefined,
    note: note.trim() || undefined,
    refs: files,
  });

  const handleSave = () => {
    if (!validate()) return;
    onCreate(baseClient());
    onClose();
  };

  const handleSaveAndSchedule = () => {
    if (!validate()) return;
    onCreateAndSchedule(baseClient(), preferredDate || undefined);
    onClose();
  };

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const fl = e.target.files;
    if (!fl?.length) return;
    const picked: ImageRef[] = Array.from(fl).map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = "";
  }

  function removeFile(url: string) {
    setFiles((prev) => prev.filter((f) => f.url !== url));
    URL.revokeObjectURL(url);
  }

  const today = new Date().toISOString().slice(0,10);

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title="Novo cliente"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!canSubmit}
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5 disabled:opacity-60"
          >
            Salvar
          </button>
          <button
            onClick={handleSaveAndSchedule}
            disabled={!canSubmit}
            className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Salvar e criar agendamento
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nome *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Contato *</label>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="WhatsApp (com DDD) ou e-mail"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          />
          {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Via de contato</label>
          <div className="flex gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="contactType" checked={contactType==="whatsapp"} onChange={()=>setContactType("whatsapp")} />
              WhatsApp
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="contactType" checked={contactType==="email"} onChange={()=>setContactType("email")} />
              E-mail
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Estilo</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as typeof style)}
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          >
            <option value="">Selecionar…</option>
            {TATTOO_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Instagram (opcional)</label>
          <input
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@usuario"
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Data desejada (opcional)</label>
          <input
            type="date"
            min={today}
            value={preferredDate}
            onChange={(e)=> setPreferredDate(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Observações</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Preferências, alergias, referências…"
            className="min-h-24 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          />
        </div>

        {/* Upload de referências */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Referências (imagens)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onPickFiles}
            className="block w-full text-sm file:mr-3 file:rounded-full file:border file:border-black/20 file:bg-white file:px-3 file:py-1.5 file:text-sm hover:file:bg-white/80"
          />
          {files.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {files.map((f) => (
                <div key={f.url} className="relative overflow-hidden rounded-lg border border-black/10 bg-white/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.name} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(f.url)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                    title="Remover"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2 rounded-xl border border-black/10 bg-white/70 p-3">
          <div className="mb-1 text-xs font-semibold uppercase opacity-70">Dica</div>
          <p className="text-xs opacity-80">
            “Salvar e criar agendamento” abre a Agenda com o dia selecionado. Sem backend ainda (dados são temporários).
          </p>
        </div>
      </div>
    </AdminModal>
  );
}
