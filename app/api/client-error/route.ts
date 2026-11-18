import { NextResponse } from "next/server";

/** Recibe errores del navegador y los deja en los logs del servidor (Vercel › Logs). */
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const text = (await req.text()).slice(0, 5000);
    const data = JSON.parse(text) as Record<string, unknown>;
    console.error("[client-error]", JSON.stringify(data));
  } catch {
    /* payload inválido: se ignora */
  }
  return new NextResponse(null, { status: 204 });
}
