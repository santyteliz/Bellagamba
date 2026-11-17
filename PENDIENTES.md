# PENDIENTES · Web Bellagamba

Todo lo que en el sitio figura como **[CONFIRMAR]** o depende de un dato/credencial del cliente.
Regla del proyecto: **cero datos inventados**. Lo que no estaba en los insumos quedó marcado.

## 1. Datos de marca y contenido

| # | Pendiente | Dónde aparece | Qué necesitamos |
|---|-----------|---------------|-----------------|
| 1 | Contador de operaciones | No se muestra (la web actual dice "más de 200.000 operaciones": **no se usó**) | Cifra real, si quieren mostrarla |
| 2 | "+300 propiedades en cartera" | Home › contadores | Confirmar la cifra (el export de la demo trae 24 en venta) |
| 3 | Valoración en Google y reseñas reales | Home › contadores y testimonios (3 slots "[RESEÑA REAL PENDIENTE]") | `GOOGLE_PLACES_API_KEY` + `GOOGLE_PLACE_ID`; con eso se cargan solas (`lib/reviews.ts`) |
| 4 | Facebook, LinkedIn, YouTube | Footer (íconos deshabilitados) | URLs → `lib/site.ts` › `SITE.social` |
| 5 | Punto exacto de la oficina | Mapa de contacto | Lat/lng de Gaspar Campos 596 (hoy interpolado) → `lib/site.ts` |
| 6 | Años del timeline | Nosotros: "Crecimiento en Vicente López" y "Nace la Desarrolladora y Shulbius" | Años y, si hay, una foto histórica por hito |
| 7 | Equipo | Nosotros: 4 cards placeholder | Nombre, cargo, email, WhatsApp y foto de cada persona |
| 8 | Misión y visión | Nosotros | Textos propuestos a partir de sus frases: validar o reemplazar |
| 9 | Isotipo Shulbius oficial | Desarrolladora / Shulbius (se usa una interpretación de líneas verticales) | SVG oficial |
| 10 | Tipografía Gellix | Global (hoy Manrope) | Archivos .woff2 (Light, Regular, Medium, SemiBold) → `public/fonts/gellix/` y descomentar el `@font-face` en `app/globals.css` |
| 11 | Política de privacidad | /politica-de-privacidad | Razón social, CUIT y revisión legal del texto base |

## 2. Desarrollos / Emprendimientos

| # | Pendiente | Detalle |
|---|-----------|---------|
| 12 | Mill3, Drei, Emme, Doc, Dream | Dirección, etapa (en pozo / en obra / terminado), renders, unidades y precios. Hoy son cards tipográficas sin link |
| 13 | Roca 549 | Sale de la ficha real 12042203 (entrega nov. 2026). Confirmar si es un desarrollo Shulbius y su nombre comercial |
| 14 | Shulbius Kite | Se clasificó como "Terminado · unidades a estrenar" (antigüedad "A estrenar" en la ficha). Además, su descripción dice "EN ALQUILER" pero el export la trae en **venta**: confirmar operación |

## 3. Datos de la cartera (export de la web actual)

- **Cocheras y expensas** vienen vacías en las 24 fichas: no se muestran (Tokko las trae).
- **Orientación** venía como "Ambientes" en varias fichas (error del export): se oculta si no es un punto cardinal.
- **m² totales = 0** en Manuel Estrada: se oculta y se usan los cubiertos.
- **Planos**: había planos mezclados con fotos (Kite 06; Roca 549 06 y 20). Se movieron a la pestaña "Planos" a mano (`lib/properties/normalize.ts` › `PLANOS_DETECTADOS`). Con Tokko se separan solos (`is_blueprint`).
- **Reservada**: 12029784 se marca "Reservada" porque su texto dice "PROPIEDAD RESERVADA". Con Tokko usar el estado real.
- **Alquiler y Temporario**: sin propiedades en la demo → estado vacío con CTA a búsqueda personalizada y WhatsApp.
- **Características** (pileta, jardín, cochera, apto crédito…) se derivan del texto real de cada ficha; con Tokko conviene usar sus tags.
- **Calculadora de crédito**: valores iniciales orientativos (70%, 20 años, TNA 5,5%) editables por el usuario. Confirmar si prefieren otros valores o un banco de referencia.

## 4. Credenciales e integraciones (`.env`, ver `.env.example`)

| Variable | Para qué | Sin configurar… |
|----------|----------|-----------------|
| `PROPERTIES_SOURCE=tokko` + `TOKKO_API_KEY` | Cartera en vivo desde Tokko Broker (solo servidor) | Usa `data/propiedades.json` |
| `RESEND_API_KEY`, `FORMS_FROM_EMAIL` | Envío de formularios a info@bellagamba.com (verificar dominio en Resend) | Modo mock: se loguea en el servidor |
| `CRM_WEBHOOK_URL` | Reenviar cada formulario al CRM (Hunter/Tokko/Zapier) | No se reenvía |
| `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Analytics con consentimiento | No se cargan scripts |
| `REVALIDATE_SECRET` | `POST /api/revalidate` para refrescar la cartera (ISR) | Endpoint responde 401 |
| `NEXT_PUBLIC_SITE_URL` | URLs absolutas (OG, sitemap, links de WhatsApp) | `https://bellagamba.com` |

## 5. Funcionalidades que en la demo son locales y en producción necesitan backend

- **Portal de clientes**: login y datos mock (`data/portal-demo.ts`, localStorage, etiqueta "Modo demo"). Producción: auth real + API (Hunter/Tokko).
- **Alertas / búsquedas guardadas**: se guardan en el dispositivo y la búsqueda personalizada se envía por mail/CRM. Falta el servicio que dispare avisos automáticos.
- **Newsletter**: llega como formulario a info@; conectar a Mailchimp/Brevo/etc.
- **Fotos en Tasación**: hoy se envían los nombres de archivo; para adjuntarlas hace falta storage (S3, Vercel Blob o Cloudinary).
- **`?asesor=`**: hoy muestra el nombre que viene en el link. Para mostrar foto y teléfono de cada asesor, cargar el equipo (punto 7) y mapear slug → datos.
- **Redirect 301 de links del CRM**: lo hace el middleware con el JSON. Con Tokko, la página hace el mismo redirect (308, equivalente para Google) como red de seguridad.

## 6. Deploy

- Proyecto en Vercel apuntando a `web/`, dominio bellagamba.com, variables de entorno del punto 4.
- `npm run build` ya genera los placeholders blur y copia el worker de MapLibre (`prebuild`).
