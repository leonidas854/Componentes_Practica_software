import type { Movie, Showtime, TicketType } from '../models/types';

/**
 * PRÁCTICA 1 — Capa de datos.
 * Catálogo estático de la cartelera. Aislarlo aquí permite cambiar el origen
 * de los datos (una API, por ejemplo) sin tocar la vista ni el modelo.
 */

const POSTER_SCIFI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuADo5jCGYOxOuEpv88-SHKILwjsG4XqjJIXeONdS1zRx7Q0AscBknlJyLfJTUt7V9skln7tcKartIGi08ChjAWLLzB9szFoUtx2uN22RCaPa9OY7xalZKX8XuuNfCOz4auQyxeOhvnv3jPx4gFuwwz9cahizFV2f3XFaixwXIiJUzgo4PByD9JlExMfvXWOpczeV1U7CMRCAggG1o8P4U7iaka9az8BCmXI9NKN7XpNe6EARDMqpQpYfw';
const POSTER_DRAMA =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAc3c49E5_99dUe0E5QLq4WxM5T2y_Pq5l8KQhSiut3ADg_OXB1XbdgkWDuWN3uJLEa7KXECa2noh5x89X4zfBKkKXMyMqROAXF6RpgbiNymhGPdLEuP0Th8oiiRQMX-Bp5AQMrtR_NrRdX-WRtDv4hzU7uqStemuUstMdiJm5SGfYknn0A5l3K9Oor7jKP8Wy_nV51KrMMffr1nx3XbBgOVbSGDrXZvYDtePqbAwNY4NzBwnWkFEfhmg';

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Neon Orbit: El Despertar',
    genre: 'Ciencia ficción',
    durationMin: 142,
    rating: 8.9,
    ageRating: '+12',
    synopsis:
      'Una ingeniera orbital descubre que la estación que mantiene con vida a la colonia esconde un pasajero imposible.',
    poster: POSTER_SCIFI
  },
  {
    id: 'm2',
    title: 'Puente a Ninguna Parte',
    genre: 'Drama',
    durationMin: 110,
    rating: 7.5,
    ageRating: '+16',
    synopsis:
      'Dos hermanos separados durante veinte años se reencuentran para vender la casa familiar en un pueblo que ya no existe.',
    poster: POSTER_DRAMA
  },
  {
    id: 'm3',
    title: 'La Última Sombra',
    genre: 'Suspenso',
    durationMin: 128,
    rating: 8.2,
    ageRating: '+16',
    synopsis:
      'Una detective con insomnio persigue a un asesino que sólo actúa durante los apagones de la ciudad.',
    poster: POSTER_SCIFI
  }
];

/**
 * Funciones disponibles. El precio base varía según el formato de proyección,
 * de modo que cambiar de horario recalcula automáticamente el importe.
 */
export const SHOWTIMES: Showtime[] = [
  // Neon Orbit
  { id: 's1', movieId: 'm1', hour: 16.5, format: '2D', hall: 'Sala 1', basePrice: 12 },
  { id: 's2', movieId: 'm1', hour: 19, format: '3D', hall: 'Sala 4', basePrice: 15 },
  { id: 's3', movieId: 'm1', hour: 21.5, format: 'IMAX', hall: 'Sala IMAX', basePrice: 19 },
  // Puente a Ninguna Parte
  { id: 's4', movieId: 'm2', hour: 17, format: '2D', hall: 'Sala 2', basePrice: 11 },
  { id: 's5', movieId: 'm2', hour: 20, format: '2D', hall: 'Sala 2', basePrice: 12 },
  // La Última Sombra
  { id: 's6', movieId: 'm3', hour: 18.5, format: '2D', hall: 'Sala 3', basePrice: 12 },
  { id: 's7', movieId: 'm3', hour: 22, format: '3D', hall: 'Sala 5', basePrice: 15 }
];

/** Tarifas: el multiplicador se aplica sobre el precio de la butaca. */
export const TICKET_TYPES: TicketType[] = [
  { id: 'general', label: 'General', multiplier: 1, description: 'Entrada estándar' },
  { id: 'student', label: 'Estudiante', multiplier: 0.75, description: '25 % de descuento' },
  { id: 'child', label: 'Niño', multiplier: 0.6, description: '40 % de descuento' },
  { id: 'senior', label: 'Tercera edad', multiplier: 0.7, description: '30 % de descuento' }
];

/** Devuelve las funciones de una película ordenadas por hora. */
export function showtimesForMovie(movieId: string): Showtime[] {
  return SHOWTIMES.filter((showtime) => showtime.movieId === movieId).sort(
    (a, b) => a.hour - b.hour
  );
}
