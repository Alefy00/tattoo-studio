"use client";

import { useEffect, useState } from "react";
import AgendaCalendarModal from "./AgendaCalendarModal";

/** Slots ilustrativos */
const DEFAULT_SLOTS = ["10:00", "13:30", "16:00", "18:30"];

/** Exemplo visual: domingo indisponível */
const isDayAvailable = (d: Date) => d.getDay() !== 0;

const fmtDayLong = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }).format(d);

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const fmtISO = (d: Date) => d.toISOString().slice(0, 10);

export default function AgendaCard() {
  const [open, setOpen] = useState(false);
  const [threeDays, setThreeDays] = useState<
    { date: Date; label: string; slots: string[]; available: boolean }[]
  >([]);

  useEffect(() => {
    const today = startOfDay(new Date());
    const days = [0, 1, 2].map((offset) => {
      const d = addDays(today, offset);
      const available = isDayAvailable(d);
      return {
        date: d,
        label: fmtDayLong(d),
        slots: available ? DEFAULT_SLOTS : [],
        available,
      };
    });
    setThreeDays(days);
  }, []);

  return (
    <article className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Próximos horários</h3>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
          aria-haspopup="dialog"
        >
          Ver agenda completa
        </button>
      </header>

      {/* 3 próximos dias (informativo) */}
      {threeDays.length === 0 ? (
        <ul className="space-y-2">
          {[0, 1, 2].map((i) => (
            <li key={i} className="h-16 animate-pulse rounded-xl bg-white/60" />
          ))}
        </ul>
      ) : (
        <ul className="space-y-2">
          {threeDays.map((d) => (
            <li key={fmtISO(d.date)} className="rounded-xl border border-black/10 bg-white/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold">{d.label}</span>

                <div className="flex flex-wrap gap-2">
                  {d.available && d.slots.length > 0 ? (
                    d.slots.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-black/20 bg-white px-3 py-1 text-xs font-semibold"
                        title="Horário disponível (consulta)"
                      >
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs opacity-60">Sem horários</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal com calendário */}
      <AgendaCalendarModal open={open} onClose={() => setOpen(false)} />
    </article>
  );
}
