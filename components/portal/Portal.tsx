"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { COMPRADOR, DEMO_USERS, PROPIETARIO, type DemoUser } from "@/data/portal-demo";
import type { PropertyCard as Card } from "@/lib/properties/types";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { formatPrice, formatM2 } from "@/lib/format";
import { waLink } from "@/lib/site";

type Msg = { from: "asesor" | "yo"; text: string; at: string };
const KEY = "bg:portal";

function load<T>(k: string, fallback: T): T {
  try {
    const v = localStorage.getItem(`${KEY}:${k}`);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(k: string, v: unknown) {
  try {
    localStorage.setItem(`${KEY}:${k}`, JSON.stringify(v));
  } catch {}
}

export function Portal({ cards }: { cards: Card[] }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const email = load<string | null>("session", null);
    setUser(DEMO_USERS.find((u) => u.email === email) ?? null);
    setReady(true);
  }, []);
  const logout = () => {
    save("session", null);
    setUser(null);
  };
  if (!ready) return <div className="min-h-[80vh]" />;
  return (
    <AnimatePresence mode="wait">
      {user ? (
        <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {user.role === "comprador" ? <Comprador user={user} cards={cards} onLogout={logout} /> : <Propietario user={user} cards={cards} onLogout={logout} />}
        </motion.div>
      ) : (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Login
            onLogin={(u) => {
              save("session", u.email);
              setUser(u);
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Login ---------------- */
function Login({ onLogin }: { onLogin: (u: DemoUser) => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    setTimeout(() => {
      const u = DEMO_USERS.find((x) => x.email === email.trim().toLowerCase() && x.password === pass);
      setLoading(false);
      if (u) onLogin(u);
      else setErr("Email o contraseña incorrectos. Revisá los datos que te pasó tu asesor.");
    }, 600);
  };
  return (
    <div className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="on-dark relative hidden overflow-hidden bg-ink lg:block">
        <Image src="/propiedades/14338622/03.jpg" alt="" fill sizes="50vw" className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="eyebrow text-naranja">Portal de clientes</p>
          <p className="mt-5 max-w-md text-h2 font-light">
            Tu operación, <span className="text-naranja">en tiempo real.</span>
          </p>
          <p className="mt-4 max-w-md text-white/70">Seguí tu búsqueda o tu publicación, mirá visitas y consultas, y hablá con tu asesor desde un solo lugar.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 pb-16 pt-32 sm:px-8">
        <div className="w-full max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full bg-naranja-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-text">
            <span className="size-1.5 rounded-full bg-naranja" /> Modo demo
          </span>
          <h1 className="mt-6 text-h2 font-light">Ingresá a tu portal</h1>
          <p className="mt-3 text-gris-text">Usá el email y la contraseña que te entregó tu asesor.</p>
          <form onSubmit={submit} className="mt-10 grid gap-4" noValidate>
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">Email</span>
              <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-14 w-full rounded-2xl border border-ink/12 bg-white px-4 outline-none focus:border-ink" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-gris-text">Contraseña</span>
              <input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} required className="h-14 w-full rounded-2xl border border-ink/12 bg-white px-4 outline-none focus:border-ink" />
            </label>
            {err && (
              <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {err}
              </p>
            )}
            <button type="submit" disabled={loading} className="mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white transition-colors hover:bg-naranja hover:text-ink disabled:opacity-60">
              {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> : <Icon name="lock" size={18} />} Ingresar
            </button>
          </form>
          <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm">
            <a href={waLink("Hola Bellagamba! Olvidé mi contraseña del Portal de clientes.")} target="_blank" rel="noopener noreferrer" className="font-semibold text-naranja-text hover:underline">
              Olvidé mi contraseña
            </a>
            <a href={waLink("Hola Bellagamba! Quiero acceso al Portal de clientes.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gris-text hover:text-ink">
              ¿No tenés acceso? <span className="font-semibold text-ink">Pedilo por WhatsApp</span>
            </a>
          </div>
          <div className="mt-10 rounded-2xl border border-dashed border-ink/20 p-5">
            <p className="eyebrow text-gris-text">Usuarios de prueba (demo)</p>
            <div className="mt-4 grid gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => {
                    setEmail(u.email);
                    setPass(u.password);
                  }}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-left text-sm ring-1 ring-ink/5 hover:ring-ink"
                >
                  <span>
                    <span className="block font-semibold capitalize">{u.role === "comprador" ? "Comprador" : "Propietario vendedor"}</span>
                    <span className="block text-gris-text">
                      {u.email} · {u.password}
                    </span>
                  </span>
                  <span className="text-[12px] font-semibold text-naranja-text">Completar</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shell ---------------- */
function Shell({ user, onLogout, children, title }: { user: DemoUser; onLogout: () => void; children: React.ReactNode; title: string }) {
  return (
    <div className="pb-24 pt-28 lg:pt-32">
      <div className="container-x">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] bg-white p-4 pl-6 ring-1 ring-ink/5">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-full bg-naranja text-lg font-semibold text-ink">{user.nombre[0]}</span>
            <div>
              <p className="text-[13px] text-gris-text">{title}</p>
              <p className="text-lg font-semibold">Hola, {user.nombre.split(" ")[0]}</p>
            </div>
            <span className="ml-2 hidden items-center gap-1.5 rounded-full bg-naranja-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-naranja-text sm:inline-flex">
              <span className="size-1.5 rounded-full bg-naranja" /> Modo demo
            </span>
          </div>
          <button type="button" onClick={onLogout} className="inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-sm font-semibold hover:border-ink">
            <Icon name="logout" size={16} /> Salir
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Comprador ---------------- */
type Decision = "interesa" | "descartada" | undefined;
function Comprador({ user, cards, onLogout }: { user: DemoUser; cards: Card[]; onLogout: () => void }) {
  const [decisions, setDecisions] = useState<Record<number, Decision>>({});
  const [comments, setComments] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState<"todas" | "interesa" | "descartada">("todas");
  useEffect(() => {
    setDecisions(load("decisiones", {}));
    setComments(load("comentarios", {}));
  }, []);
  const decide = (id: number, d: Decision) => {
    const next = { ...decisions, [id]: decisions[id] === d ? undefined : d };
    setDecisions(next);
    save("decisiones", next);
  };
  const comment = (id: number, t: string) => {
    const next = { ...comments, [id]: t };
    setComments(next);
    save("comentarios", next);
  };
  const sel = COMPRADOR.seleccionadas.map((id) => cards.find((c) => c.id === id)).filter(Boolean) as Card[];
  const shown = sel.filter((p) => (filter === "todas" ? true : decisions[p.id] === filter));
  const b = COMPRADOR.busqueda;

  return (
    <Shell user={user} onLogout={onLogout} title="Portal del comprador">
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-[var(--radius-card)] bg-ink p-6 text-white sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="eyebrow text-naranja">Tu búsqueda acordada</p>
              <span className="text-[12px] text-white/60">{b.acordadaEl}</span>
            </div>
            <dl className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                ["Operación", b.operacion],
                ["Tipo", b.tipos.join(", ")],
                ["Zonas", b.zonas.join(", ")],
                ["Ambientes", b.ambientes],
                ["Presupuesto", b.presupuesto],
                ["Asesor", user.asesor],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[12px] text-white/60">{k}</dt>
                  <dd className="mt-1 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/70">“{b.notas}”</p>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-h3 font-light">
                Seleccionadas <span className="text-naranja-text">para vos</span>
              </h2>
              <div role="tablist" className="inline-flex rounded-full bg-white p-1 ring-1 ring-ink/5">
                {(["todas", "interesa", "descartada"] as const).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={filter === t}
                    type="button"
                    onClick={() => setFilter(t)}
                    className={clsx("h-9 rounded-full px-4 text-[13px] font-semibold", filter === t ? "bg-ink text-white" : "text-ink/70")}
                  >
                    {t === "todas" ? `Todas (${sel.length})` : t === "interesa" ? `Me interesan (${Object.values(decisions).filter((x) => x === "interesa").length})` : "Descartadas"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <AnimatePresence initial={false}>
                {shown.map((p) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: decisions[p.id] === "descartada" ? 0.55 : 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid gap-4 overflow-hidden rounded-[var(--radius-card)] bg-white p-3 ring-1 ring-ink/5 sm:grid-cols-[220px_1fr]"
                  >
                    <Link href={p.href} className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-auto">
                      <Image src={p.foto_portada} alt={p.titulo} fill sizes="220px" className="object-cover" placeholder={p.blur[p.foto_portada] ? "blur" : "empty"} blurDataURL={p.blur[p.foto_portada]} />
                    </Link>
                    <div className="flex min-w-0 flex-col p-2 sm:p-3">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={p.href} className="font-medium hover:text-naranja-text">
                            {p.titulo}
                          </Link>
                          <p className="text-sm text-gris-text">
                            {p.direccion} · {p.barrio} {p.m2 ? `· ${formatM2(p.m2)}` : ""}
                          </p>
                        </div>
                        <p className="font-semibold tabular-nums">{formatPrice(p.precio, p.moneda)}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          aria-pressed={decisions[p.id] === "interesa"}
                          onClick={() => decide(p.id, "interesa")}
                          className={clsx("inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors", decisions[p.id] === "interesa" ? "bg-naranja text-ink" : "border border-ink/15 hover:border-ink")}
                        >
                          <Icon name="heart" size={15} className={decisions[p.id] === "interesa" ? "fill-ink" : ""} /> Me interesa
                        </button>
                        <button
                          type="button"
                          aria-pressed={decisions[p.id] === "descartada"}
                          onClick={() => decide(p.id, "descartada")}
                          className={clsx("inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[13px] font-semibold transition-colors", decisions[p.id] === "descartada" ? "bg-ink text-white" : "border border-ink/15 hover:border-ink")}
                        >
                          <Icon name="close" size={15} /> Descartar
                        </button>
                        <Link href={p.href} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-gris-text hover:text-ink">
                          Ver ficha <Icon name="arrow" size={14} />
                        </Link>
                      </div>
                      <label className="mt-4 block">
                        <span className="sr-only">Comentario para el asesor</span>
                        <textarea
                          rows={2}
                          placeholder="Dejale un comentario a tu asesor…"
                          defaultValue={comments[p.id] ?? ""}
                          onBlur={(e) => comment(p.id, e.target.value)}
                          className="w-full resize-none rounded-xl border border-ink/10 bg-crema px-3 py-2 text-sm outline-none focus:border-ink"
                        />
                      </label>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
              {shown.length === 0 && <p className="rounded-2xl border border-dashed border-ink/15 p-8 text-center text-gris-text">No hay propiedades en esta vista.</p>}
            </div>
          </section>
        </div>
        <Chat storeKey="chat-comprador" initial={COMPRADOR.mensajes} asesor={user.asesor} />
      </div>
    </Shell>
  );
}

/* ---------------- Propietario ---------------- */
function Propietario({ user, cards, onLogout }: { user: DemoUser; cards: Card[]; onLogout: () => void }) {
  const p = cards.find((c) => c.id === PROPIETARIO.propiedadId)!;
  const vs = PROPIETARIO.visitasSemana;
  const max = Math.max(...vs);
  const total = vs.reduce((a, b) => a + b, 0);
  return (
    <Shell user={user} onLogout={onLogout} title="Portal del propietario">
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <section className="grid overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink/5 sm:grid-cols-[260px_1fr]">
            <div className="relative aspect-[4/3] sm:aspect-auto">
              <Image src={p.foto_portada} alt={p.titulo} fill sizes="260px" className="object-cover" />
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ring-1 ring-ink/10">
                  <span className="size-2 rounded-full bg-verde" /> {PROPIETARIO.estado}
                </span>
                <span className="text-[12px] text-gris-text">{PROPIETARIO.publicadaDesde}</span>
              </div>
              <h2 className="mt-4 text-xl font-medium">{p.titulo}</h2>
              <p className="text-sm text-gris-text">
                {p.direccion} · {p.barrio}
              </p>
              <p className="mt-4 text-2xl font-semibold tabular-nums">{formatPrice(p.precio, p.moneda)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {PROPIETARIO.portales.map((x) => (
                  <span key={x} className="rounded-full bg-crema px-3 py-1 text-[12px] font-medium">
                    {x}
                  </span>
                ))}
              </div>
              <Link href={p.href} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-naranja-text hover:underline">
                Ver mi publicación <Icon name="arrow" size={14} />
              </Link>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            {[
              ["eye", "Visitas a la ficha", total.toLocaleString("es-AR"), "Últimas 8 semanas"],
              ["chat", "Consultas recibidas", String(PROPIETARIO.consultas.length), "Web, WhatsApp y portales"],
              ["calendar", "Visitas agendadas", String(PROPIETARIO.visitas.length), `${PROPIETARIO.visitas.filter((v) => v.estado === "Realizada").length} realizadas`],
            ].map(([i, t, v, s]) => (
              <div key={t} className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5">
                <span className="grid size-10 place-items-center rounded-full bg-crema">
                  <Icon name={i} size={18} />
                </span>
                <p className="mt-5 text-[13px] text-gris-text">{t}</p>
                <p className="mt-1 text-4xl font-light tabular-nums tracking-tight">{v}</p>
                <p className="mt-1 text-[12px] text-gris-text">{s}</p>
              </div>
            ))}
          </section>

          <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Visitas a la ficha por semana</h3>
              <span className="text-[12px] text-gris-text">Datos de demostración</span>
            </div>
            <div className="mt-6 flex h-40 items-end gap-2" role="img" aria-label={`Visitas por semana: ${vs.join(", ")}`}>
              {vs.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] tabular-nums text-gris-text">{v}</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className={clsx("w-full rounded-t-lg", i === vs.length - 1 ? "bg-naranja" : "bg-ink/80")} />
                  <span className="text-[11px] text-gris-text">S{i + 1}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5">
              <h3 className="font-semibold">Visitas agendadas</h3>
              <ol className="relative mt-6 space-y-6 border-l border-ink/10 pl-6">
                {PROPIETARIO.visitas.map((v) => (
                  <li key={v.dia} className="relative">
                    <span className={clsx("absolute -left-[31px] top-1 size-3 rounded-full ring-4 ring-white", v.estado === "Realizada" ? "bg-ink" : v.estado === "Confirmada" ? "bg-verde" : "bg-naranja")} />
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      {v.dia} <span className="rounded-full bg-crema px-2 py-0.5 text-[11px] font-semibold">{v.estado}</span>
                    </p>
                    <p className="mt-1 text-sm text-gris-text">{v.nota}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5">
              <h3 className="font-semibold">Consultas recibidas</h3>
              <ul className="mt-5 divide-y divide-ink/5">
                {PROPIETARIO.consultas.map((c) => (
                  <li key={c.nombre} className="py-3">
                    <p className="flex justify-between text-sm font-semibold">
                      {c.nombre} <span className="font-normal text-gris-text">{c.fecha}</span>
                    </p>
                    <p className="text-[13px] text-gris-text">
                      {c.canal} · {c.texto}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-ink/5">
            <h3 className="font-semibold">Documentación</h3>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {PROPIETARIO.documentos.map((d) => (
                <li key={d.nombre} className="flex items-center gap-3 rounded-xl bg-crema px-4 py-3">
                  <Icon name="file" size={18} className="shrink-0 text-gris" />
                  <span className="min-w-0 flex-1 truncate text-sm">{d.nombre}</span>
                  <span className={clsx("rounded-full px-2.5 py-0.5 text-[11px] font-semibold", d.estado === "Pendiente" ? "bg-naranja-50 text-naranja-text" : "bg-white")}>{d.estado}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <Chat storeKey="chat-propietario" initial={PROPIETARIO.mensajes} asesor={user.asesor} />
      </div>
    </Shell>
  );
}

/* ---------------- Chat con el asesor ---------------- */
function Chat({ storeKey, initial, asesor }: { storeKey: string; initial: Msg[]; asesor: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => setMsgs(load(storeKey, initial)), [storeKey, initial]);
  useEffect(() => end.current?.scrollIntoView({ block: "nearest" }), [msgs, typing]);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const next = [...msgs, { from: "yo" as const, text: text.trim(), at: "Ahora" }];
    setMsgs(next);
    save(storeKey, next);
    setText("");
    setTyping(true);
    setTimeout(() => {
      const r = [...next, { from: "asesor" as const, text: "¡Recibido! Te respondo a la brevedad. (Respuesta automática de la demo)", at: "Ahora" }];
      setMsgs(r);
      save(storeKey, r);
      setTyping(false);
    }, 1400);
  };
  return (
    <aside className="flex h-[640px] flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-ink/5 lg:sticky lg:top-24" aria-label="Mensajes con tu asesor">
      <div className="flex items-center gap-3 border-b border-ink/5 p-5">
        <span className="relative grid size-11 place-items-center rounded-full bg-ink">
          <Logo variant="blanco" className="w-7" />
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-verde ring-2 ring-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{asesor}</p>
          <p className="text-[12px] text-gris-text">Responde en horario comercial</p>
        </div>
        <a href={waLink("Hola! Te escribo desde el Portal de clientes.")} target="_blank" rel="noopener noreferrer" aria-label="Continuar por WhatsApp" className="grid size-10 place-items-center rounded-full bg-[#187a42] text-white">
          <WhatsAppIcon size={18} />
        </a>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-crema/60 p-5" data-lenis-prevent aria-live="polite">
        {msgs.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={clsx("flex", m.from === "yo" ? "justify-end" : "justify-start")}>
            <div className={clsx("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm", m.from === "yo" ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-white ring-1 ring-ink/5")}>
              <p>{m.text}</p>
              <p className={clsx("mt-1 text-[11px]", m.from === "yo" ? "text-white/60" : "text-gris-text")}>{m.at}</p>
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-1 rounded-2xl bg-white px-4 py-3 ring-1 ring-ink/5" style={{ width: "fit-content" }} aria-label="El asesor está escribiendo">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 animate-bounce rounded-full bg-gris" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        )}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-ink/5 p-3">
        <label className="flex-1">
          <span className="sr-only">Escribí un mensaje</span>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escribí un mensaje…" className="h-12 w-full rounded-full bg-crema px-5 text-sm outline-none focus:ring-2 focus:ring-naranja" />
        </label>
        <button type="submit" aria-label="Enviar mensaje" className="grid size-12 place-items-center rounded-full bg-naranja text-ink hover:bg-ink hover:text-white">
          <Icon name="send" size={18} />
        </button>
      </form>
    </aside>
  );
}
