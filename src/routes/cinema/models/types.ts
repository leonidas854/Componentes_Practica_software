/**
 * PRÁCTICA 1 — Venta de entradas de cine.
 * Capa de modelo: contratos de datos del dominio.
 */

export type SeatStatus = 'available' | 'selected' | 'occupied';

/** Categoría física de la butaca. Las VIP aplican un recargo fijo. */
export type SeatTier = 'standard' | 'vip';

export type ScreenFormat = '2D' | '3D' | 'IMAX';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  durationMin: number;
  rating: number;
  ageRating: string;
  synopsis: string;
  poster: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  /** Hora en formato decimal de 24h (18.5 = 6:30 PM). */
  hour: number;
  format: ScreenFormat;
  hall: string;
  /** Precio base de la butaca estándar para esta función. */
  basePrice: number;
}

/** Tarifa aplicable a una entrada; el multiplicador se aplica sobre el precio de la butaca. */
export interface TicketType {
  id: string;
  label: string;
  multiplier: number;
  description: string;
}

/** Una línea del pedido: una butaca concreta con la tarifa elegida. */
export interface TicketLine {
  seatId: string;
  seatLabel: string;
  tier: SeatTier;
  /** Recargo de la butaca (0 en estándar, importe fijo en VIP). */
  surcharge: number;
  ticketTypeId: string;
  unitPrice: number;
}

/** Datos del comprador recogidos por el formulario. */
export interface CustomerDetails {
  name: string;
  email: string;
}
