import { formatHour } from '$lib/utils/format';

/**
 * PRÁCTICA 3 — CLASE TimeSlot.
 *
 * Objeto de valor que representa una franja horaria [inicio, fin) expresada en
 * horas decimales de 24 h (9.5 = 9:30). Al ser un intervalo semiabierto, dos
 * reservas consecutivas (9-11 y 11-13) NO se solapan.
 */
export class TimeSlot {
  readonly start: number;
  readonly end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  /** Duración en horas decimales. */
  get durationHours(): number {
    return this.end - this.start;
  }

  /** Una franja es válida si el fin es posterior al inicio. */
  get isValid(): boolean {
    return this.end > this.start;
  }

  /**
   * Detecta colisiones con otra franja.
   * Hay solape si esta empieza antes de que acabe la otra y viceversa.
   */
  overlaps(other: TimeSlot): boolean {
    return this.start < other.end && other.start < this.end;
  }

  /** Indica si la franja queda íntegramente dentro de otra. */
  isWithin(other: TimeSlot): boolean {
    return this.start >= other.start && this.end <= other.end;
  }

  contains(hour: number): boolean {
    return hour >= this.start && hour < this.end;
  }

  /** Texto legible: "9:00 AM – 10:30 AM". */
  toString(): string {
    return `${formatHour(this.start)} – ${formatHour(this.end)}`;
  }

  equals(other: TimeSlot): boolean {
    return this.start === other.start && this.end === other.end;
  }
}
