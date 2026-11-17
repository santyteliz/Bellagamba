# Bellagamba · Web

Sitio de **Bellagamba Marketing Inmobiliario** (Inmobiliaria + Desarrolladora / Shulbius).
Next.js 15 (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger · Lenis · Framer Motion · MapLibre · React Hook Form + Zod · Resend · `next/og`.

## Correr

```bash
npm install
cp .env.example .env.local   # opcional: todo funciona sin credenciales (modo demo)
npm run dev                  # http://localhost:3000
npm run build && npm start   # producción
```

## Estructura

```
app/                      rutas (ver mapa abajo), sitemap.ts, robots.ts, api/forms, api/revalidate
components/
  layout/                 Header, Footer, WhatsApp flotante, cookies, cortina, preloader, Lenis, cursor
  ui/                     Button, Icon, Logo, Reveal, Counter, Marquee, PageHero
  home/                   Hero + buscador, destacadas pinned, secciones
  listing/                Listado con filtros en URL, grilla/lista/mapa/split
  ficha/                  Galería + lightbox, panel sticky, visita, calculadora, PDF
  forms/                  Contacto, Tasación (2 pasos), Búsqueda (2 pasos), Newsletter
  portal/ desarrollos/ favorites/ nosotros/ map/ intro/
lib/
  properties/             capa de datos: types, normalize, jsonAdapter, tokkoAdapter, filters, zones
  forms/schemas.ts        Zod compartido cliente/servidor
  site.ts                 datos de marca centralizados
  store.ts                favoritos, comparador, recientes, búsquedas, consentimiento (localStorage)
  analytics.ts            GA4 + Meta Pixel (solo con consentimiento)
data/                     propiedades.json (export real), blur.json (generado), portal-demo.ts (mock)
```

## Rutas

`/` intro → `/inmobiliaria` · `/inmobiliaria/{venta|alquiler|temporario|propiedades}` · ficha `/inmobiliaria/propiedad/{operacion}/{slug}/{id}` (compatible con links de Hunter; slug viejo → 301) · `emprendimientos` · `busqueda-personalizada` · `tasacion` · `nosotros` · `contacto` · `favoritos` · `comparar` · `/portal-clientes` · `/desarrolladora` (+ `/shulbius`, `/desarrollos`) · `/politica-de-privacidad` · `/ficha-pdf/{id}` (imprimible).

## Datos: JSON hoy, Tokko mañana

`lib/properties/index.ts` elige el adapter con `PROPERTIES_SOURCE` (`json` | `tokko`). La API key de Tokko vive solo en el servidor.
Al cambiar la cartera: `POST /api/revalidate?secret=…` (o esperar el ISR de 1 h).

## Formularios

Un solo endpoint `POST /api/forms` (`type` + `data`): valida con los mismos schemas Zod del cliente, honeypot, rate limit, envía por Resend a `info@bellagamba.com` y, opcional, webhook al CRM. Sin `RESEND_API_KEY` responde OK en modo mock.

## Pendientes

Ver [PENDIENTES.md](./PENDIENTES.md).
