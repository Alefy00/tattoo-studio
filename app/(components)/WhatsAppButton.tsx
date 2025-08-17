"use client";

type Props = {
  label?: string;
  className?: string;
  source?: string; // opcional: de onde o clique veio (CTA, Navbar, etc.)
  variant?: "primary" | "secondary" | "outline" | "ghost";
};

function buildWhatsAppHref(message?: string) {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const phone = raw.replace(/\D/g, ""); // 5561999999999
  const baseMsg =
    message ??
    process.env.NEXT_PUBLIC_WHATSAPP_GREETING ??
    "Olá! Vim pelo site e gostaria de fazer um orçamento.";
  const text = encodeURIComponent(baseMsg);

  if (!phone) return `https://wa.me/?text=${text}`;
  return `https://wa.me/${phone}?text=${text}`;
}

export default function WhatsAppButton({
  label = "Falar no WhatsApp",
  className = "",
  source,
  variant = "outline",
}: Props) {
  const msgPrefix = source ? `${source} — ` : "";
  const href = buildWhatsAppHref(`${msgPrefix}Olá! Vim pelo site e gostaria de fazer um orçamento.`);

  const base = "rounded-full px-5 py-2 text-sm font-semibold transition focus:outline-none";
  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary: "bg-[var(--primary)] text-[var(--text)] hover:opacity-90",
    secondary: "bg-[var(--secondary)] text-[var(--text)] hover:opacity-90",
    outline: "border border-black/20 text-[var(--text)] hover:bg-black/5",
    ghost: "text-[var(--text)] hover:bg-black/5",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Iniciar conversa no WhatsApp"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {label}
    </a>
  );
}
