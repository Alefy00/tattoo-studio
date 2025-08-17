"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/** Horários ilustrativos (ajuste à vontade) */
const DEFAULT_SLOTS = ["10:00", "13:30", "16:00", "18:30"];

/** Exemplo de regra visual: domingo indisponível */
const isDayAvailable = (d: Date) => d.getDay() !== 0; // 0 = dom

/** Helpers */
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
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const fmtDayLong = (d: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(d);

function buildMonthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const start = new Date(first);
  // Semana começando na segunda (PT-BR)
  const weekday = (start.getDay() + 6) % 7; // 0=seg ... 6=dom
  start.setDate(start.getDate() - weekday);

  const matrix: Date[][] = [];
  let cursor = new Date(start);
  while (cursor <= addDays(last, 6)) {
    const row: Date[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    matrix.push(row);
  }
  return { matrix, first, last };
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AgendaCalendarModal({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const [monthAnchor, setMonthAnchor] = useState(() => startOfDay(new Date()));
  const [selectedDay, setSelectedDay] = useState<Date | null>(() => startOfDay(new Date()));

  const { matrix } = useMemo(() => buildMonthMatrix(monthAnchor), [monthAnchor]);
  const today = useMemo(() => startOfDay(new Date()), []);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(monthAnchor),
    [monthAnchor]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex min-h-dvh items-end justify-center p-3 md:items-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="agenda-title"
      ref={dialogRef}
      onMouseDown={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      {/* overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* card */}
      <div className="relative z-[111] w-full max-w-2xl rounded-2xl border border-black/10 bg-[var(--background)] p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[var(--text)] hover:bg-white"
          aria-label="Fechar"
          title="Fechar"
          type="button"
        >
          ✕
        </button>

        <header className="mb-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold">
            Agenda
          </div>
          <h2 id="agenda-title" className="mt-2 text-xl font-bold">
            Disponibilidade por data
          </h2>
          <p className="text-sm opacity-70">
            Horários exibidos apenas para consulta. O estúdio confirma o agendamento.
          </p>
        </header>

        {/* Mês + navegação */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/70 hover:bg-white"
            onClick={() =>
              setMonthAnchor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
            aria-label="Mês anterior"
            title="Mês anterior"
          >
            ‹
          </button>

          <div className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">
            {monthLabel}
          </div>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/70 hover:bg-white"
            onClick={() =>
              setMonthAnchor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
            aria-label="Próximo mês"
            title="Próximo mês"
          >
            ›
          </button>
        </div>

        {/* Legenda */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-2 py-1">
            <i className="inline-block h-2 w-2 rounded-full bg-black/80" /> Hoje
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-[var(--secondary)] px-2 py-1">
            <i className="inline-block h-2 w-2 rounded-full bg-black/80" /> Selecionado
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/70 px-2 py-1">
            <i className="inline-block h-2 w-2 rounded-full bg-black/80 opacity-60" /> Disponível
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/40 px-2 py-1">
            <i className="inline-block h-2 w-2 rounded-full bg-black/30" /> Indisponível
          </span>
        </div>

        {/* Calendário */}
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
          {/* Cabeçalhos */}
          <div className="grid grid-cols-7 border-b border-black/10 text-center text-xs font-semibold">
            {["seg", "ter", "qua", "qui", "sex", "sáb", "dom"].map((w) => (
              <div key={w} className="p-2 uppercase tracking-wide opacity-70">
                {w}
              </div>
            ))}
          </div>

          {/* Semanas */}
          <div className="grid grid-cols-7 gap-px bg-black/10 p-px">
            {matrix.map((week, wi) =>
              week.map((day, di) => {
                const inMonth =
                  day.getMonth() === monthAnchor.getMonth() &&
                  day.getFullYear() === monthAnchor.getFullYear();
                const past = startOfDay(day) < startOfDay(today);
                const available = inMonth && !past && isDayAvailable(day);

                const isToday = isSameDay(day, today);
                const isSelected = selectedDay && isSameDay(day, selectedDay);

                const base =
                  "min-h-16 bg-white/70 p-2 text-center text-sm transition outline-offset-2";
                const state = !inMonth
                  ? "opacity-30"
                  : available
                  ? "hover:bg-white"
                  : "bg-white/40 opacity-60";

                const ring = isSelected
                  ? "bg-[var(--secondary)]"
                  : isToday
                  ? "ring-1 ring-black/30"
                  : "";

                return (
                  <button
                    key={`${wi}-${di}`}
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      if (!available) return;
                      setSelectedDay(startOfDay(day));
                    }}
                    className={`${base} ${state} ${ring}`}
                    aria-pressed={!!isSelected}
                    title={
                      available
                        ? "Selecionar dia"
                        : !inMonth
                        ? "Fora do mês"
                        : past
                        ? "Dia passado"
                        : "Indisponível"
                    }
                  >
                    <span className="font-medium">{day.getDate()}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Slots do dia selecionado */}
        <div className="mt-3">
          <h4 className="mb-2 text-sm font-semibold">
            {selectedDay ? `Horários — ${fmtDayLong(selectedDay)}` : "Selecione um dia disponível"}
          </h4>

          {selectedDay ? (
            isDayAvailable(selectedDay) ? (
              <div className="flex flex-wrap gap-2">
                {DEFAULT_SLOTS.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--text)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm opacity-70">Sem horários disponíveis.</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
