// app/c/[short_id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function PublicContractPage() {
  const { short_id } = useParams<{ short_id: string }>();
  const sp = useSearchParams();
  const token = sp.get("t");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  async function refreshUrl() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/contracts/p/${short_id}/signed-url`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Não foi possível obter o contrato");
      setPdfUrl(data.url);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const inp = e.currentTarget.elements.namedItem("file") as HTMLInputElement;
    const file = inp?.files?.[0];
    if (!file) return setMsg("Selecione um PDF");
    if (file.type !== "application/pdf") return setMsg("Apenas PDF é permitido");
    if (file.size > 10 * 1024 * 1024) return setMsg("PDF acima de 10MB");

    setBusy(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`/api/contracts/p/${short_id}/upload-signed?t=${token}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no upload");
      setMsg("Contrato enviado com sucesso 🎉");
      await refreshUrl();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { refreshUrl(); }, []);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-black/10 bg-[var(--primary)]/80 p-5 shadow-xl">
        <h1 className="text-xl font-bold">Contrato de Tatuagem</h1>
        <p className="mt-1 text-sm opacity-80">
          Visualize o contrato. Assine pelo Gov.br e envie o PDF assinado aqui.
        </p>

        <form onSubmit={onUpload} className="mt-4 flex flex-col gap-3">
          <input
            type="file"
            name="file"
            accept="application/pdf"
            className="file:mr-4 file:rounded-full file:border-0 file:bg-[var(--secondary)] file:px-4 file:py-2 file:text-white file:cursor-pointer text-sm"
            disabled={busy}
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={busy || !token}
              className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Enviando..." : "Enviar PDF assinado"}
            </button>
            <button
              type="button"
              onClick={refreshUrl}
              disabled={busy}
              className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-white"
            >
              Visualizar contrato
            </button>
          </div>
        </form>

        {msg && <p className="mt-3 text-sm text-amber-700">{msg}</p>}

        {pdfUrl && (
          <div className="mt-4 h-[70vh] w-full overflow-hidden rounded-xl border border-black/10 bg-white">
            <iframe src={pdfUrl} className="h-full w-full" />
          </div>
        )}
      </div>
    </main>
  );
}
