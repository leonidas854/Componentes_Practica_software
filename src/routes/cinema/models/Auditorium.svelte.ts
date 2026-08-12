import { Seat } from './Seat.svelte';
import type { SeatTier } from './types';

/**
 * CLASE Auditorium — la sala de proyección: una rejilla de butacas.
 *
 * La ocupación se genera de forma DETERMINISTA a partir del identificador de la
 * función. Así cada función tiene un mapa de butacas distinto pero estable, y el
 * HTML renderizado en el servidor coincide con el del navegador.
 */
export class Auditorium {
  static readonly ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  static readonly SEATS_PER_ROW = 10;
  /** Filas centrales con butacas VIP. */
  static readonly VIP_ROWS = ['D', 'E', 'F'];

  readonly showtimeId: string;
  readonly rows: Seat[][];

  constructor(showtimeId: string, occupancyRatio = 0.28) {
    this.showtimeId = showtimeId;
    const random = createSeededRandom(showtimeId);

    this.rows = Auditorium.ROW_LABELS.map((rowLabel) =>
      Array.from({ length: Auditorium.SEATS_PER_ROW }, (_, index) => {
        const tier: SeatTier = Auditorium.VIP_ROWS.includes(rowLabel) ? 'vip' : 'standard';
        const occupied = random() < occupancyRatio;
        return new Seat(rowLabel, index + 1, tier, occupied ? 'occupied' : 'available');
      })
    );
  }

  /** Todas las butacas en una única lista. */
  get seats(): Seat[] {
    return this.rows.flat();
  }

  get selectedSeats(): Seat[] {
    return this.seats.filter((seat) => seat.status === 'selected');
  }

  get availableCount(): number {
    return this.seats.filter((seat) => seat.status === 'available').length;
  }

  get totalCount(): number {
    return Auditorium.ROW_LABELS.length * Auditorium.SEATS_PER_ROW;
  }

  /** Porcentaje de butacas vendidas (0-100), útil para la cabecera de la sala. */
  get occupancyPercent(): number {
    const occupied = this.seats.filter((seat) => seat.status === 'occupied').length;
    return Math.round((occupied / this.totalCount) * 100);
  }

  findById(seatId: string): Seat | undefined {
    return this.seats.find((seat) => seat.id === seatId);
  }

  /**
   * Localiza una butaca por posición en la rejilla; se usa para moverse
   * con las flechas del teclado por el mapa de butacas.
   */
  seatAt(rowIndex: number, colIndex: number): Seat | undefined {
    return this.rows[rowIndex]?.[colIndex];
  }

  /** Devuelve la posición [fila, columna] de una butaca dentro de la rejilla. */
  positionOf(seatId: string): [number, number] | null {
    for (let r = 0; r < this.rows.length; r += 1) {
      const c = this.rows[r].findIndex((seat) => seat.id === seatId);
      if (c !== -1) return [r, c];
    }
    return null;
  }

  clearSelection(): void {
    for (const seat of this.seats) seat.release();
  }

  /** Convierte la selección actual en butacas vendidas. */
  confirmSelection(): void {
    for (const seat of this.seats) seat.confirmSale();
  }
}

/**
 * Generador pseudoaleatorio con semilla (mulberry32).
 * Garantiza la misma secuencia para la misma cadena de entrada.
 */
function createSeededRandom(seed: string): () => number {
  let state = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    state ^= seed.charCodeAt(i);
    state = Math.imul(state, 16777619);
  }

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
