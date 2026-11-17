// Genera placeholders blur (LQIP) para todas las fotos de /public/propiedades.
// Uso: node scripts/gen-blur.mjs  (se corre automáticamente en prebuild)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.cwd(), "public/propiedades");
const out = {};
for (const id of fs.readdirSync(root)) {
  const dir = path.join(root, id);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
    const buf = await sharp(path.join(dir, f)).resize(16, 12, { fit: "cover" }).jpeg({ quality: 50 }).toBuffer();
    out[`/propiedades/${id}/${f}`] = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }
}
fs.writeFileSync(path.resolve(process.cwd(), "data/blur.json"), JSON.stringify(out));
console.log(`blur: ${Object.keys(out).length} imágenes`);
