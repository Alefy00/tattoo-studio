"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type InstaPost = {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string | null;
  permalink: string;
  caption?: string | null;
};

export default function InstagramHighlightCard() {
  const [posts, setPosts] = useState<InstaPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/instagram/posts", { cache: "no-store" });
        const data = (await res.json()) as InstaPost[];
        setPosts(data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const count = posts?.length ?? 0;

  const scrollToIndex = (i: number) => {
    if (!scrollerRef.current) return;
    const el = scrollerRef.current.children[i] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      setIdx(i);
    }
  };

  const next = () => scrollToIndex(Math.min(idx + 1, Math.max(count - 1, 0)));
  const prev = () => scrollToIndex(Math.max(idx - 1, 0));

  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) => Number((e.target as HTMLElement).dataset.index));
        if (visible.length) setIdx(visible[0]);
      },
      { root: sc, threshold: 0.6 }
    );
    Array.from(sc.children).forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [posts]);

  return (
    <article
      className="
        relative col-span-1 row-span-1 overflow-hidden rounded-2xl
        border border-black/10 bg-[var(--secondary)]
        md:col-span-2 md:row-span-2
        /* 💡 garante altura no mobile */
        min-h-[420px] sm:min-h-[480px] md:min-h-0
      "
    >
      <header className="absolute left-3 top-3 z-10 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold">
        Instagram • @mariaduda_tattoo
      </header>

      {/* Carrossel */}
      <div
        ref={scrollerRef}
        className="
          no-scrollbar relative flex h-full snap-x snap-mandatory overflow-x-auto scroll-smooth
          [&>*]:snap-center [&>*]:shrink-0 [&>*]:basis-full
        "
      >
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative h-full w-full">
                {/* skeleton com altura própria pra mobile */}
                <div className="absolute inset-0 mx-auto my-auto aspect-square w-[88%] max-w-[680px] animate-pulse rounded-xl bg-white/50" />
              </div>
            ))
          : posts && posts.length > 0
          ? posts.map((p, i) => <Slide key={p.id} post={p} index={i} />)
          : (
            <div className="flex h-full w-full items-center justify-center p-6 text-center">
              <p className="max-w-xs text-sm opacity-80">
                Nenhuma postagem encontrada. Em breve os trabalhos mais recentes aparecem aqui. ✨
              </p>
            </div>
          )}
      </div>

      {/* Controles */}
      {count > 1 && (
        <>
          <button
            aria-label="Anterior"
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/15 bg-white/70 p-2 backdrop-blur hover:bg-white"
          >
            ‹
          </button>
          <button
            aria-label="Próximo"
            onClick={next}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-black/15 bg-white/70 p-2 backdrop-blur hover:bg-white"
          >
            ›
          </button>

          <div className="pointer-events-none absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-black/80" : "bg-black/30"}`}
              />
            ))}
          </div>
        </>
      )}
    </article>
  );
}

function Slide({ post, index }: { post: InstaPost; index: number }) {
  const isVideo = post.media_type === "VIDEO";
  const displayUrl = isVideo ? post.thumbnail_url ?? post.media_url : post.media_url;

  return (
    <div data-index={index} className="relative h-full w-full" role="group" aria-roledescription="slide">
      {/* 👉 tornado este wrapper RELATIVE e movendo overlay/legenda para cá */}
      <div className="absolute inset-0 mx-auto my-auto aspect-square w-[88%] max-w-[680px] relative">
        {/* mídia */}
        {isVideo ? (
          <video
            className="h-full w-full rounded-xl object-cover"
            poster={displayUrl}
            src={post.media_url}
            muted
            playsInline
            loop
            autoPlay
          />
        ) : (
          <Image
            src={displayUrl}
            alt={post.caption ?? "Post Instagram"}
            fill
            className="rounded-xl object-cover"
            sizes="(max-width: 768px) 88vw, 680px"
            unoptimized
          />
        )}

        {/* ✅ gradiente agora acompanha a MÍDIA */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-gradient-to-t from-black/50 to-transparent" />

        {/* legenda/cta ancorados ao wrapper da mídia */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <p className="line-clamp-2 max-w-[70%] text-sm text-white/90">{post.caption ?? ""}</p>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-[var(--text)] hover:bg-white"
          >
            Abrir no Instagram
          </a>
        </div>
      </div>
    </div>
  );
}