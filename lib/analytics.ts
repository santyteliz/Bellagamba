"use client";
/**
 * Analytics preparado: GA4 + Meta Pixel. Solo dispara si el visitante aceptó "todas" las cookies
 * (los scripts ni siquiera se cargan sin consentimiento, ver components/layout/Analytics.tsx).
 * Eventos: search, view_item (ver ficha), click_whatsapp, generate_lead (envío de formulario),
 * add_to_wishlist, share.
 */
type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const META_MAP: Record<string, string> = {
  search: "Search",
  view_item: "ViewContent",
  click_whatsapp: "Contact",
  generate_lead: "Lead",
  add_to_wishlist: "AddToWishlist",
};

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    const meta = META_MAP[event];
    if (meta) window.fbq?.("track", meta, params);
    else window.fbq?.("trackCustom", event, params);
  } catch {
    /* noop */
  }
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", event, params);
}
