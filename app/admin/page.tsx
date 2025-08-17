// app/admin/page.tsx
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5">
          <div className="text-sm opacity-70">Agendamentos hoje</div>
          <div className="mt-1 text-3xl font-bold">3</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5">
          <div className="text-sm opacity-70">Contratos pendentes</div>
          <div className="mt-1 text-3xl font-bold">2</div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5">
          <div className="text-sm opacity-70">Novos clientes (30d)</div>
          <div className="mt-1 text-3xl font-bold">14</div>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5">
        <h2 className="text-base font-semibold">Próximos horários</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {[
            { time: "10:00", client: "Ana Souza", note: "Fine line" },
            { time: "13:30", client: "Rafael Lima", note: "Blackwork" },
            { time: "16:00", client: "Júlia Reis", note: "Floral" },
          ].map((it, i) => (
            <li key={i} className="rounded-xl border border-black/10 bg-white/70 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{it.time}</span>
                <span className="opacity-70">{it.note}</span>
              </div>
              <div className="opacity-80">{it.client}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
