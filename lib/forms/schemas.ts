import { z } from "zod";

const nombre = z.string().trim().min(2, "Ingresá tu nombre").max(80);
const email = z.string().trim().email("Revisá el email");
const telefono = z
  .string()
  .trim()
  .min(8, "Ingresá un teléfono válido")
  .max(25)
  .regex(/^[\d\s()+-]+$/, "Solo números, espacios y + - ( )");
const mensaje = z.string().trim().max(2000).optional().or(z.literal(""));
/** Honeypot: campo invisible "website". Si viene con algo, es un bot. */
export const honeypot = z.string().max(0).optional().or(z.literal(""));

export const ASUNTOS = ["Consulta general", "Quiero vender", "Quiero alquilar mi propiedad", "Tasación", "Busco propiedad"] as const;

export const contactoSchema = z.object({
  nombre,
  email,
  telefono,
  asunto: z.enum(ASUNTOS, { message: "Elegí un asunto" }),
  mensaje: z.string().trim().min(5, "Contanos un poco más").max(2000),
  website: honeypot,
});

export const consultaSchema = z.object({
  nombre,
  email,
  telefono,
  mensaje: z.string().trim().min(5, "Escribí tu consulta").max(2000),
  propiedadId: z.number(),
  propiedadTitulo: z.string(),
  asesor: z.string().optional(),
  website: honeypot,
});

export const FRANJAS = ["Mañana (9:30 a 12:30)", "Mediodía (12:30 a 15:00)", "Tarde (15:00 a 18:30)"] as const;
export const visitaSchema = z.object({
  nombre,
  email,
  telefono,
  dia: z.string().min(1, "Elegí un día"),
  franja: z.enum(FRANJAS, { message: "Elegí una franja horaria" }),
  mensaje,
  propiedadId: z.number(),
  propiedadTitulo: z.string(),
  asesor: z.string().optional(),
  website: honeypot,
});

export const TIPOS_BUSQUEDA = ["Departamento", "Casa", "PH", "Terreno", "Local", "Oficina", "Cochera"] as const;
export const AMBIENTES_OPC = ["1", "2", "3", "4", "5+"] as const;

export const busquedaPaso1 = z.object({
  operacion: z.enum(["Compra", "Alquiler"], { message: "Elegí una operación" }),
  tipos: z.array(z.string()).min(1, "Elegí al menos un tipo"),
  zonas: z.array(z.string()).min(1, "Elegí al menos una zona"),
  ambientes: z.array(z.string()).min(1, "Elegí ambientes"),
  moneda: z.enum(["USD", "ARS"]),
  presupuesto: z.string().trim().min(1, "Indicá un presupuesto aproximado").regex(/^[\d.]+$/, "Solo números"),
});
export const busquedaPaso2 = z.object({
  nombre,
  email,
  telefono,
  mensaje,
  alerta: z.boolean().optional(),
  website: honeypot,
});
export const busquedaSchema = busquedaPaso1.merge(busquedaPaso2);

export const ANTIGUEDADES = ["A estrenar", "Hasta 10 años", "10 a 50 años", "Más de 50 años"] as const;
export const AMENITIES_TASACION = ["SUM", "Laundry", "Pileta", "Gym", "Parrilla"] as const;
export const tasacionPaso1 = z.object({ nombre, email, telefono, website: honeypot });
export const tasacionPaso2 = z.object({
  operacion: z.enum(["Venta", "Alquiler"], { message: "Elegí una operación" }),
  tipo: z.string().min(1, "Elegí el tipo"),
  ubicacion: z.string().trim().min(4, "La ubicación es obligatoria"),
  ambientes: z.enum(AMBIENTES_OPC, { message: "Elegí ambientes" }),
  supCubierta: z.string().regex(/^\d*$/, "Solo números").optional().or(z.literal("")),
  supTotal: z.string().regex(/^\d*$/, "Solo números").optional().or(z.literal("")),
  antiguedad: z.enum(ANTIGUEDADES, { message: "Elegí la antigüedad" }),
  garage: z.enum(["Sí", "No"], { message: "Indicá si tiene garage" }),
  amenities: z.array(z.string()).optional(),
  comentarios: mensaje,
});
export const tasacionSchema = tasacionPaso1.merge(tasacionPaso2).extend({ fotos: z.array(z.string()).optional() });

export const newsletterSchema = z.object({ email, website: honeypot });

export const FORM_TYPES = {
  contacto: contactoSchema,
  consulta: consultaSchema,
  visita: visitaSchema,
  busqueda: busquedaSchema,
  tasacion: tasacionSchema,
  newsletter: newsletterSchema,
} as const;
export type FormType = keyof typeof FORM_TYPES;

export const FORM_TITLES: Record<FormType, string> = {
  contacto: "Nueva consulta desde la web",
  consulta: "Consulta por propiedad",
  visita: "Solicitud de visita",
  busqueda: "Nueva búsqueda personalizada",
  tasacion: "Solicitud de tasación",
  newsletter: "Alta en newsletter",
};
