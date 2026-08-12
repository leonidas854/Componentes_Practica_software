import type { TimeSlot } from './TimeSlot';

export interface RoomData {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  pricePerHour: number;
  amenities: string[];
  image: string;
}

/**
 * PRÁCTICA 3 — CLASE Room.
 * Una sala de reuniones reservable. Conoce su propia tarifa y aforo,
 * de modo que el coste no se calcula fuera del modelo.
 */
export class Room {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly floor: number;
  readonly pricePerHour: number;
  readonly amenities: string[];
  readonly image: string;

  constructor(data: RoomData) {
    this.id = data.id;
    this.name = data.name;
    this.capacity = data.capacity;
    this.floor = data.floor;
    this.pricePerHour = data.pricePerHour;
    this.amenities = data.amenities;
    this.image = data.image;
  }

  /** Coste de ocupar la sala durante la franja indicada. */
  costFor(slot: TimeSlot): number {
    return Math.round(slot.durationHours * this.pricePerHour * 100) / 100;
  }

  /** ¿Caben los asistentes previstos? */
  fitsAttendees(attendees: number): boolean {
    return attendees > 0 && attendees <= this.capacity;
  }

  get description(): string {
    return `Piso ${this.floor} · Capacidad ${this.capacity}`;
  }
}
