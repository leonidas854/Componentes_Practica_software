import { beforeEach, describe, expect, it } from 'vitest';
import { Order } from './Order.svelte';
import type { Product } from './types';

const COFFEE: Product = {
  id: 'c1',
  name: 'Espresso',
  description: '',
  price: 3.5,
  category: 'coffee'
};

const CAKE: Product = {
  id: 'p1',
  name: 'Tarta',
  description: '',
  price: 4.2,
  category: 'pastry'
};

const SOLD_OUT: Product = {
  id: 'c6',
  name: 'Flat White',
  description: '',
  price: 4.9,
  category: 'coffee',
  available: false
};

describe('PRÁCTICA 2 — Clase Order', () => {
  let order: Order;

  beforeEach(() => {
    order = new Order();
  });

  it('nace vacía y con numeración correlativa', () => {
    const next = new Order();
    expect(order.isEmpty).toBe(true);
    expect(order.itemCount).toBe(0);
    expect(order.total).toBe(0);
    expect(next.number).toBe(order.number + 1);
  });

  it('agrupa las unidades del mismo producto en una sola línea', () => {
    order.add(COFFEE);
    order.add(COFFEE);

    expect(order.lines).toHaveLength(1);
    expect(order.quantityOf(COFFEE.id)).toBe(2);
    expect(order.itemCount).toBe(2);
  });

  it('calcula el subtotal automáticamente', () => {
    order.add(COFFEE, 2); // 7.00
    order.add(CAKE); // 4.20
    expect(order.subtotal).toBe(11.2);
  });

  it('aplica el impuesto del 8 % sobre el subtotal', () => {
    order.add(COFFEE, 2); // 7.00
    expect(order.discount).toBe(0);
    expect(order.tax).toBe(0.56);
    expect(order.total).toBe(7.56);
  });

  it('aplica el descuento por volumen al alcanzar el umbral', () => {
    order.add(COFFEE, 10); // 35.00

    expect(order.subtotal).toBe(35);
    expect(order.discount).toBe(3.5);
    expect(order.taxableBase).toBe(31.5);
    expect(order.tax).toBe(2.52);
    expect(order.total).toBe(34.02);
  });

  it('no descuenta por debajo del umbral', () => {
    order.add(COFFEE, 7); // 24.50 < 25
    expect(order.discount).toBe(0);
  });

  it('rechaza productos agotados', () => {
    const result = order.add(SOLD_OUT);
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('agotado');
    expect(order.isEmpty).toBe(true);
  });

  it('respeta el máximo de unidades por producto', () => {
    order.add(COFFEE, Order.MAX_QUANTITY_PER_LINE);
    const result = order.add(COFFEE);

    expect(result.ok).toBe(false);
    expect(order.quantityOf(COFFEE.id)).toBe(Order.MAX_QUANTITY_PER_LINE);
  });

  it('fija la cantidad exacta de una línea', () => {
    order.add(COFFEE);
    order.setQuantity(COFFEE.id, 5);
    expect(order.quantityOf(COFFEE.id)).toBe(5);
  });

  it('elimina la línea al fijar la cantidad en cero', () => {
    order.add(COFFEE);
    order.setQuantity(COFFEE.id, 0);

    expect(order.isEmpty).toBe(true);
    expect(order.quantityOf(COFFEE.id)).toBe(0);
  });

  it('incrementa y decrementa unidades', () => {
    order.add(COFFEE);
    order.increment(COFFEE.id);
    expect(order.quantityOf(COFFEE.id)).toBe(2);

    order.decrement(COFFEE.id);
    expect(order.quantityOf(COFFEE.id)).toBe(1);

    order.decrement(COFFEE.id);
    expect(order.isEmpty).toBe(true);
  });

  it('guarda una nota por línea', () => {
    order.add(COFFEE);
    order.setNote(COFFEE.id, 'sin azúcar');
    expect(order.findLine(COFFEE.id)?.note).toBe('sin azúcar');
  });

  it('informa cuando se opera sobre un producto ausente', () => {
    expect(order.setQuantity('desconocido', 3).ok).toBe(false);
    expect(order.remove('desconocido').ok).toBe(false);
    expect(order.setNote('desconocido', 'x').ok).toBe(false);
  });

  it('vacía el pedido completo', () => {
    order.add(COFFEE, 3);
    order.clear();

    expect(order.isEmpty).toBe(true);
    expect(order.subtotal).toBe(0);
  });

  it('genera un comprobante con el detalle de lo pedido', () => {
    order.add(COFFEE, 2);
    order.add(CAKE);
    order.setNote(COFFEE.id, 'para llevar');
    order.serviceMode = 'takeaway';

    const receipt = order.toReceipt();

    expect(receipt.number).toBe(order.number);
    expect(receipt.serviceMode).toBe('takeaway');
    expect(receipt.lines).toHaveLength(2);
    expect(receipt.lines[0]).toMatchObject({
      name: 'Espresso',
      quantity: 2,
      lineTotal: 7,
      note: 'para llevar'
    });
    expect(receipt.totals.total).toBe(order.total);
  });

  it('el comprobante no cambia si el pedido se modifica después', () => {
    order.add(COFFEE);
    const receipt = order.toReceipt();

    order.add(CAKE);

    expect(receipt.lines).toHaveLength(1);
    expect(receipt.totals.subtotal).toBe(3.5);
  });
});
