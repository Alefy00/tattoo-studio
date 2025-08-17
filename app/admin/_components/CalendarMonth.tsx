"use client";

import { useMemo, useState } from "react";

const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const isSameDay = (a: Date, b: Date) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

function buildMonthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last = new Date(anchor.getFullYear(), anchor.getMonth()+1, 0);
  const start = new Date(first);
  const weekday = (start.getDay() + 6) % 7; // segunda
  start.setDate(start.getDate() - weekday);
  const matrix: Date[][] = [];
  let cursor = new Date(start);
  while (cursor <= addDays(last, 6)) {
    const row: Date[] = [];
    for (let i=0;i<7;i++){ row.push(new Date(cursor)); cursor.setDate(cursor.getDate()+1); }
    matrix.push(row);
  }
  return { matrix };
}

export default function CalendarMonth({
  value,
  onChange,
  isAvailable = (d: Date) => d.getDay() !== 0, // domingos indisponíveis
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  isAvailable?: (d: Date) => boolean;
}) {
  const [anchor, setAnchor] = useState(() => startOfDay(value ?? new Date()));
  const today = useMemo(() => startOfDay(new Date()), []);
  const { matrix } = useMemo(() => buildMonthMatrix(anchor), [anchor]);
  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(anchor),
    [anchor]
  );

  return (
    <div className="rounded-xl border border-black/10 bg-white/70 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/70 hover:bg-white"
          onClick={() => setAnchor((d) => new Date(d.getFullYear(), d.getMonth()-1, 1))}
          title="Mês anterior"
        >
          ‹
        </button>
        <div className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">{monthLabel}</div>
        <button
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/70 hover:bg-white"
          onClick={() => setAnchor((d) => new Date(d.getFullYear(), d.getMonth()+1, 1))}
          title="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-black/10 text-center text-xs font-semibold">
        {["seg","ter","qua","qui","sex","sáb","dom"].map((w)=>(
          <div key={w} className="p-2 uppercase tracking-wide opacity-70">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-black/10 p-px">
        {matrix.map((week, wi) => week.map((day, di) => {
          const inMonth = day.getMonth() === anchor.getMonth();
          const past = startOfDay(day) < startOfDay(today);
          const available = inMonth && !past && isAvailable(day);
          const isSelected = value && isSameDay(day, value);
          const isToday = isSameDay(day, today);

          const base = "min-h-16 bg-white/70 p-2 text-center text-sm transition";
          const state = !inMonth ? "opacity-30" : available ? "hover:bg-white" : "bg-white/40 opacity-60";
          const ring = isSelected ? "bg-[var(--secondary)]" : isToday ? "ring-1 ring-black/30" : "";

          return (
            <button
              key={`${wi}-${di}`}
              disabled={!available}
              onClick={() => available && onChange(day)}
              className={`${base} ${state} ${ring}`}
              title={available ? "Selecionar" : "Indisponível"}
            >
              <span className="font-medium">{day.getDate()}</span>
            </button>
          );
        }))}
      </div>
    </div>
  );
}
