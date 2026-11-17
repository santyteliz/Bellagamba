/**
 * Datos MOCK del Portal de clientes (demo funcional sin backend).
 * Todo lo que el usuario hace (me interesa, descartes, comentarios, mensajes) se persiste en localStorage.
 * Las cifras de visitas/consultas del propietario son de DEMOSTRACIÓN y se muestran con la etiqueta "Modo demo".
 * Para producción: reemplazar por API real (Tokko / Hunter) con auth del lado servidor.
 */
export type Role = "comprador" | "propietario";

export interface DemoUser {
  email: string;
  password: string;
  role: Role;
  nombre: string;
  asesor: string;
}

export const DEMO_USERS: DemoUser[] = [
  { email: "comprador@demo.com", password: "demo1234", role: "comprador", nombre: "Comprador Demo", asesor: "Tu asesor Bellagamba" },
  { email: "propietario@demo.com", password: "demo1234", role: "propietario", nombre: "Propietario Demo", asesor: "Tu asesor Bellagamba" },
];

export const COMPRADOR = {
  busqueda: {
    operacion: "Compra",
    tipos: ["Casa", "PH"],
    zonas: ["Vicente López", "Olivos", "Florida"],
    ambientes: "4 o más",
    presupuesto: "Hasta USD 600.000",
    notas: "Con patio o jardín, cerca de colegios. Ideal cochera.",
    acordadaEl: "Reunión con el asesor",
  },
  // IDs reales de la cartera seleccionados para el perfil
  seleccionadas: [13734530, 10503015, 9866342, 12840899, 9863508, 10502791],
  mensajes: [
    { from: "asesor" as const, text: "¡Hola! Te armé una primera selección según lo que hablamos. Marcá las que te interesan y coordinamos visitas.", at: "Hace 2 días" },
    { from: "asesor" as const, text: "La de Güemes al 1200 tiene un jardín muy lindo, creo que te puede gustar.", at: "Hace 1 día" },
  ],
};

export const PROPIETARIO = {
  propiedadId: 13734530,
  estado: "Publicada",
  publicadaDesde: "Publicación activa",
  portales: ["bellagamba.com", "Zonaprop", "Argenprop", "MercadoLibre"],
  // Visitas a la ficha por semana (demo)
  visitasSemana: [64, 82, 71, 95, 120, 104, 138, 151],
  consultas: [
    { nombre: "Interesado/a #1", canal: "WhatsApp", fecha: "Lunes", texto: "Consulta por cochera y expensas." },
    { nombre: "Interesado/a #2", canal: "Web", fecha: "Martes", texto: "¿Acepta permuta por departamento?" },
    { nombre: "Interesado/a #3", canal: "Zonaprop", fecha: "Jueves", texto: "Quisiera coordinar una visita." },
  ],
  visitas: [
    { dia: "Sáb 10:00", estado: "Realizada", nota: "Familia con 2 hijos. Muy interesados en el jardín." },
    { dia: "Mar 17:30", estado: "Realizada", nota: "Segunda visita, vinieron con arquitecto." },
    { dia: "Jue 11:00", estado: "Confirmada", nota: "Primera visita." },
    { dia: "Sáb 12:00", estado: "A confirmar", nota: "Pendiente de confirmación del interesado." },
  ],
  documentos: [
    { nombre: "Autorización de venta.pdf", estado: "Firmado" },
    { nombre: "Informe de tasación.pdf", estado: "Disponible" },
    { nombre: "Título de propiedad.pdf", estado: "Recibido" },
    { nombre: "Plano municipal.pdf", estado: "Pendiente" },
    { nombre: "Libre deuda ABL / AySA.pdf", estado: "Pendiente" },
  ],
  mensajes: [
    { from: "asesor" as const, text: "¡Buenas noticias! Esta semana subieron las visitas a la ficha. Te paso el resumen.", at: "Hace 3 días" },
    { from: "asesor" as const, text: "El sábado hay una visita a confirmar, te aviso apenas la confirmen.", at: "Ayer" },
  ],
};
