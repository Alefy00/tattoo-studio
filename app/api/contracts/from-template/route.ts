// app/api/contracts/from-template/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase";

function shortId() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function tokenHex() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const body = await req.json().catch(() => ({}));
  const { templateId, clientName, clientEmail, typeLabel, priceBRL, sessionDate } = body;

  if (!templateId || !clientName || !clientEmail) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  // 1) cliente (cria/associa por email)
  let clientId: string;
  const { data: existing } = await supabase.from("client").select("id").eq("email", clientEmail).maybeSingle();
  if (existing?.id) clientId = existing.id;
  else {
    const { data: created, error: cErr } = await supabase
      .from("client").insert({ name: clientName, email: clientEmail }).select("id").single();
    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });
    clientId = created.id;
  }

  // 2) cria contrato
  const sid = shortId();
  const publicToken = tokenHex();
  const amountCents = priceBRL ? Number(String(priceBRL).replace(/\D/g, "")) : null;

  const { data: contract, error: insErr } = await supabase
    .from("contract")
    .insert({
      short_id: sid,
      client_id: clientId,
      template_id: templateId,
      type_label: typeLabel ?? "Tatuagem",
      status: "SENT",
      amount_cents: amountCents,
      session_date: sessionDate ? new Date(sessionDate).toISOString() : null,
      public_token: publicToken,
      sent_at: new Date().toISOString(),
    })
    .select("id, short_id")
    .single();

  if (insErr) return NextResponse.json({ error: insErr.message }, { status: 400 });

  await supabase.from("contract_event").insert({
    contract_id: contract.id, type: "SENT", meta: { clientEmail, templateId },
  });

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const publicUrl = `${base}/c/${sid}?t=${publicToken}`;

  return NextResponse.json({ ok: true, contractId: contract.id, shortId: sid, publicUrl });
}
