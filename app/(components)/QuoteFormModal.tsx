"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  source?: string;        // de onde veio o clique (Hero, Navbar, CTA…)
  initialStyle?: string;  // pré-selecionar um estilo se desejar
};

const TATTOO_STYLES = [
  "Fine line",
  "Blackwork",
  "Realismo",
  "Minimalista",
  "Floral",
  "Geométrico",
];

type FormState = {
  name: string;
  contact: string; // whatsapp/email
  style: string;
  description: string;
  files: File[];
};

export default function QuoteFormModal({ open, onClose, source, initialStyle }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    contact: "",
    style: initialStyle ?? "",
    description: "",
    files: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Previews dos arquivos
  const previews = useMemo(
    () => form.files.map((f) => URL.createObjectURL(f)),
    [form.files]
  );

  useEffect(() => {
    // foco ao abrir
    if (open) {
      const t = setTimeout(() => firstInputRef.current?.focus(), 60);
      // trava o scroll da página
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    // limpar previews para não vazar memória
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (!open) return null;

  const setField =
    (k: keyof FormState) =>
    (v: string | File[] | FileList | null) => {
      setForm((prev) => {
        if (k === "files") {
          const filesArray = Array.from((v as FileList) ?? []);
          // opcional: limitar quantidade
          const next = [...prev.files, ...filesArray].slice(0, 8);
          return { ...prev, files: next };
        }
        return { ...prev, [k]: v as string };
      });
    };

  const removeFile = (idx: number) => {
    setForm((prev) => {
      const next = [...prev.files];
      next.splice(idx, 1);
      return { ...prev, files: next };
    });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Informe seu nome.";
    if (!form.contact.trim()) e.contact = "Informe um contato (WhatsApp ou e-mail).";
    if (!form.style.trim()) e.style = "Selecione um estilo.";
    if (!form.description.trim()) e.description = "Descreva sua ideia.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    // Aqui você integra com seu backend / e-mail / WhatsApp API.
    // Por enquanto vamos só simular o envio.
    const payload = {
      ...form,
      source: source ?? "unknown",
      files: form.files.map((f) => ({ name: f.name, type: f.type, size: f.size })),
    };
    console.log("ORCAMENTO_PAYLOAD", payload);

    setSent(true);
    // Se quiser limpar após envio:
    // setForm({ name: "", contact: "", style: "", description: "", files: [] });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex min-h-dvh items-end justify-center p-3 md:items-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="orcamento-title"
      ref={dialogRef}
      onMouseDown={(e) => {
        // fecha ao clicar fora
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {/* overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* card */}
      <div className="relative z-[101] w-full max-w-xl rounded-2xl border border-black/10 bg-[var(--background)] p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[var(--text)] hover:bg-white"
          aria-label="Fechar"
          title="Fechar"
          type="button"
        >
          ✕
        </button>

        {!sent ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <header className="mb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold">
                Orçamento
                {source ? <span className="opacity-60">• {source}</span> : null}
              </div>
              <h2 id="orcamento-title" className="mt-2 text-xl font-bold">
                Conte sua ideia ✍️
              </h2>
              <p className="text-sm opacity-70">
                Preencha os campos abaixo para receber um orçamento rápido.
              </p>
            </header>

            {/* Nome */}
            <div>
              <label className="mb-1 block text-sm font-medium">Nome</label>
              <input
                ref={firstInputRef}
                type="text"
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[var(--text)] shadow-sm outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Seu nome completo"
                value={form.name}
                onChange={(e) => setField("name")(e.target.value)}
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            {/* Contato */}
            <div>
              <label className="mb-1 block text-sm font-medium">Contato</label>
              <input
                type="text"
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[var(--text)] shadow-sm outline-none focus:ring-2 focus:ring-black/10"
                placeholder="WhatsApp (com DDD) ou e-mail"
                value={form.contact}
                onChange={(e) => setField("contact")(e.target.value)}
              />
              {errors.contact && <p className="mt-1 text-xs text-red-600">{errors.contact}</p>}
            </div>

            {/* Estilo */}
            <div>
              <label className="mb-1 block text-sm font-medium">Estilo da tatuagem</label>
              <select
                className="w-full appearance-none rounded-xl border border-black/15 bg-white px-3 py-2 text-[var(--text)] shadow-sm outline-none focus:ring-2 focus:ring-black/10"
                value={form.style}
                onChange={(e) => setField("style")(e.target.value)}
              >
                <option value="">Selecione um estilo…</option>
                {TATTOO_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.style && <p className="mt-1 text-xs text-red-600">{errors.style}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="mb-1 block text-sm font-medium">Descrição</label>
              <textarea
                className="min-h-24 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[var(--text)] shadow-sm outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Fale sobre o desenho, tamanho aproximado, região do corpo…"
                value={form.description}
                onChange={(e) => setField("description")(e.target.value)}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Upload de imagens (múltiplas) */}
            <div>
              <label className="mb-1 block text-sm font-medium">Referências (imagens)</label>

              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 bg-white/60 p-6 text-center hover:bg-white">
                <span className="text-sm opacity-70">
                  Arraste e solte ou clique para selecionar (até 8 imagens)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setField("files")(e.target.files)}
                />
              </label>

              {/* Previews */}
              {previews.length > 0 && (
                <ul className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-4">
                  {previews.map((src, i) => (
                    <li key={i} className="relative">
                      <img
                        src={src}
                        alt={`preview-${i}`}
                        className="h-24 w-full rounded-lg object-cover shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white"
                        title="Remover"
                        aria-label="Remover imagem"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ações */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--secondary)] px-5 py-2 text-sm font-semibold text-[var(--text)] hover:opacity-90"
              >
                Enviar orçamento
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xl font-bold">Recebido! 🎉</h2>
            <p className="text-sm opacity-80">
              Obrigado por enviar sua ideia. Entraremos em contato em breve pelo canal informado.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", contact: "", style: "", description: "", files: [] });
                }}
                className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
              >
                Enviar outro
              </button>
              <button
                onClick={onClose}
                className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
