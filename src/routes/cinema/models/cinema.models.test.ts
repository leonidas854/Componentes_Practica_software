import { beforeEach, describe, expect, it } from 'vitest';
import { Auditorium } from './Auditorium.svelte';
import { Seat } from './Seat.svelte';
import { TicketOrder } from './TicketOrder.svelte';
import type { TicketType } from './types';

const TICKET_TYPES: TicketType[] = [
  { id: 'general', label: 'General', multiplier: 1, description: '' },
  { id: 'student', label: 'Estudiante', multiplier: 0.75, description: '' },
  { id: 'child', label: 'Niño', multiplier: 0.5, description: '' }
];

describe('PRÁCTICA 1 — Clase Seat', () => {
  it('compone su identificador a partir de fila y columna', () => {
    expect(new Seat('C', 7, 'standard').id).toBe('C7');
  });

  it('alterna entre disponible y seleccionada', () => {
    const seat = new Seat('A', 1, 'standard');
    expect(seat.toggle()).toBe('selected');
    expect(seat.toggle()).toBe('available');
  });

  it('ignora la interacción cuando está ocupada', () => {
    const seat = new Seat('A', 1, 'standard', 'occupied');
    expect(seat.isSelectable).toBe(false);
    expect(seat.toggle()).toBe('occupied');
  });

  it('aplica recargo sólo a las butacas VIP', () => {
    expect(new Seat('A', 1, 'standard').surcharge).toBe(0);
    expect(new Seat('D', 1, 'vip').surcharge).toBe(Seat.VIP_SURCHARGE);
  });

  it('confirmSale sólo vende las butacas seleccionadas', () => {
    const selected = new Seat('A', 1, 'standard', 'selected');
    const free = new Seat('A', 2, 'standard', 'available');

    selected.confirmSale();
    free.confirmSale();

    expect(selected.status).toBe('occupied');
    expect(free.status).toBe('available');
  });
});

describe('PRÁCTICA 1 — Clase Auditorium', () => {
  it('construye la rejilla completa de butacas', () => {
    const auditorium = new Auditorium('s1');
    expect(auditorium.rows).toHaveLength(Auditorium.ROW_LABELS.length);
    expect(auditorium.seats).toHaveLength(auditorium.totalCount);
  });

  it('genera la misma ocupación para el mismo identificador de función', () => {
    const first = new Auditorium('s1');
    const second = new Auditorium('s1');
    const statusesOf = (room: Auditorium) => room.seats.map((seat) => seat.status).join('');

    expect(statusesOf(first)).toBe(statusesOf(second));
  });

  it('genera ocupaciones distintas para funciones distintas', () => {
    const statusesOf = (room: Auditorium) => room.seats.map((seat) => seat.status).join('');
    expect(statusesOf(new Auditorium('s1'))).not.toBe(statusesOf(new Auditorium('s2')));
  });

  it('marca como VIP las filas centrales', () => {
    const auditorium = new Auditorium('s1');
    const vipRows = auditorium.seats.filter((seat) => seat.isVip).map((seat) => seat.row);
    expect(new Set(vipRows)).toEqual(new Set(Auditorium.VIP_ROWS));
  });

  it('localiza butacas por identificador y por posición', () => {
    const auditorium = new Auditorium('s1');
    expect(auditorium.findById('A1')?.id).toBe('A1');
    expect(auditorium.seatAt(0, 0)?.id).toBe('A1');
    expect(auditorium.positionOf('B3')).toEqual([1, 2]);
    expect(auditorium.seatAt(99, 99)).toBeUndefined();
  });

  it('libera la selección sin tocar las butacas ya vendidas', () => {
    const auditorium = new Auditorium('s1');
    const free = auditorium.seats.find((seat) => seat.status === 'available');
    const sold = auditorium.seats.find((seat) => seat.status === 'occupied');
    free?.toggle();

    auditorium.clearSelection();

    expect(free?.status).toBe('available');
    expect(sold?.status).toBe('occupied');
  });
});

describe('PRÁCTICA 1 — Clase TicketOrder', () => {
  let order: TicketOrder;

  beforeEach(() => {
    order = new TicketOrder(10, TICKET_TYPES);
  });

  it('calcula el precio de una butaca estándar con tarifa general', () => {
    order.addSeat(new Seat('A', 1, 'standard'));
    expect(order.subtotal).toBe(10);
    expect(order.serviceFee).toBe(0.5);
    expect(order.total).toBe(10.5);
  });

  it('suma el recargo VIP antes de aplicar la tarifa', () => {
    // (10 base + 3 VIP) * 0.75 estudiante = 9.75
    order.addSeat(new Seat('D', 5, 'vip'), 'student');
    expect(order.subtotal).toBe(9.75);
  });

  it('recalcula el importe al cambiar la tarifa de una entrada', () => {
    const seat = new Seat('A', 1, 'standard');
    order.addSeat(seat);
    expect(order.subtotal).toBe(10);

    order.setTicketType(seat.id, 'child');
    expect(order.subtotal).toBe(5);
  });

  it('conserva el recargo VIP al cambiar de tarifa', () => {
    const seat = new Seat('D', 1, 'vip');
    order.addSeat(seat, 'general');
    expect(order.subtotal).toBe(13);

    order.setTicketType(seat.id, 'child');
    // (10 + 3) * 0.5 = 6.5
    expect(order.subtotal).toBe(6.5);
  });

  it('rechaza añadir dos veces la misma butaca', () => {
    const seat = new Seat('A', 1, 'standard');
    expect(order.addSeat(seat).ok).toBe(true);
    expect(order.addSeat(seat).ok).toBe(false);
    expect(order.count).toBe(1);
  });

  it('aplica el máximo de entradas por compra', () => {
    for (let i = 1; i <= TicketOrder.MAX_SEATS; i += 1) {
      expect(order.addSeat(new Seat('A', i, 'standard')).ok).toBe(true);
    }

    const rejected = order.addSeat(new Seat('B', 1, 'standard'));
    expect(rejected.ok).toBe(false);
    expect(rejected.reason).toContain('Máximo');
    expect(order.isFull).toBe(true);
    expect(order.remainingCapacity).toBe(0);
  });

  it('agrupa el desglose por tarifa', () => {
    order.addSeat(new Seat('A', 1, 'standard'), 'general');
    order.addSeat(new Seat('A', 2, 'standard'), 'general');
    order.addSeat(new Seat('A', 3, 'standard'), 'child');

    const breakdown = order.breakdownByType;
    expect(breakdown).toHaveLength(2);
    expect(breakdown.find((row) => row.ticketTypeId === 'general')).toMatchObject({
      quantity: 2,
      amount: 20
    });
    expect(breakdown.find((row) => row.ticketTypeId === 'child')).toMatchObject({
      quantity: 1,
      amount: 5
    });
  });

  it('lista las butacas ordenadas de forma natural', () => {
    order.addSeat(new Seat('A', 10, 'standard'));
    order.addSeat(new Seat('A', 2, 'standard'));
    expect(order.seatLabels).toBe('A2, A10');
  });

  it('quita butacas y vacía el pedido', () => {
    const seat = new Seat('A', 1, 'standard');
    order.addSeat(seat);

    expect(order.removeSeat(seat.id).ok).toBe(true);
    expect(order.removeSeat(seat.id).ok).toBe(false);
    expect(order.isEmpty).toBe(true);

    order.addSeat(seat);
    order.clear();
    expect(order.total).toBe(0);
  });

  it('exige al menos una tarifa disponible', () => {
    expect(() => new TicketOrder(10, [])).toThrow();
  });
});
