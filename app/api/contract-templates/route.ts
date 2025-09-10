// app/api/contract-templates/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/app/lib/supabase";

export const dynamic = "force-dynamic"; 

export async function GET(req: NextRequest) {
  const supabase = await getSupabaseServer();
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  let query = supabase
    .from("contract_template")
    .select("id, name, content_md, content_html, updated_at")
    .order("updated_at", { ascending: false });

  if (name) {
    query = query.eq("name", name).limit(1);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data }, { status: 200 });
}
