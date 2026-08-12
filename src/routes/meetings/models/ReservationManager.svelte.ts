import { createId } from '$lib/utils/format';
import { Reservation, type ReservationDraft } from './Reservation';
import type { Room } from './Room';
import { TimeSlot } from './TimeSlot';

export type IssueField = 'room' | 'title' | 'organizer' | 'attendees' | 'slot';

export interface ValidationIssue {
  field: IssueField;
  message: string;
}

export interface ReservationResult {
  ok: boolean;
  reservation?: Reservation;
  errors: ValidationIssue[];
}

export interface TimelineSegment {
  type: 'free' | 'busy';
  slot: TimeSlot;
  /** Anchura relativa del tramo dentro de la barra horaria (0-100). */
  widthPercent: number;
  reservation?: Reservation;
}

/**
 * PRÁCTICA 3 — CLASE ReservationManager.
 *
 * Núcleo del sistema: guarda las reservas y concentra TODAS las reglas de
 * negocio (horario de apertura, duración permitida, aforo y, sobre todo, la
 * detección de colisiones). La interfaz nunca decide si una reserva es válida;
 * se limita a preguntar y a mostrar el resultado.
 */
export class ReservationManager {
  /** Horario de apertura del edificio. */
  static readonly OPENING_HOUR = 8;
  static readonly CLOSING_HOUR = 20;
  static readonly MIN_DURATION_HOURS = 0.5;
  static readonly MAX_DURATION_HOURS = 4;

  /** Franja completa de un día laborable. */
  static get businessDay(): TimeSlot {
    return new TimeSlot(ReservationManager.OPENING_HOUR, ReservationManager.CLOSING_HOUR);
  }

  static get totalOpenHours(): number {
    return ReservationManager.CLOSING_HOUR - ReservationManager.OPENING_HOUR;
  }

  reservations = $state<Reservation[]>([]);

  #rooms: Map<string, Room>;

  constructor(rooms: Room[], initialReservations: Reservation[] = []) {
    this.#rooms = new Map(rooms.map((room) => [room.id, room]));
    this.reservations = [...initialReservations];
  }

  // ----- Consultas -----

  getRoom(roomId: string): Room | undefined {
    return this.#rooms.get(roomId);
  }

  /** Reservas de una sala en un día, ordenadas por hora de inicio. */
  forRoomAndDate(roomId: string, date: string): Reservation[] {
    return this.reservations
      .filter((reservation) => reservation.matches(roomId, date))
      .sort((a, b) => a.slot.start - b.slot.start);
  }

  /** Todas las reservas de un día, ordenadas por hora. */
  forDate(date: string): Reservation[] {
    return this.reservations
      .filter((reservation) => reservation.date === date)
      .sort((a, b) => a.slot.start - b.slot.start);
  }

  /**
   * ¿Está libre la franja?
   * `ignoreId` permite excluir una reserva concreta al reprogramarla.
   */
  isSlotAvailable(roomId: string, date: string, slot: TimeSlot, ignoreId?: string): boolean {
    return !this.forRoomAndDate(roomId, date).some(
      (reservation) => reservation.id !== ignoreId && reservation.slot.overlaps(slot)
    );
  }

  /** Horas todavía libres de una sala en un día. */
  freeHours(roomId: string, date: string): number {
    const booked = this.forRoomAndDate(roomId, date).reduce(
      (sum, reservation) => sum + reservation.durationHours,
      0
    );
    return Math.round((ReservationManager.totalOpenHours - booked) * 100) / 100;
  }

  /**
   * Construye los tramos libres y ocupados de una sala en un día concreto.
   * Es lo que dibuja la barra horaria de cada tarjeta.
   */
  timeline(roomId: string, date: string): TimelineSegment[] {
    const segments: TimelineSegment[] = [];
    const total = ReservationManager.totalOpenHours;
    let cursor = ReservationManager.OPENING_HOUR;

    for (const reservation of this.forRoomAndDate(roomId, date)) {
      const { start, end } = reservation.slot;

      // Hueco libre antes de la reserva
      if (start > cursor) {
        segments.push(makeSegment('free', new TimeSlot(cursor, start), total));
      }

      // La reserva en sí (se recorta si excediera el horario dibujado)
      const visibleEnd = Math.min(end, ReservationManager.CLOSING_HOUR);
      if (visibleEnd > cursor) {
        segments.push({
          ...makeSegment('busy', new TimeSlot(Math.max(start, cursor), visibleEnd), total),
          reservation
        });
      }

      cursor = Math.max(cursor, visibleEnd);
    }

    // Hueco libre final
    if (cursor < ReservationManager.CLOSING_HOUR) {
      segments.push(
        makeSegment('free', new TimeSlot(cursor, ReservationManager.CLOSING_HOUR), total)
      );
    }

    return segments;
  }

  // ----- Reglas de negocio -----

  /** Comprueba un borrador y devuelve la lista de problemas encontrados. */
  validate(draft: ReservationDraft, ignoreId?: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const room = this.getRoom(draft.roomId);

    if (!room) {
      issues.push({ field: 'room', message: 'La sala indicada no existe.' });
    }

    if (draft.title.trim().length < 3) {
      issues.push({ field: 'title', message: 'El título debe tener al menos 3 caracteres.' });
    }

    if (draft.organizer.trim().length < 3) {
      issues.push({
        field: 'organizer',
        message: 'Indica quién organiza la reunión (mínimo 3 caracteres).'
      });
    }

    if (room && !room.fitsAttendees(draft.attendees)) {
      issues.push({
        field: 'attendees',
        message: `La sala admite un máximo de ${room.capacity} personas.`
      });
    }

    issues.push(...this.#validateSlot(draft, ignoreId));

    return issues;
  }

  /** Registra la reserva sólo si supera todas las validaciones. */
  add(draft: ReservationDraft): ReservationResult {
    const errors = this.validate(draft);
    if (errors.length > 0) return { ok: false, errors };

    const reservation = new Reservation(createId('res'), {
      ...draft,
      title: draft.title.trim(),
      organizer: draft.organizer.trim()
    });

    this.reservations.push(reservation);
    return { ok: true, reservation, errors: [] };
  }

  /** Cancela una reserva. Devuelve true si existía. */
  cancel(reservationId: string): boolean {
    const index = this.reservations.findIndex((reservation) => reservation.id === reservationId);
    if (index === -1) return false;
    this.reservations.splice(index, 1);
    return true;
  }

  // ----- Interno -----

  #validateSlot(draft: ReservationDraft, ignoreId?: string): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const { slot } = draft;

    if (!slot.isValid) {
      issues.push({ field: 'slot', message: 'La hora de fin debe ser posterior a la de inicio.' });
      return issues;
    }

    if (!slot.isWithin(ReservationManager.businessDay)) {
      issues.push({
        field: 'slot',
        message: `El horario disponible es de ${ReservationManager.OPENING_HOUR}:00 a ${ReservationManager.CLOSING_HOUR}:00.`
      });
    }

    if (slot.durationHours < ReservationManager.MIN_DURATION_HOURS) {
      issues.push({ field: 'slot', message: 'La reunión debe durar al menos 30 minutos.' });
    }

    if (slot.durationHours > ReservationManager.MAX_DURATION_HOURS) {
      issues.push({
        field: 'slot',
        message: `La reunión no puede superar las ${ReservationManager.MAX_DURATION_HOURS} horas.`
      });
    }

    if (!this.isSlotAvailable(draft.roomId, draft.date, slot, ignoreId)) {
      issues.push({
        field: 'slot',
        message: 'La sala ya está ocupada en esa franja horaria.'
      });
    }

    return issues;
  }
}

function makeSegment(type: 'free' | 'busy', slot: TimeSlot, totalHours: number): TimelineSegment {
  return {
    type,
    slot,
    widthPercent: (slot.durationHours / totalHours) * 100
  };
}
