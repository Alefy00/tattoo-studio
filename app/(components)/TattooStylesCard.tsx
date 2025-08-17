"use client";

import { useMemo, useState } from "react";
import QuoteFormButton from "./QuoteFormButton";

type TattooStyle = {
  key: string;
  label: string;
  description: string;
  bullets?: string[];
};

const STYLES: TattooStyle[] = [
  {
    key: "fine-line",
    label: "Fine line",
    description:
      "Traços ultrafinos, delicados e minimalistas. Ideal para desenhos discretos, palavras e símbolos com alto nível de sutileza.",
    bullets: ["Traço delicado", "Pouca sombra", "Ótimo para áreas visíveis"],
  },
  {
    key: "blackwork",
    label: "Blackwork",
    description:
      "Uso predominante de preto, com preenchimentos sólidos e contrastes marcantes. Funciona muito bem com formas geométricas e padrões.",
    bullets: ["Cheio de contraste", "Impacto visual", "Alta durabilidade"],
  },
  {
    key: "realismo",
    label: "Realismo",
    description:
      "Representações fiéis de rostos, animais ou objetos. Exige referências de qualidade e costuma demandar sessões mais longas.",
    bullets: ["Detalhamento alto", "Sombras suaves", "Sessões extensas"],
  },
  {
    key: "minimalista",
    label: "Minimalista",
    description:
      "Formas simples e limpas, foco no essencial. Excelente para primeiras tatuagens e composições discretas.",
    bullets: ["Design limpo", "Fácil de combinar", "Cura rápida"],
  },
  {
    key: "floral",
    label: "Floral",
    description:
      "Flores e folhagens com linhas delicadas ou sombreado leve. Muito versátil para braços, ombros e clavícula.",
    bullets: ["Composição orgânica", "Feminino e elegante", "Escala flexível"],
  },
  {
    key: "geometrico",
    label: "Geométrico",
    description:
      "Formas, padrões e simetrias. Pode ser minimalista ou complexo, combina bem com blackwork e fine line.",
    bullets: ["Simetria", "Repetição de padrões", "Combinações modernas"],
  },
];

export default function TattooStylesCard() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const active = useMemo(
    () => STYLES.find((s) => s.key === activeKey) ?? null,
    [activeKey]
  );

  const rowSpanClass = active ? "md:row-span-2" : "md:row-span-1";

  return (
    <article
      className={`rounded-2xl border border-black/10 bg-[var(--primary)] p-5 ${rowSpanClass}`}
    >
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">Estilos</h3>
        {/* espaço para um ícone se quiser
        <Image src="/icons/styles.svg" alt="Estilos" width={16} height={16} />
        */}
      </header>

      {/* Pills */}
      <div className="flex flex-wrap gap-2">
        {STYLES.map((style) => {
          const isActive = style.key === activeKey;
          return (
            <button
              key={style.key}
              type="button"
              onClick={() => setActiveKey(isActive ? null : style.key)}
              aria-expanded={isActive}
              aria-controls={`style-panel-${style.key}`}
              className={[
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                isActive
                  ? "border-black/20 bg-[var(--secondary)]"
                  : "border-black/20 bg-white/70 hover:bg-white",
              ].join(" ")}
              title={style.label}
            >
              {style.label}
            </button>
          );
        })}
      </div>

      {/* Painel de descrição */}
      {active && (
        <div
          id={`style-panel-${active.key}`}
          className="mt-4 rounded-xl border border-black/10 bg-white/70 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold">{active.label}</h4>
              <p className="mt-1 text-sm opacity-80">{active.description}</p>

              {active.bullets?.length ? (
                <ul className="mt-3 list-disc pl-5 text-sm opacity-80">
                  {active.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              onClick={() => setActiveKey(null)}
              className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white/70 text-sm hover:bg-white"
              aria-label="Fechar detalhes"
              title="Fechar"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <QuoteFormButton
              label="Quero esse estilo"
              source="Estilos"
              initialStyle={active.label}
              variant="secondary"
            />
            {/* Mantemos sem 'Ver trabalhos' conforme você pediu */}
          </div>
        </div>
      )}
    </article>
  );
}
