import type { Room } from './Room';
import { TimeSlot } from './TimeSlot';

export interface ReservationDraft {
  roomId: string;
  title: string;
  organizer: string;
  /** Fecha en formato ISO corto (YYYY-MM-DD). */
  date: string;
  slot: TimeSlot;
  attendees: number;
}

/**
 * PRÁCTICA 3 — CLASE Reservation.
 * Una reunión confirmada sobre una sala, una fecha y una franja horaria.
 * Las instancias son inmutables: cancelar y volver a crear es más simple
 * que mutar, y evita estados intermedios inconsistentes.
 */
export class Reservation {
  readonly id: string;
  readonly roomId: string;
  readonly title: string;
  readonly organizer: string;
  readonly date: string;
  readonly slot: TimeSlot;
  readonly attendees: number;

  constructor(id: string, draft: ReservationDraft) {
    this.id = id;
    this.roomId = draft.roomId;
    this.title = draft.title;
    this.organizer = draft.organizer;
    this.date = draft.date;
    this.slot = draft.slot;
    this.attendees = draft.attendees;
  }

  get durationHours(): number {
    return this.slot.durationHours;
  }

  /** Coste de la reunión según la tarifa de la sala. */
  costIn(room: Room): number {
    return room.costFor(this.slot);
  }

  /** ¿Coincide con la sala y el día indicados? */
  matches(roomId: string, date: string): boolean {
    return this.roomId === roomId && this.date === date;
  }

  get timeRange(): string {
    return this.slot.toString();
  }
}
