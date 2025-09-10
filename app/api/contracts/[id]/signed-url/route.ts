// app/api/contracts/p/[short_id]/signed-url/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabaseAdmin";

export async function GET(_req: Request, { params }: { params: { short_id: string } }) {
  try {
    const supabase = getSupabaseAdmin();

    const { data: c, error } = await supabase
      .from("contract")
      .select("id, short_id, status, pdf_url_signed, pdf_url_draft")
      .eq("short_id", params.short_id)
      .single();

    if (error || !c) return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });

    const key = c.pdf_url_signed ?? c.pdf_url_draft;
    if (!key) return NextResponse.json({ error: "Sem PDF disponível" }, { status: 400 });

    const { data, error: urlErr } = await supabase.storage
      .from("contracts")
      .createSignedUrl(key, 120, { download: `Contrato-${c.short_id}.pdf` });

    if (urlErr || !data?.signedUrl) {
      return NextResponse.json({ error: "Falha ao gerar URL" }, { status: 400 });
    }

    return NextResponse.json({ url: data.signedUrl, status: c.status });
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
