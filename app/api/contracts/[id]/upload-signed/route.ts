// app/api/contracts/p/[short_id]/upload-signed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";

const MAX_BYTES = 10 * 1024 * 1024;

function isPdf(ab: ArrayBuffer) {
  const head = new TextDecoder().decode(new Uint8Array(ab.slice(0, 4)));
  return head === "%PDF";
}

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { short_id: string } }) {
  try {
    const token = req.nextUrl.searchParams.get("t");
    if (!token) return NextResponse.json({ error: "Token ausente" }, { status: 401 });

    const supabase = getSupabaseAdmin();

    const { data: c, error } = await supabase
      .from("contract")
      .select("id, short_id, public_token")
      .eq("short_id", params.short_id)
      .single();

    if (error || !c) return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
    if (c.public_token !== token) return NextResponse.json({ error: "Token inválido" }, { status: 403 });

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });
    if (file.type !== "application/pdf") return NextResponse.json({ error: "Apenas PDF" }, { status: 415 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "PDF > 10MB" }, { status: 413 });

    const ab = await file.arrayBuffer();
    if (!isPdf(ab)) return NextResponse.json({ error: "PDF inválido" }, { status: 400 });

    const key = `signed/${c.short_id}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("contracts")
      .upload(key, ab, { contentType: "application/pdf", upsert: true });

    if (upErr) return NextResponse.json({ error: `Falha upload: ${upErr.message}` }, { status: 400 });

    const { error: updErr } = await supabase
      .from("contract")
      .update({ status: "SIGNED", signed_at: new Date().toISOString(), pdf_url_signed: key })
      .eq("id", c.id);

    if (updErr) return NextResponse.json({ error: `Falha update: ${updErr.message}` }, { status: 400 });

    const { error: evErr } = await supabase
      .from("contract_event")
      .insert({ contract_id: c.id, type: "PDF_UPLOADED", meta: { key } });

    return NextResponse.json({ ok: true, key, event: !evErr ? "logged" : "skipped" });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
