"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSignedIn, signIn } from "@/app/admin/lib/auth";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  // se já estiver logado, manda direto pro admin
  useEffect(() => {
    if (isSignedIn()) router.replace("/admin");
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // mock: aceita qualquer credencial; salva "sessão" no localStorage
    setTimeout(() => {
      signIn("Duda");
      router.replace("/admin");
    }, 400);
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--background)] text-[var(--text)] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-[var(--primary)] p-6 shadow-lg">
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">
            Acesso restrito
          </div>
          <h1 className="mt-2 text-xl font-bold">Entrar no painel</h1>
          <p className="text-sm opacity-70">Somente a tatuadora tem acesso.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[var(--text)] shadow-sm outline-none focus:ring-2 focus:ring-black/10"
              placeholder="seu@email.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Senha</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[var(--text)] shadow-sm outline-none focus:ring-2 focus:ring-black/10"
              placeholder="••••••••"
              value={pass}
              onChange={(e)=> setPass(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs opacity-60">
          *Esta tela é visual. A autenticação real será adicionada depois.
        </p>
      </div>
    </main>
  );
}
