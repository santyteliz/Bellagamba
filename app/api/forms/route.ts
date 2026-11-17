import { NextResponse } from "next/server";
import { FORM_TITLES, FORM_TYPES, type FormType } from "@/lib/forms/schemas";

/**
 * Endpoint único de formularios.
 * - Valida con Zod (mismo schema que el cliente) + honeypot + rate limit en memoria.
 * - Envía a FORMS_TO_EMAIL (info@bellagamba.com) vía Resend; sin RESEND_API_KEY entra en modo mock.
 * - Si CRM_WEBHOOK_URL está seteado, reenvía el JSON al CRM (Hunter / Tokko / Zapier).
 */
export const runtime = "nodejs";

const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 8;
}

const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const LABELS: Record<string, string> = {
  nombre: "Nombre",
  email: "Email",
  telefono: "Teléfono",
  asunto: "Asunto",
  mensaje: "Mensaje",
  propiedadId: "ID Tokko",
  propiedadTitulo: "Propiedad",
  asesor: "Asesor",
  dia: "Día",
  franja: "Franja horaria",
  operacion: "Operación",
  tipos: "Tipos",
  zonas: "Zonas",
  ambientes: "Ambientes",
  moneda: "Moneda",
  presupuesto: "Presupuesto",
  alerta: "Quiere alerta",
  tipo: "Tipo",
  ubicacion: "Ubicación",
  supCubierta: "Sup. cubierta (m²)",
  supTotal: "Sup. total (m²)",
  antiguedad: "Antigüedad",
  garage: "Garage",
  amenities: "Amenities",
  comentarios: "Comentarios",
  fotos: "Fotos adjuntas",
  pagina: "Página",
};

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "Demasiados envíos. Probá en un minuto." }, { status: 429 });

  let body: { type?: FormType; data?: Record<string, unknown>; pagina?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida" }, { status: 400 });
  }
  const type = body.type;
  if (!type || !(type in FORM_TYPES)) return NextResponse.json({ ok: false, error: "Formulario desconocido" }, { status: 400 });

  // Honeypot: respondemos OK para no darle pistas al bot, pero no enviamos nada.
  if (body.data && typeof body.data.website === "string" && body.data.website.length > 0) return NextResponse.json({ ok: true });

  const parsed = FORM_TYPES[type].safeParse(body.data);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Revisá los campos marcados", issues: parsed.error.flatten() }, { status: 422 });

  const data: Record<string, unknown> = { ...(parsed.data as Record<string, unknown>), pagina: body.pagina };
  delete data.website;
  const subject = `${FORM_TITLES[type]}${"propiedadTitulo" in data ? ` · ${data.propiedadTitulo}` : ""}`;
  const rows = Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && !v.length))
    .map(([k, v]) => {
      const val = Array.isArray(v) ? (k === "fotos" ? `${v.length} archivo(s)` : v.join(", ")) : typeof v === "boolean" ? (v ? "Sí" : "No") : v;
      return `<tr><td style="padding:8px 16px 8px 0;color:#6b6b6b;font:13px sans-serif;vertical-align:top">${esc(LABELS[k] || k)}</td><td style="padding:8px 0;font:15px sans-serif;color:#141414">${esc(val)}</td></tr>`;
    })
    .join("");
  const html = `<div style="max-width:560px;margin:auto;padding:32px;background:#fff"><p style="font:600 12px sans-serif;letter-spacing:.18em;color:#b85000;text-transform:uppercase">bellagamba.com</p><h1 style="font:300 26px sans-serif;color:#141414;margin:8px 0 24px">${esc(subject)}</h1><table>${rows}</table></div>`;

  const tasks: Promise<unknown>[] = [];
  const key = process.env.RESEND_API_KEY;
  const to = process.env.FORMS_TO_EMAIL || "info@bellagamba.com";
  if (key) {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    tasks.push(
      resend.emails.send({
        from: process.env.FORMS_FROM_EMAIL || "Web Bellagamba <onboarding@resend.dev>",
        to,
        replyTo: typeof data.email === "string" ? data.email : undefined,
        subject,
        html,
      }).then((r) => {
        if (r.error) throw r.error;
      })
    );
  } else {
    console.info(`[forms:mock] ${type} → ${to}`, JSON.stringify(data));
  }
  if (process.env.CRM_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.CRM_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, subject, data, receivedAt: new Date().toISOString() }),
      })
    );
  }
  const results = await Promise.allSettled(tasks);
  const failed = results.find((r) => r.status === "rejected");
  if (failed) {
    console.error("[forms] error", failed);
    return NextResponse.json({ ok: false, error: "No pudimos enviar tu consulta. Probá de nuevo o escribinos por WhatsApp." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, mock: !key });
}
