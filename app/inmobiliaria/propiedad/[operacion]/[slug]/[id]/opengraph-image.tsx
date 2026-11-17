import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { getAllProperties, getPropertyById } from "@/lib/properties";
import { formatM2, formatPrice } from "@/lib/format";
import sharp from "sharp";

async function toJpeg(res: ImageResponse) {
  const png = Buffer.from(await res.arrayBuffer());
  const jpg = await sharp(png).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=3600, s-maxage=86400" } });
}

/**
 * Open Graph dinámico de la ficha: foto de portada, precio, barrio y logo.
 * Es lo que se ve al mandar el link por WhatsApp desde Hunter (hoy: "Departamento - 3 amb - 75.00 M2").
 */
export const runtime = "nodejs";
export const alt = "Propiedad en Bellagamba Marketing Inmobiliario";
export const size = { width: 1200, height: 630 };
// JPEG liviano (< 300 KB): WhatsApp descarta previews pesadas
export const contentType = "image/jpeg";
export const revalidate = 3600;

export async function generateStaticParams() {
  const all = await getAllProperties();
  return all.map((p) => ({ operacion: p.operacion, slug: p.slug, id: String(p.id) }));
}

async function fileData(rel: string, mime: string) {
  try {
    if (/^https?:/.test(rel)) {
      const r = await fetch(rel);
      return `data:${mime};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
    }
    const buf = await fs.readFile(path.join(process.cwd(), "public", rel));
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getPropertyById(Number(id));
  const logo = await fileData("/marca/logo-bellagamba-blanco.png", "image/png");

  if (!p) {
    return toJpeg(new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#141414" }}>
          {logo && <img src={logo} width={460} height={60} alt="" />}
        </div>
      ),
      size
    ));
  }

  const photo = await (async () => {
    try {
      const buf = await sharp(path.join(process.cwd(), "public", p.foto_portada)).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
      return `data:image/jpeg;base64,${buf.toString("base64")}`;
    } catch {
      return fileData(p.foto_portada, "image/jpeg");
    }
  })();
  const facts = [p.tipo, p.ambientes && `${p.ambientes} amb.`, p.dormitorios && `${p.dormitorios} dorm.`, formatM2(p.m2)].filter(Boolean).join("  ·  ");

  return toJpeg(new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#141414", fontFamily: "sans-serif" }}>
        {photo && <img src={photo} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(180deg, rgba(20,20,20,0.55) 0%, rgba(20,20,20,0) 30%, rgba(20,20,20,0.85) 100%)" }} />
        {/* Franja naranja con título (estilo de sus piezas de Instagram) */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 56px 48px" }}>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 780 }}>
            <div style={{ display: "flex", alignSelf: "flex-start", background: "#EF7208", color: "#141414", fontSize: 24, fontWeight: 700, padding: "8px 18px", borderRadius: 999, letterSpacing: 3, textTransform: "uppercase" }}>
              {p.operacion} · {p.barrio}
            </div>
            <div style={{ display: "flex", color: "#fff", fontSize: 50, fontWeight: 400, lineHeight: 1.08, marginTop: 20, letterSpacing: -1 }}>{p.titulo}</div>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.85)", fontSize: 26, marginTop: 14 }}>{facts}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", background: "#fff", color: "#141414", fontSize: 44, fontWeight: 700, padding: "14px 26px", borderRadius: 20, letterSpacing: -1 }}>{formatPrice(p.precio, p.moneda)}</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 44, left: 56, display: "flex" }}>{logo && <img src={logo} width={280} height={37} alt="" />}</div>
        <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: "100%", background: "#EF7208", display: "flex" }} />
      </div>
    ),
    size
  ));
}
