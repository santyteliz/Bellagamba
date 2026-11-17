import "server-only";

export interface Review {
  author: string;
  rating: number;
  text: string;
  relativeTime?: string;
  photo?: string;
  pending?: boolean;
}

/**
 * Reseñas reales de Google (Places API, New). Requiere GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID.
 * Sin credenciales devolvemos 3 slots "[RESEÑA REAL PENDIENTE]": NO se inventan reseñas.
 */
export async function getGoogleReviews(): Promise<{ reviews: Review[]; rating: number | null; total: number | null; live: boolean }> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const place = process.env.GOOGLE_PLACE_ID;
  if (key && place) {
    try {
      const res = await fetch(`https://places.googleapis.com/v1/places/${place}?languageCode=es`, {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews" },
        next: { revalidate: 60 * 60 * 24 },
      });
      if (res.ok) {
        const j = (await res.json()) as {
          rating?: number;
          userRatingCount?: number;
          reviews?: { rating: number; text?: { text: string }; relativePublishTimeDescription?: string; authorAttribution?: { displayName: string; photoUri?: string } }[];
        };
        const reviews = (j.reviews || [])
          .filter((r) => r.rating >= 4 && r.text?.text)
          .map((r) => ({ author: r.authorAttribution?.displayName || "Cliente", rating: r.rating, text: r.text!.text, relativeTime: r.relativePublishTimeDescription, photo: r.authorAttribution?.photoUri }));
        if (reviews.length) return { reviews, rating: j.rating ?? null, total: j.userRatingCount ?? null, live: true };
      }
    } catch {
      /* fallback a placeholders */
    }
  }
  return {
    reviews: [1, 2, 3].map(() => ({ author: "[RESEÑA REAL PENDIENTE]", rating: 5, text: "Acá va una reseña real de Google de un cliente de Bellagamba. Se carga automáticamente al configurar la Places API.", pending: true })),
    rating: null,
    total: null,
    live: false,
  };
}
