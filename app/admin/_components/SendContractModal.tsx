"use client";

import { useState } from "react";
import AdminModal from "./AdminModal";
import { useRouter } from "next/navigation";

export type Template = { id: string; title: string };

export default function SendContractModal({
  open,
  onClose,
  clientName,
  templates,
}: {
  open: boolean;
  onClose: () => void;
  clientName: string;
  templates: Template[];
}) {
  const router = useRouter();
  const [tpl, setTpl] = useState<string>(templates[0]?.id ?? "");

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={`Enviar contrato — ${clientName}`}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!tpl) return;
              router.push(`/admin/contracts?compose=${encodeURIComponent(tpl)}&client=${encodeURIComponent(clientName)}`);
            }}
            className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
          >
            Editar antes de enviar
          </button>
          <button
            onClick={() => {
              // mock de envio direto
              onClose();
            }}
            className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
          >
            Enviar agora (mock)
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Modelo de contrato</label>
          <select
            value={tpl}
            onChange={(e)=> setTpl(e.target.value)}
            className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="rounded-xl border border-black/10 bg-white/70 p-3 text-xs opacity-80">
          Você poderá revisar e editar o conteúdo antes do envio se escolher <strong>Editar antes de enviar</strong>.
        </div>
      </div>
    </AdminModal>
  );
}
