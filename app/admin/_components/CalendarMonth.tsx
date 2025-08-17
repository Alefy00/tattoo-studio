"use client";

import { useEffect, useMemo, useState } from "react";

const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

function buildMonthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const last  = new Date(anchor.getFullYear(), anchor.getMonth()+1, 0);
  const start = new Date(first);
  const weekday = (start.getDay() + 6) % 7; // semana começando na segunda
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
  isAvailable = (d: Date) => d.getDay() !== 0, // exemplo: domingos indisponíveis
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

  // ancorar mês ao dia selecionado
  useEffect(() => {
    if (!value) return;
    if (value.getMonth() !== anchor.getMonth() || value.getFullYear() !== anchor.getFullYear()) {
      setAnchor(startOfDay(value));
    }
  }, [value]);

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
        <div className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">
          {monthLabel}
        </div>
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
        {matrix.map((week, wi) =>
          week.map((day, di) => {
            const inMonth   = day.getMonth() === anchor.getMonth();
            const past      = startOfDay(day) < today;
            const available = inMonth && !past && isAvailable(day);
            const selected  = !!value && isSameDay(day, value!);
            const isToday   = isSameDay(day, today);

            // base
            let cls = "relative min-h-16 p-2 text-center text-sm transition outline-offset-2 ";

            if (!inMonth) {
              cls += "bg-white/60 opacity-30";
            } else if (selected) {
              // ✅ selecionado: bg secundário, sem hover branco
              cls += "bg-[var(--secondary)] shadow-inner ring-2 ring-black/10";
            } else if (available) {
              cls += "bg-white/70 hover:bg-white";
            } else {
              cls += "bg-white/40 opacity-60";
            }

            if (!selected && isToday) {
              cls += " ring-1 ring-black/30";
            }

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                disabled={!available}
                onClick={() => available && onChange(day)}
                className={cls}
                aria-selected={selected}
                title={available ? "Selecionar" : "Indisponível"}
              >
                <span className={`font-medium ${selected ? "font-bold" : ""}`}>{day.getDate()}</span>
                {selected && (
                  <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/80" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
