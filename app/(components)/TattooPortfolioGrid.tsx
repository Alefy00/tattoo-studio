"use client";

import Image from "next/image";
import Link from "next/link";
import QuoteFormButton from "./QuoteFormButton";
import TattooStylesCard from "./TattooStylesCard";
import AgendaCard from "./AgendaCard";
import InstagramHighlightCard from "./InstagramHighlightCard";
import FaqCard from "./FaqCard";
import WhatsAppButton from "./WhatsAppButton";

export default function TattooPortfolioGrid() {
  return (
    <main className="min-h-dvh">
      <section
        className="
          grid min-h-[calc(100dvh-64px)] grid-cols-1 gap-3 p-3
          md:grid-cols-3 md:auto-rows-[220px]
          lg:auto-rows-[260px]
          bg-[var(--background)]
          text-[var(--text)]
        "
      >
        {/* HERO — 2 col x 2 rows em md+ */}
        <article
          className="
            col-span-1 row-span-1 rounded-2xl border border-black/10
            bg-[var(--primary)] p-6
            md:col-span-2 md:row-span-2
          "
        >
          <div className="flex h-full flex-col justify-between">
            <header className="space-y-2">
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                Traços finos, realismo delicado e
                <span className="italic"> tatuagens autorais</span>
              </h1>
              <p className="max-w-prose text-sm opacity-70 md:text-base">
                Estúdio especializado em projetos sob medida. Agende uma consultoria e transforme sua ideia em arte.
              </p>
            </header>
            <div className="mt-6 flex items-center gap-3">
              <QuoteFormButton
                label="Solicitar orçamento"
                source="Hero"
                variant="secondary"
              />
            </div>
          </div>
        </article>

        {/* FOTO TATUADORA — 1 col x 3 rows em md+ */}
        <article
        className="
            relative overflow-hidden rounded-2xl border border-black/10
            bg-[var(--secondary)]
            aspect-[4/5] sm:aspect-[3/4]  /* 💡 dá altura no mobile/tablet */
            md:aspect-auto md:row-span-3   /* 💻 desktop volta a usar row-span do grid */
        "
        >
        <Image
            src="/branding/duda_new.png"
            alt="Tatuadora em estúdio"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div>
            <h3 className="text-lg font-semibold">Duda — Tattoo Artist</h3>
            <p className="text-sm opacity-80">Black & Grey • Fine Line</p>
            </div>
        </div>
        </article>


        {/* ESTILOS */}
        <TattooStylesCard />

        {/* AGENDA */}
        <AgendaCard />

        {/* HIGHLIGHT — 2 col x 2 rows em md+ */}
        <InstagramHighlightCard />

        {/* FAQ — 2 rows */}
        <FaqCard />


        {/* CTA FINAL — full width */}
        <article
        className="
            col-span-1 rounded-2xl border border-black/10
            bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] p-6
            md:col-span-3
        "
        >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="text-[var(--text)]">
            <h3 className="text-xl font-bold md:text-2xl">Vamos criar sua próxima tatuagem?</h3>
            <p className="text-sm opacity-90">Envie referências, tamanho e região do corpo para um orçamento rápido.</p>
            </div>
            <div className="flex gap-3">
            <QuoteFormButton label="Iniciar orçamento" source="CTA" variant="outline" />
            <WhatsAppButton
                label="Falar no WhatsApp"
                source="CTA"
                variant="outline"
                className="px-5 py-2"
            />
            </div>
        </div>
        </article>

      </section>
    </main>
  );
}
