import { beforeEach, describe, expect, it } from 'vitest';
import { Reservation, type ReservationDraft } from './Reservation';
import { ReservationManager } from './ReservationManager.svelte';
import { Room } from './Room';
import { TimeSlot } from './TimeSlot';

const BOARDROOM = new Room({
  id: 'r1',
  name: 'Boardroom A',
  capacity: 12,
  floor: 3,
  pricePerHour: 45,
  amenities: [],
  image: ''
});

const HUDDLE = new Room({
  id: 'r2',
  name: 'Huddle Studio',
  capacity: 4,
  floor: 4,
  pricePerHour: 25,
  amenities: [],
  image: ''
});

const DATE = '2026-03-10';
const OTHER_DATE = '2026-03-11';

function draft(overrides: Partial<ReservationDraft> = {}): ReservationDraft {
  return {
    roomId: BOARDROOM.id,
    title: 'Reunión de equipo',
    organizer: 'Laura Pérez',
    date: DATE,
    slot: new TimeSlot(9, 10),
    attendees: 5,
    ...overrides
  };
}

describe('PRÁCTICA 3 — Clase TimeSlot', () => {
  it('calcula su duración', () => {
    expect(new TimeSlot(9, 11.5).durationHours).toBe(2.5);
  });

  it('sólo es válida si el fin es posterior al inicio', () => {
    expect(new TimeSlot(9, 10).isValid).toBe(true);
    expect(new TimeSlot(10, 10).isValid).toBe(false);
    expect(new TimeSlot(11, 10).isValid).toBe(false);
  });

  it('detecta solapamientos', () => {
    const base = new TimeSlot(9, 11);

    expect(base.overlaps(new TimeSlot(10, 12))).toBe(true); // empieza dentro
    expect(base.overlaps(new TimeSlot(8, 10))).toBe(true); // acaba dentro
    expect(base.overlaps(new TimeSlot(9.5, 10.5))).toBe(true); // contenida
    expect(base.overlaps(new TimeSlot(8, 12))).toBe(true); // la envuelve
  });

  it('considera adyacentes las franjas consecutivas', () => {
    const base = new TimeSlot(9, 11);

    expect(base.overlaps(new TimeSlot(11, 13))).toBe(false);
    expect(base.overlaps(new TimeSlot(7, 9))).toBe(false);
  });

  it('comprueba si queda dentro de otra franja', () => {
    const day = new TimeSlot(8, 20);

    expect(new TimeSlot(9, 11).isWithin(day)).toBe(true);
    expect(new TimeSlot(7, 11).isWithin(day)).toBe(false);
    expect(new TimeSlot(19, 21).isWithin(day)).toBe(false);
  });

  it('indica qué horas contiene, con el fin excluido', () => {
    const slot = new TimeSlot(9, 11);

    expect(slot.contains(9)).toBe(true);
    expect(slot.contains(10.5)).toBe(true);
    expect(slot.contains(11)).toBe(false);
  });
});

describe('PRÁCTICA 3 — Clase Room', () => {
  it('calcula el coste según la duración', () => {
    expect(BOARDROOM.costFor(new TimeSlot(9, 11))).toBe(90);
    expect(BOARDROOM.costFor(new TimeSlot(9, 10.5))).toBe(67.5);
  });

  it('comprueba el aforo', () => {
    expect(BOARDROOM.fitsAttendees(12)).toBe(true);
    expect(BOARDROOM.fitsAttendees(13)).toBe(false);
    expect(BOARDROOM.fitsAttendees(0)).toBe(false);
  });
});

describe('PRÁCTICA 3 — Clase Reservation', () => {
  it('expone la duración y el coste en su sala', () => {
    const reservation = new Reservation('res-1', draft({ slot: new TimeSlot(9, 11) }));

    expect(reservation.durationHours).toBe(2);
    expect(reservation.costIn(BOARDROOM)).toBe(90);
    expect(reservation.matches(BOARDROOM.id, DATE)).toBe(true);
    expect(reservation.matches(HUDDLE.id, DATE)).toBe(false);
  });
});

describe('PRÁCTICA 3 — Clase ReservationManager', () => {
  let manager: ReservationManager;

  beforeEach(() => {
    manager = new ReservationManager([BOARDROOM, HUDDLE]);
  });

  it('registra una reserva válida', () => {
    const result = manager.add(draft());

    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(manager.reservations).toHaveLength(1);
  });

  it('recorta los espacios del título y del organizador', () => {
    const result = manager.add(draft({ title: '  Sprint  ', organizer: '  Marc  ' }));

    expect(result.reservation?.title).toBe('Sprint');
    expect(result.reservation?.organizer).toBe('Marc');
  });

  // --- Colisiones ---

  it('impide reservar una franja que se solapa', () => {
    manager.add(draft({ slot: new TimeSlot(9, 11) }));
    const result = manager.add(draft({ slot: new TimeSlot(10, 12) }));

    expect(result.ok).toBe(false);
    expect(result.errors.some((issue) => issue.message.includes('ocupada'))).toBe(true);
    expect(manager.reservations).toHaveLength(1);
  });

  it('permite reservas consecutivas', () => {
    manager.add(draft({ slot: new TimeSlot(9, 11) }));
    const result = manager.add(draft({ slot: new TimeSlot(11, 13) }));

    expect(result.ok).toBe(true);
    expect(manager.reservations).toHaveLength(2);
  });

  it('no hay colisión entre salas distintas a la misma hora', () => {
    manager.add(draft({ slot: new TimeSlot(9, 11) }));
    const result = manager.add(
      draft({ roomId: HUDDLE.id, slot: new TimeSlot(9, 11), attendees: 3 })
    );

    expect(result.ok).toBe(true);
  });

  it('no hay colisión entre días distintos en la misma sala', () => {
    manager.add(draft({ slot: new TimeSlot(9, 11) }));
    const result = manager.add(draft({ date: OTHER_DATE, slot: new TimeSlot(9, 11) }));

    expect(result.ok).toBe(true);
  });

  it('isSlotAvailable puede ignorar una reserva concreta al reprogramarla', () => {
    const created = manager.add(draft({ slot: new TimeSlot(9, 11) })).reservation!;

    expect(manager.isSlotAvailable(BOARDROOM.id, DATE, new TimeSlot(10, 12))).toBe(false);
    expect(manager.isSlotAvailable(BOARDROOM.id, DATE, new TimeSlot(10, 12), created.id)).toBe(
      true
    );
  });

  // --- Reglas de negocio ---

  it('exige un título y un organizador con contenido', () => {
    const result = manager.add(draft({ title: 'ab', organizer: '' }));

    expect(result.ok).toBe(false);
    expect(result.errors.map((issue) => issue.field)).toEqual(
      expect.arrayContaining(['title', 'organizer'])
    );
  });

  it('respeta el aforo de la sala', () => {
    const result = manager.add(draft({ roomId: HUDDLE.id, attendees: 10 }));

    expect(result.ok).toBe(false);
    expect(result.errors.some((issue) => issue.field === 'attendees')).toBe(true);
  });

  it('rechaza franjas fuera del horario de apertura', () => {
    const early = manager.add(draft({ slot: new TimeSlot(7, 9) }));
    const late = manager.add(draft({ slot: new TimeSlot(19, 21) }));

    expect(early.ok).toBe(false);
    expect(late.ok).toBe(false);
  });

  it('rechaza reuniones demasiado cortas o demasiado largas', () => {
    const short = manager.add(draft({ slot: new TimeSlot(9, 9.25) }));
    const long = manager.add(
      draft({ slot: new TimeSlot(9, 9 + ReservationManager.MAX_DURATION_HOURS + 0.5) })
    );

    expect(short.ok).toBe(false);
    expect(long.ok).toBe(false);
  });

  it('rechaza una franja invertida', () => {
    const result = manager.add(draft({ slot: new TimeSlot(12, 10) }));

    expect(result.ok).toBe(false);
    expect(result.errors[0].field).toBe('slot');
  });

  it('rechaza una sala inexistente', () => {
    const result = manager.add(draft({ roomId: 'no-existe' }));

    expect(result.ok).toBe(false);
    expect(result.errors.some((issue) => issue.field === 'room')).toBe(true);
  });

  // --- Cancelación y consultas ---

  it('cancela una reserva existente', () => {
    const created = manager.add(draft()).reservation!;

    expect(manager.cancel(created.id)).toBe(true);
    expect(manager.reservations).toHaveLength(0);
    expect(manager.cancel(created.id)).toBe(false);
  });

  it('devuelve las reservas del día ordenadas por hora', () => {
    manager.add(draft({ slot: new TimeSlot(15, 16) }));
    manager.add(draft({ slot: new TimeSlot(9, 10) }));
    manager.add(draft({ date: OTHER_DATE, slot: new TimeSlot(9, 10) }));

    const today = manager.forDate(DATE);
    expect(today).toHaveLength(2);
    expect(today.map((reservation) => reservation.slot.start)).toEqual([9, 15]);
  });

  it('calcula las horas libres restantes', () => {
    expect(manager.freeHours(BOARDROOM.id, DATE)).toBe(ReservationManager.totalOpenHours);

    manager.add(draft({ slot: new TimeSlot(9, 11) }));
    expect(manager.freeHours(BOARDROOM.id, DATE)).toBe(ReservationManager.totalOpenHours - 2);
  });

  // --- Barra horaria ---

  it('devuelve un único tramo libre cuando no hay reservas', () => {
    const segments = manager.timeline(BOARDROOM.id, DATE);

    expect(segments).toHaveLength(1);
    expect(segments[0].type).toBe('free');
    expect(segments[0].widthPercent).toBe(100);
  });

  it('intercala tramos libres y ocupados', () => {
    manager.add(draft({ slot: new TimeSlot(9, 11) }));

    const segments = manager.timeline(BOARDROOM.id, DATE);

    // 8-9 libre | 9-11 ocupado | 11-20 libre
    expect(segments.map((segment) => segment.type)).toEqual(['free', 'busy', 'free']);
    expect(segments[1].reservation?.title).toBe('Reunión de equipo');
  });

  it('no deja hueco cuando la reserva empieza a la hora de apertura', () => {
    manager.add(draft({ slot: new TimeSlot(8, 10) }));

    const segments = manager.timeline(BOARDROOM.id, DATE);
    expect(segments.map((segment) => segment.type)).toEqual(['busy', 'free']);
  });

  it('las anchuras de los tramos suman el 100 %', () => {
    manager.add(draft({ slot: new TimeSlot(9, 11) }));
    manager.add(draft({ slot: new TimeSlot(14, 15.5) }));

    const total = manager
      .timeline(BOARDROOM.id, DATE)
      .reduce((sum, segment) => sum + segment.widthPercent, 0);

    expect(total).toBeCloseTo(100, 6);
  });
});
