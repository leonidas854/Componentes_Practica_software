import { toISODate } from '$lib/utils/format';
import { Reservation } from '../models/Reservation';
import { Room } from '../models/Room';
import { TimeSlot } from '../models/TimeSlot';

/**
 * PRÁCTICA 3 — Capa de datos.
 * Salas disponibles y agenda inicial. Las fechas se calculan a partir del día
 * actual, de modo que la aplicación siempre muestra una semana vigente.
 */

const IMG_BOARDROOM =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAv3LKcHz9eAlu77gMHfEje04oQX-02vNqxyV2GqKSvEm6hrRqEPRNB-zsmIYI3q19ZeyR8uL5SURVt-VdhgOs3l1WtI87OtrpwJAGAcZmZaHwbtyhgiTbHAGx37BPBd6r8TQBFoESNzd3fqLHHvc4Yj0PRcFFqIlcBELcvhNJKeqY2_yPL-QhSh24-c3effBw_2fRCo-bx-ROyz0AGmTolv-S3hJCOrFZ6YZovHwPdkWmJ4TOINInEmA';
const IMG_HUDDLE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDYwB_NciIG5kIIOPXX2E_RUdOJ4ymetPcRvZyKrdmYuFUAuEkS5MZ1MfIPduZittc4asF9SWsFzs3f0-ZXWpBVNuCtJqzsc9ObM24SMHAkMIdl6515WBDmIy8wZtImrNFE5M0rwzS_MI-kSJEvNX-ABhiGS5f9tOk5Bv2ZNkRNDP3KcdwysNfOtozBN91gbgPtKdgtLimZZnX5KPKh4FDtEi8KZCTQTxynbp45-6C80cHY5-c_5kvi6w';

export const ROOMS: Room[] = [
  new Room({
    id: 'r1',
    name: 'Boardroom A',
    capacity: 12,
    floor: 3,
    pricePerHour: 45,
    amenities: ['videocam', 'edit_note', 'coffee', 'wifi'],
    image: IMG_BOARDROOM
  }),
  new Room({
    id: 'r2',
    name: 'Huddle Studio',
    capacity: 4,
    floor: 4,
    pricePerHour: 25,
    amenities: ['tv', 'edit_note', 'wifi'],
    image: IMG_HUDDLE
  }),
  new Room({
    id: 'r3',
    name: 'Sala Panorama',
    capacity: 20,
    floor: 6,
    pricePerHour: 70,
    amenities: ['videocam', 'tv', 'mic', 'coffee', 'wifi'],
    image: IMG_BOARDROOM
  })
];

export interface CalendarDay {
  /** Fecha ISO corta (YYYY-MM-DD). */
  value: string;
  /** Abreviatura del día: "lun". */
  weekday: string;
  /** Número del día del mes. */
  dayNumber: number;
  isToday: boolean;
}

/** Genera los próximos `days` días naturales a partir de hoy. */
export function buildCalendar(days = 7, from: Date = new Date()): CalendarDay[] {
  const base = new Date(from.getFullYear(), from.getMonth(), from.getDate());

  return Array.from({ length: days }, (_, offset) => {
    const date = new Date(base);
    date.setDate(base.getDate() + offset);

    return {
      value: toISODate(date),
      weekday: date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
      dayNumber: date.getDate(),
      isToday: offset === 0
    };
  });
}

/**
 * Agenda de ejemplo para que las barras horarias no aparezcan vacías.
 * Se ancla a los primeros días del calendario recibido.
 */
export function buildInitialReservations(calendar: CalendarDay[]): Reservation[] {
  const today = calendar[0]?.value;
  const tomorrow = calendar[1]?.value ?? today;
  if (!today) return [];

  return [
    new Reservation('seed-1', {
      roomId: 'r1',
      title: 'Revisión trimestral',
      organizer: 'Laura Pérez',
      date: today,
      slot: new TimeSlot(9, 11),
      attendees: 8
    }),
    new Reservation('seed-2', {
      roomId: 'r1',
      title: 'Entrevista candidatos',
      organizer: 'Marc Soler',
      date: today,
      slot: new TimeSlot(16, 18),
      attendees: 3
    }),
    new Reservation('seed-3', {
      roomId: 'r2',
      title: 'Daily de producto',
      organizer: 'Equipo Diseño',
      date: today,
      slot: new TimeSlot(12.5, 13.5),
      attendees: 4
    }),
    new Reservation('seed-4', {
      roomId: 'r3',
      title: 'Presentación a cliente',
      organizer: 'Nuria Gil',
      date: tomorrow,
      slot: new TimeSlot(10, 12.5),
      attendees: 15
    })
  ];
}
