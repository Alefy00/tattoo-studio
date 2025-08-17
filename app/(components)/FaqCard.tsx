"use client";

import { useMemo, useState } from "react";
import FaqModal from "./FaqModal";

type QA = { q: string; a: React.ReactNode };

const FAQ_ITEMS: QA[] = [
  {
    q: "Dói muito fazer tatuagem?",
    a: (
      <>
        <p>A sensação varia por pessoa e por área do corpo. Regiões com pele mais fina tendem a ser mais sensíveis.</p>
        <ul>
          <li>Usamos agulhas e máquinas adequadas para reduzir o desconforto.</li>
          <li>Recomendamos dormir bem e se alimentar antes da sessão.</li>
        </ul>
      </>
    ),
  },
  {
    q: "Como escolher o tamanho ideal?",
    a: (
      <>
        <p>O tamanho depende do nível de detalhe do desenho e da área do corpo.</p>
        <p>Como regra geral: quanto mais detalhe, maior o tamanho para longevidade e legibilidade.</p>
      </>
    ),
  },
  {
    q: "Quais estilos a artista trabalha?",
    a: (
      <>
        <p>Especialidade em <strong>fine line</strong>, <strong>blackwork</strong> e <strong>floral minimalista</strong>. Projetos autorais sob consulta.</p>
      </>
    ),
  },
  {
    q: "Como funciona o orçamento?",
    a: (
      <>
        <p>Passo a passo:</p>
        <ol>
          <li>Você envia referências, área do corpo e tamanho aproximado.</li>
          <li>Definimos orçamento estimado e agenda de data.</li>
          <li>No dia, ajustamos os últimos detalhes do desenho.</li>
        </ol>
      </>
    ),
  },
  {
    q: "Como cuidar no pós-tatuagem?",
    a: (
      <>
        <p>Higienize com sabonete neutro 2–3x/dia, seque sem fricção e aplique pomada indicada por 7–10 dias.</p>
        <p>Evite piscina, mar, sol direto e academia pesada na primeira semana.</p>
      </>
    ),
  },
  {
    q: "Posso treinar ou tomar sol após tatuar?",
    a: (
      <>
        <p>Evite <strong>sol direto</strong> e <strong>atividade intensa</strong> por pelo menos 7 dias.</p>
        <p>Depois, use protetor solar FPS 50+ para preservar o pigmento.</p>
      </>
    ),
  },
  {
    q: "Tatuagens desbotam? Precisa de retoque?",
    a: (
      <>
        <p>Toda tatuagem sofre desgaste natural. Com bons cuidados, a durabilidade aumenta.</p>
        <p>Retoques podem ser feitos conforme o caso, geralmente após a cicatrização completa (4–6 semanas).</p>
      </>
    ),
  },
  {
    q: "Posso levar minha própria referência?",
    a: (
      <>
        <p>Sim! Referências ajudam a alinhar expectativas. A artista adapta ao estilo e anatomia para um resultado único.</p>
      </>
    ),
  },
  {
    q: "Preciso pagar sinal para reservar?",
    a: (
      <>
        <p>Em projetos maiores, trabalhamos com sinal para garantir a data e a preparação do desenho.</p>
      </>
    ),
  },
  {
    q: "Sou alérgico/a. E agora?",
    a: (
      <>
        <p>Informe qualquer histórico alérgico. Usamos materiais de qualidade e descartáveis.</p>
        <p>Em casos específicos, converse com seu médico antes da sessão.</p>
      </>
    ),
  },
];

export default function FaqCard() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<QA | null>(null);

  const openModal = (qa: QA) => {
    setCurrent(qa);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setCurrent(null);
  };

  // limites de altura para a lista (não quebrar o mosaico)
  // em md+, o card costuma ter ~2 linhas (≈ 440–520px úteis)
  const listMax = useMemo(() => ({
    mobile: "max-h-72",
    desktop: "md:max-h-[420px]",
  }), []);

  return (
    <article className="rounded-2xl border border-black/10 bg-[var(--primary)] p-5 md:row-span-2">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold">FAQ</h3>
        {/* espaço para ícone se quiser */}
      </header>

      {/* lista rolável */}
      <ul
        className={`no-scrollbar divide-y divide-black/10 overflow-y-auto rounded-xl border border-black/10 bg-white/70 ${listMax.mobile} ${listMax.desktop}`}
        role="list"
        aria-label="Perguntas frequentes"
      >
        {FAQ_ITEMS.map((qa, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => openModal(qa)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-white"
              aria-haspopup="dialog"
              aria-controls="faq-modal"
            >
              <span className="font-medium">{qa.q}</span>
              <span aria-hidden className="text-base">›</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      <FaqModal
        open={open}
        onClose={closeModal}
        question={current?.q ?? ""}
        answer={current?.a ?? null}
      />
    </article>
  );
}
