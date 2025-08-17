// app/admin/schedule/page.tsx
"use client";

import { useMemo, useState } from "react";
import CalendarMonth from "../_components/CalendarMonth";
import AdminModal from "../_components/AdminModal";

type Slot = { time: string; client?: string; note?: string };

const DEFAULT_SLOTS = ["10:00","13:30","16:00","18:30"];

export default function AdminSchedulePage() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [newOpen, setNewOpen] = useState(false);
  const [draft, setDraft] = useState<Slot>({ time: "10:00", client: "", note: "" });

  const key = useMemo(() => selectedDay?.toISOString().slice(0,10) ?? "", [selectedDay]);
  const daySlots = slots[key] ?? DEFAULT_SLOTS.map((t) => ({ time: t }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Agenda</h1>
        <CalendarMonth value={selectedDay} onChange={setSelectedDay} />
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5">
          <div className="mb-2 text-sm opacity-70">
            {selectedDay
              ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" }).format(selectedDay)
              : "Selecione um dia"}
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Horários do dia</h2>
            <button
              onClick={() => { setDraft({ time: "10:00", client: "", note: "" }); setNewOpen(true); }}
              className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
            >
              Novo horário
            </button>
          </div>

          <ul className="mt-3 space-y-2">
            {daySlots.map((s, i) => (
              <li key={i} className="rounded-xl border border-black/10 bg-white/70 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{s.time}</span>
                  <div className="flex gap-2">
                    <button className="rounded-full border border-black/20 px-2 py-1 text-xs hover:bg-white">
                      Editar
                    </button>
                    <button className="rounded-full border border-black/20 px-2 py-1 text-xs hover:bg-white">
                      Remover
                    </button>
                  </div>
                </div>
                {s.client && <div className="opacity-80">{s.client}</div>}
                {s.note && <div className="text-xs opacity-60">{s.note}</div>}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Modal novo horário (visual) */}
      <AdminModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Novo horário"
        footer={
          <>
            <button
              onClick={() => setNewOpen(false)}
              className="rounded-full border border-black/20 px-4 py-2 text-sm font-semibold hover:bg-black/5"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (!key) return;
                const list = slots[key] ?? DEFAULT_SLOTS.map((t)=>({ time: t }));
                setSlots({ ...slots, [key]: [...list, { ...draft }] });
                setNewOpen(false);
              }}
              className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold hover:opacity-90"
            >
              Salvar
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Horário</label>
            <input
              type="time"
              value={draft.time}
              onChange={(e)=> setDraft({ ...draft, time: e.target.value })}
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Cliente (opcional)</label>
            <input
              type="text"
              value={draft.client}
              onChange={(e)=> setDraft({ ...draft, client: e.target.value })}
              placeholder="Nome do cliente"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Observação (opcional)</label>
            <input
              type="text"
              value={draft.note}
              onChange={(e)=> setDraft({ ...draft, note: e.target.value })}
              placeholder="Ex.: Fine line, 5cm, antebraço"
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
