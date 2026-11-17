"use client";
import Link from "next/link";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Operacion, PropertyCard as Card } from "@/lib/properties/types";
import { activeFilterCount, applyFilters, facetCounts, filtersToQuery, OPERACION_EN, parseFilters, SORTS, type Filters, type SortKey } from "@/lib/properties/filters";
import { FEATURE_LABELS } from "@/lib/properties/normalize";
import { formatPriceShort } from "@/lib/format";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property/PropertyCard";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { FiltersPanel, type FacetData } from "./FiltersPanel";
import { searchesStore, toast } from "@/lib/store";
import { track } from "@/lib/analytics";
import { waLink } from "@/lib/site";

const MapView = dynamic(() => import("@/components/map/MapView"), { ssr: false, loading: () => <div className="skeleton absolute inset-0" /> });

type View = "grid" | "list" | "map" | "split";

export function Listing({ items, locked = null }: { items: Card[]; locked?: Operacion | null }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const f = useMemo(() => parseFilters(sp, { operacion: locked }), [sp, locked]);
  const [view, setView] = useState<View>("grid");
  const [drawer, setDrawer] = useState(false);
  const [hover, setHover] = useState<number | string | null>(null);
  const [pendingBbox, setPendingBbox] = useState<[number, number, number, number] | null>(null);
  const [mounted, setMounted] = useState(false);
  // El contador anima solo cuando cambian los filtros (no en la carga: protege el LCP)
  const [changed, setChanged] = useState(false);
  const firstQuery = useRef(sp.toString());
  useEffect(() => {
    if (sp.toString() !== firstQuery.current) setChanged(true);
  }, [sp]);

  useEffect(() => {
    setMounted(true);
    try {
      const v = localStorage.getItem("bg:vista") as View | null;
      if (v && ["grid", "list", "map", "split"].includes(v)) setView(v === "split" && window.innerWidth < 1024 ? "grid" : v);
      else if (window.innerWidth >= 1280) setView("split");
    } catch {
      /* noop */
    }
  }, []);
  const changeView = (v: View) => {
    setView(v);
    try {
      localStorage.setItem("bg:vista", v);
    } catch {}
  };

  const set = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...f, ...patch };
      const q = filtersToQuery(next, locked);
      startTransition(() => router.replace(`${pathname}${q ? `?${q}` : ""}`, { scroll: false }));
      track("search", { filtros: q || "ninguno" });
    },
    [f, locked, pathname, router]
  );
  const clear = () => startTransition(() => router.replace(pathname, { scroll: false }));

  const results = useMemo(() => applyFilters(items, f), [items, f]);
  const facets: FacetData = useMemo(() => {
    const c = facetCounts(items, f);
    const base = locked ? items.filter((p) => p.operacion === locked) : items;
    const uniq = (arr: string[]) => [...new Set(arr)].sort((a, b) => a.localeCompare(b, "es"));
    const prices = items.map((p) => p.precio ?? 0).filter(Boolean);
    const max = Math.ceil(Math.max(1500000, ...prices) / 100000) * 100000;
    return {
      ...c,
      allTipos: uniq((base.length ? base : items).map((p) => p.tipo)),
      allBarrios: uniq((base.length ? base : items).map((p) => p.zona)),
      allFeatures: [...new Set(items.flatMap((p) => p.features.map((x) => x.key)))].sort((a, b) => (c.features.get(b) ?? 0) - (c.features.get(a) ?? 0)),
      priceBounds: [0, max],
    };
  }, [items, f, locked]);
  const nActive = activeFilterCount(f, locked);

  // Chips de filtros activos
  const chips: { label: string; remove: () => void }[] = [];
  if (f.operacion && f.operacion !== locked) chips.push({ label: f.operacion, remove: () => set({ operacion: null }) });
  f.tipos.forEach((t) => chips.push({ label: t, remove: () => set({ tipos: f.tipos.filter((x) => x !== t) }) }));
  f.barrios.forEach((t) => chips.push({ label: t, remove: () => set({ barrios: f.barrios.filter((x) => x !== t) }) }));
  if (f.dormitorios) chips.push({ label: `${f.dormitorios}+ dorm.`, remove: () => set({ dormitorios: null }) });
  if (f.ambientes) chips.push({ label: `${f.ambientes}+ amb.`, remove: () => set({ ambientes: null }) });
  if (f.banos) chips.push({ label: `${f.banos}+ baños`, remove: () => set({ banos: null }) });
  if (f.precioMin || f.precioMax) chips.push({ label: `USD ${f.precioMin ? formatPriceShort(f.precioMin, "").trim() : "0"} – ${f.precioMax ? formatPriceShort(f.precioMax, "").trim() : "∞"}`, remove: () => set({ precioMin: null, precioMax: null }) });
  if (f.m2Min || f.m2Max) chips.push({ label: `${f.m2Min ?? 0}–${f.m2Max ?? "∞"} m²`, remove: () => set({ m2Min: null, m2Max: null }) });
  f.features.forEach((k) => chips.push({ label: FEATURE_LABELS[k] ?? k, remove: () => set({ features: f.features.filter((x) => x !== k) }) }));
  if (f.bbox) chips.push({ label: "Zona del mapa", remove: () => set({ bbox: null }) });

  // Resumen "24 propiedades en venta en Vicente López"
  const opText = f.operacion ? OPERACION_EN[f.operacion] : "";
  const PLURAL: Record<string, string> = { Casa: "casas", Departamento: "departamentos", PH: "PH", Terreno: "terrenos", Local: "locales", Oficina: "oficinas", Cochera: "cocheras" };
  const tipoText = f.tipos.length === 1 ? (results.length === 1 ? f.tipos[0].toLowerCase().replace(/^ph$/, "PH") : PLURAL[f.tipos[0]] ?? f.tipos[0].toLowerCase()) : results.length === 1 ? "propiedad" : "propiedades";
  const whereText = f.barrios.length ? ` en ${f.barrios.length > 2 ? `${f.barrios.slice(0, 2).join(", ")} y más` : f.barrios.join(" y ")}` : "";

  const saveSearch = () => {
    const q = filtersToQuery(f, null);
    searchesStore.set((prev) => [{ id: String(Date.now()), label: `${results.length} ${tipoText} ${opText}${whereText}`.trim(), query: q, path: pathname, alerta: true, createdAt: new Date().toISOString() }, ...prev].slice(0, 10));
    toast("Búsqueda guardada. Te avisamos cuando entre algo así.", { label: "Ver", href: "/inmobiliaria/favoritos#busquedas" });
  };

  const markers = useMemo(
    () => results.filter((p) => p.lat_aprox && p.lng_aprox).map((p) => ({ id: p.id, lat: p.lat_aprox!, lng: p.lng_aprox!, label: formatPriceShort(p.precio, p.moneda), href: p.href, title: p.titulo })),
    [results]
  );

  const emptyOperacion = locked && items.filter((p) => p.operacion === locked).length === 0;
  const showMap = view === "map" || view === "split";

  return (
    <div className="pb-24 pt-28 lg:pt-36">
      <div className="container-x">
        {/* Encabezado */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <nav aria-label="Migas de pan" className="mb-4 text-[13px] text-gris-text">
              <Link href="/inmobiliaria" className="hover:text-ink">
                Inicio
              </Link>{" "}
              / <span className="text-ink">{locked ? `Propiedades ${OPERACION_EN[locked]}` : "Propiedades"}</span>
            </nav>
            <h1 className="text-h2 font-light" aria-live="polite">
              <span className="font-normal text-naranja-ink">{changed ? <Counter key={results.length} to={results.length} duration={700} /> : results.length}</span> {tipoText} {opText}
              {whereText}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Ordenar por</span>
              <select
                value={f.orden}
                onChange={(e) => set({ orden: e.target.value as SortKey })}
                className="h-11 appearance-none rounded-full border border-ink/15 bg-white pl-4 pr-10 text-sm font-semibold outline-none focus:border-ink"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
            </label>
            <div role="radiogroup" aria-label="Vista" className="inline-flex rounded-full border border-ink/15 bg-white p-1">
              {(
                [
                  ["grid", "grid", "Grilla"],
                  ["list", "list", "Lista"],
                  ["map", "map", "Mapa"],
                  ["split", "split", "Lista + mapa"],
                ] as [View, string, string][]
              ).map(([v, icon, label]) => (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={view === v}
                  aria-label={label}
                  title={label}
                  onClick={() => changeView(v)}
                  className={clsx("relative grid size-9 place-items-center rounded-full transition-colors", v === "split" && "hidden lg:grid", view === v ? "text-white" : "text-ink/70 hover:text-ink")}
                >
                  {view === v && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <Icon name={icon} size={17} className="relative" />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white lg:hidden"
              aria-haspopup="dialog"
            >
              <Icon name="filter" size={17} /> Filtros
              {nActive > 0 && <span className="grid size-5 place-items-center rounded-full bg-naranja text-[11px] text-ink">{nActive}</span>}
            </button>
          </div>
        </div>

        {/* Chips */}
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 pt-6">
                <AnimatePresence>
                  {chips.map((c) => (
                    <motion.button
                      layout
                      key={c.label}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      type="button"
                      onClick={c.remove}
                      aria-label={`Quitar filtro ${c.label}`}
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-white pl-4 pr-2 text-[13px] font-semibold capitalize ring-1 ring-ink/10 hover:ring-ink"
                    >
                      {c.label}
                      <span className="grid size-5 place-items-center rounded-full bg-ink/5">
                        <Icon name="close" size={12} strokeWidth={2} />
                      </span>
                    </motion.button>
                  ))}
                </AnimatePresence>
                <button type="button" onClick={clear} className="ml-1 text-[13px] font-semibold text-naranja-text underline-offset-4 hover:underline">
                  Limpiar filtros
                </button>
                <button type="button" onClick={saveSearch} className="ml-auto inline-flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-semibold hover:bg-ink/5">
                  <Icon name="bell" size={15} /> Guardar búsqueda
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={clsx("mt-10", view === "split" ? "lg:grid lg:grid-cols-[300px_minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8 lg:pl-10" : "container-x lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12")}>
        {/* Filtros desktop */}
        <aside aria-label="Filtros" className={clsx("hidden lg:block", view === "split" && "")}>
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto pb-10 pr-2" data-lenis-prevent>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-lg font-semibold">
                Filtros {nActive > 0 && <span className="ml-1 rounded-full bg-naranja px-2 py-0.5 text-xs text-ink">{nActive}</span>}
              </p>
              {nActive > 0 && (
                <button type="button" onClick={clear} className="text-[13px] font-semibold text-naranja-text hover:underline">
                  Limpiar
                </button>
              )}
            </div>
            <FiltersPanel f={f} set={set} facets={facets} locked={locked} />
          </div>
        </aside>

        {/* Resultados */}
        <div className={clsx("min-w-0", view === "map" && "lg:col-span-1")}>
          <h2 className="sr-only">Resultados</h2>
          {pending ? (
            <div className={clsx("grid gap-x-6 gap-y-12", view === "split" ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3")}>
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            emptyOperacion ? (
              <EmptyOperacion op={locked!} />
            ) : (
              <EmptyFilters onClear={clear} />
            )
          ) : view === "map" ? (
            <div className="relative h-[70vh] overflow-hidden rounded-[var(--radius-card)] lg:h-[calc(100dvh-10rem)]">
              <MapView
                markers={markers}
                highlightedId={hover}
                onMarkerHover={setHover}
                onMoveEnd={(b, byUser) => byUser && setPendingBbox(b)}
                className="absolute inset-0"
                ariaLabel="Mapa de resultados"
              />
              <SearchHere visible={!!pendingBbox} onClick={() => (set({ bbox: pendingBbox }), setPendingBbox(null))} />
            </div>
          ) : (
            <div
              key={`${view}-${sp.toString()}`}
              className={clsx(
                changed && "stagger-in",
                view === "list" ? "grid gap-10" : "grid gap-x-6 gap-y-12",
                view === "grid" && "sm:grid-cols-2 xl:grid-cols-3",
                view === "split" && "sm:grid-cols-2"
              )}
            >
              {results.map((p, i) => (
                <div key={p.id} style={{ "--k": Math.min(i, 8) } as React.CSSProperties}>
                  <PropertyCard
                    p={p}
                    layout={view === "list" ? "list" : "grid"}
                    priority={i < 2}
                    onHover={setHover}
                    highlighted={view === "split" && hover === p.id}
                    sizes={view === "split" ? "(min-width: 1024px) 22vw, 92vw" : view === "list" ? "(min-width: 640px) 40vw, 92vw" : undefined}
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA final */}
          <div className="mt-20 rounded-[var(--radius-card)] bg-ink p-8 text-white sm:p-12">
            <p className="eyebrow text-naranja">Búsqueda personalizada</p>
            <p className="mt-5 max-w-2xl text-h3 font-light">
              ¿No encontrás lo que buscás? <span className="text-naranja">Lo buscamos por vos,</span> incluso propiedades que todavía no se publicaron.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/inmobiliaria/busqueda-personalizada" arrow>
                Quiero que me busquen
              </ButtonLink>
              <ButtonLink href={waLink("Hola Bellagamba! No encontré lo que busco en la web, ¿me ayudan?")} variant="outline-light" icon={<WhatsAppIcon size={18} />}>
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Split: mapa sticky */}
        {view === "split" && (
          <div className="hidden lg:block">
            <div className="sticky top-20 h-[calc(100dvh-6rem)] overflow-hidden rounded-l-[var(--radius-card)]">
              {showMap && (
                <MapView
                  markers={markers}
                  highlightedId={hover}
                  onMarkerHover={setHover}
                  onMoveEnd={(b, byUser) => byUser && setPendingBbox(b)}
                  className="absolute inset-0"
                  ariaLabel="Mapa de resultados"
                />
              )}
              <SearchHere visible={!!pendingBbox} onClick={() => (set({ bbox: pendingBbox }), setPendingBbox(null))} />
            </div>
          </div>
        )}
      </div>

      {/* Drawer de filtros (mobile) */}
      <AnimatePresence>
        {drawer && (
          <>
            <motion.div className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-crema lg:hidden"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-ink/10 px-5">
                <p className="text-lg font-semibold">Filtros</p>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Cerrar filtros" className="grid size-10 place-items-center rounded-full bg-white">
                  <Icon name="close" size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6" data-lenis-prevent>
                <FiltersPanel f={f} set={set} facets={facets} locked={locked} />
              </div>
              <div className="flex shrink-0 gap-3 border-t border-ink/10 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button type="button" onClick={clear} className="h-12 rounded-full border border-ink/15 px-5 text-sm font-semibold">
                  Limpiar
                </button>
                <button type="button" onClick={() => setDrawer(false)} className="h-12 flex-1 rounded-full bg-naranja text-sm font-semibold text-ink">
                  Ver {results.length} {results.length === 1 ? "propiedad" : "propiedades"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchHere({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          onClick={onClick}
          className="absolute left-1/2 top-4 z-10 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-xl"
        >
          <Icon name="search" size={16} /> Buscar en esta zona
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function EmptyOperacion({ op }: { op: Operacion }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-white px-6 py-16 text-center ring-1 ring-ink/5 sm:px-12 sm:py-24">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-naranja-50 text-naranja-text">
        <Icon name="key" size={26} />
      </span>
      <h2 className="mx-auto mt-8 max-w-xl text-h3 font-light">
        Hoy no tenemos propiedades publicadas {OPERACION_EN[op]}, <span className="text-naranja-text">pero las buscamos por vos.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-md text-gris-text">Muchas oportunidades se cierran antes de publicarse. Contanos qué necesitás y te avisamos primero.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/inmobiliaria/busqueda-personalizada" arrow>
          Búsqueda personalizada
        </ButtonLink>
        <ButtonLink href={waLink(`Hola Bellagamba! Estoy buscando una propiedad ${OPERACION_EN[op]}.`)} variant="whatsapp" icon={<WhatsAppIcon size={18} />}>
          Escribinos por WhatsApp
        </ButtonLink>
      </div>
      <Link href="/inmobiliaria/venta" className="mt-8 inline-block text-sm font-semibold text-gris-text hover:text-ink">
        Ver propiedades en venta →
      </Link>
    </div>
  );
}

function EmptyFilters({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-ink/15 px-6 py-16 text-center">
      <p className="text-h3 font-light">No encontramos propiedades con esos filtros.</p>
      <p className="mt-3 text-gris-text">Probá ampliar la búsqueda o dejá que la hagamos por vos.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onClear} className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-naranja hover:text-ink">
          Limpiar filtros
        </button>
        <ButtonLink href="/inmobiliaria/busqueda-personalizada" variant="outline">
          Búsqueda personalizada
        </ButtonLink>
      </div>
    </div>
  );
}

