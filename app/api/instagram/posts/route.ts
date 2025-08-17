// app/api/instagram/posts/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // ⚠️ MOCK: trocaremos depois por chamada oficial à Instagram Graph API
  // Dica: adicione mais imagens em /public/portfolio/ para variar
  return NextResponse.json([
    {
      id: "1",
      media_type: "IMAGE",
      media_url: "/portfolio/duda_about.png",
      thumbnail_url: null,
      permalink: "https://instagram.com/",
      caption: "Projeto floral em fine line 🌸",
    },
    {
      id: "2",
      media_type: "IMAGE",
      media_url: "/branding/duda_new.png",
      thumbnail_url: null,
      permalink: "https://instagram.com/",
      caption: "Dia de estúdio ✨",
    },
    {
      id: "3",
      media_type: "IMAGE",
      media_url: "/portfolio/duda_about1.png",
      thumbnail_url: null,
      permalink: "https://instagram.com/",
      caption: "Detalhe delicado no pulso.",
    },
  ]);
}
