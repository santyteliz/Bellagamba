const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

/** "USD 1.480.000" */
export function formatPrice(precio: number | null | undefined, moneda = "USD") {
  if (!precio) return "Consultar precio";
  return `${moneda} ${nf.format(precio)}`;
}

/** "USD 1,48 M" / "USD 450 mil" para markers de mapa */
export function formatPriceShort(precio: number | null | undefined, moneda = "USD") {
  if (!precio) return "Consultar";
  if (precio >= 1_000_000) return `${moneda} ${nf1.format(precio / 1_000_000).replace(/,0$/, "")} M`;
  return `${moneda} ${nf.format(Math.round(precio / 1000))} mil`;
}

/** "75,8 m²" */
export function formatM2(m2: number | null | undefined) {
  if (!m2) return null;
  return `${nf1.format(m2)} m²`;
}

export function formatNumber(n: number) {
  return nf.format(n);
}

export function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
