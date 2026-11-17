"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { waLink } from "@/lib/site";
import { track } from "@/lib/analytics";

/* Mensaje contextual: las páginas pueden sobreescribirlo con <WhatsAppMessage message="…" /> */
let override: string | null = null;
const ls = new Set<() => void>();
const msgStore = {
  sub: (l: () => void) => (ls.add(l), () => ls.delete(l)),
  get: () => override,
  set: (m: string | null) => ((override = m), ls.forEach((l) => l())),
};

export function WhatsAppMessage({ message }: { message: string }) {
  useEffect(() => {
    msgStore.set(message);
    return () => msgStore.set(null);
  }, [message]);
  return null;
}

const BY_PATH: [RegExp, string][] = [
  [/tasacion/, "Hola Bellagamba! Quiero tasar mi propiedad."],
  [/busqueda-personalizada/, "Hola Bellagamba! Estoy buscando una propiedad y me gustaría que me ayuden."],
  [/alquiler|temporario/, "Hola Bellagamba! Estoy buscando una propiedad en alquiler."],
  [/emprendimientos|desarrolladora/, "Hola Bellagamba! Quiero información sobre sus desarrollos."],
  [/portal-clientes/, "Hola Bellagamba! Necesito ayuda con el Portal de clientes."],
  [/venta|propiedades/, "Hola Bellagamba! Estoy buscando una propiedad en venta."],
];

export function WhatsAppFloat() {
  const pathname = usePathname();
  const custom = useSyncExternalStore(msgStore.sub, msgStore.get, () => null);
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 1200);
    const t2 = setTimeout(() => setTip(true), 9000);
    const t3 = setTimeout(() => setTip(false), 16000);
    return () => [t, t2, t3].forEach(clearTimeout);
  }, []);

  if (pathname === "/" || pathname.startsWith("/ficha-pdf")) return null;
  const isFicha = pathname.includes("/propiedad/");
  const msg = custom || BY_PATH.find(([r]) => r.test(pathname))?.[1] || "Hola Bellagamba! Quiero hacer una consulta.";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`no-print fixed right-4 z-40 flex items-center gap-3 sm:right-6 ${isFicha ? "bottom-6 max-lg:hidden" : "bottom-4 sm:bottom-6"}`}
        >
          <AnimatePresence>
            {tip && (
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="hidden rounded-2xl bg-white px-4 py-3 text-sm font-medium shadow-xl shadow-ink/10 sm:block"
              >
                ¿Hablamos? Respondemos rápido 👋
              </motion.p>
            )}
          </AnimatePresence>
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribinos por WhatsApp"
            onClick={() => track("click_whatsapp", { origen: "flotante", pagina: pathname })}
            className="group relative grid size-14 place-items-center rounded-full bg-[#187a42] text-white shadow-xl shadow-[#187a42]/30 transition-transform duration-300 hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-20 [animation-duration:2.6s]" aria-hidden="true" />
            <WhatsAppIcon size={28} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
