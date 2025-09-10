"use client";
import { useState } from "react";

export function UploadSignedDialog({ contractId, onDone }: { contractId: string; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setLoading(true); setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/contracts/${contractId}/upload-signed`, { method: "POST", body: fd });
    setLoading(false);
    if (!res.ok) { const j = await res.json().catch(()=>({})); setError(j?.error ?? "Falha no upload"); return; }
    setOpen(false); onDone?.();
  }

  return (
    <>
      <button className="btn" onClick={() => setOpen(true)}>Enviar PDF assinado</button>
      {open && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Enviar PDF assinado (gov.br)</h2>
            <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button className="btn-outline" onClick={()=>setOpen(false)}>Cancelar</button>
              <button className="btn" onClick={handleUpload} disabled={!file || loading}>
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
