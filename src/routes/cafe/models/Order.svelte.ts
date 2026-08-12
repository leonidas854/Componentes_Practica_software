import type { OrderLine, OrderTotals, Product, ServiceMode } from './types';

export interface OrderChangeResult {
  ok: boolean;
  reason?: string;
}

/** Numeración correlativa de los pedidos de la jornada. */
let nextOrderNumber = 1042;

/**
 * CLASE Order — el pedido que se está registrando en el mostrador.
 *
 * Resuelve el problema descrito en la práctica: el importe deja de calcularse a
 * mano. Todos los importes (subtotal, descuento, impuesto y total) se derivan de
 * las líneas del pedido, por lo que no pueden quedar desincronizados.
 */
export class Order {
  /** Impuesto aplicado sobre la base imponible. */
  static readonly TAX_RATE = 0.08;
  /** A partir de este subtotal se aplica un descuento por volumen. */
  static readonly DISCOUNT_THRESHOLD = 25;
  static readonly DISCOUNT_RATE = 0.1;
  /** Tope de unidades por producto en un mismo pedido. */
  static readonly MAX_QUANTITY_PER_LINE = 20;

  readonly number: number;

  lines = $state<OrderLine[]>([]);
  serviceMode = $state<ServiceMode>('dine-in');

  constructor() {
    this.number = nextOrderNumber;
    nextOrderNumber += 1;
  }

  // ----- Consultas -----

  get isEmpty(): boolean {
    return this.lines.length === 0;
  }

  /** Número total de unidades (no de líneas). */
  get itemCount(): number {
    return this.lines.reduce((sum, line) => sum + line.quantity, 0);
  }

  quantityOf(productId: string): number {
    return this.lines.find((line) => line.product.id === productId)?.quantity ?? 0;
  }

  findLine(productId: string): OrderLine | undefined {
    return this.lines.find((line) => line.product.id === productId);
  }

  // ----- Cálculo automático de importes -----

  get subtotal(): number {
    return round2(
      this.lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
    );
  }

  /** Descuento por volumen: 10 % cuando el subtotal alcanza el umbral. */
  get discount(): number {
    if (this.subtotal < Order.DISCOUNT_THRESHOLD) return 0;
    return round2(this.subtotal * Order.DISCOUNT_RATE);
  }

  /** Base sobre la que se calcula el impuesto, ya descontada la promoción. */
  get taxableBase(): number {
    return round2(this.subtotal - this.discount);
  }

  get tax(): number {
    return round2(this.taxableBase * Order.TAX_RATE);
  }

  get total(): number {
    return round2(this.taxableBase + this.tax);
  }

  /** Todos los importes agrupados, tal y como los consume el resumen. */
  get totals(): OrderTotals {
    return {
      subtotal: this.subtotal,
      discount: this.discount,
      tax: this.tax,
      total: this.total,
      itemCount: this.itemCount
    };
  }

  // ----- Comandos -----

  /** Añade unidades de un producto, creando la línea si aún no existe. */
  add(product: Product, quantity = 1): OrderChangeResult {
    if (product.available === false) {
      return { ok: false, reason: `${product.name} está agotado.` };
    }
    if (quantity <= 0) {
      return { ok: false, reason: 'La cantidad debe ser mayor que cero.' };
    }

    const line = this.findLine(product.id);
    const target = (line?.quantity ?? 0) + quantity;

    if (target > Order.MAX_QUANTITY_PER_LINE) {
      return {
        ok: false,
        reason: `Máximo ${Order.MAX_QUANTITY_PER_LINE} unidades de ${product.name}.`
      };
    }

    if (line) {
      line.quantity = target;
    } else {
      this.lines.push({ product, quantity, note: '' });
    }

    return { ok: true };
  }

  /**
   * Fija la cantidad exacta de un producto.
   * Con cantidad 0 la línea desaparece del pedido.
   */
  setQuantity(productId: string, quantity: number): OrderChangeResult {
    const line = this.findLine(productId);
    if (!line) return { ok: false, reason: 'El producto no está en el pedido.' };

    if (quantity <= 0) {
      return this.remove(productId);
    }
    if (quantity > Order.MAX_QUANTITY_PER_LINE) {
      return {
        ok: false,
        reason: `Máximo ${Order.MAX_QUANTITY_PER_LINE} unidades por producto.`
      };
    }

    line.quantity = quantity;
    return { ok: true };
  }

  increment(productId: string): OrderChangeResult {
    const line = this.findLine(productId);
    if (!line) return { ok: false, reason: 'El producto no está en el pedido.' };
    return this.setQuantity(productId, line.quantity + 1);
  }

  decrement(productId: string): OrderChangeResult {
    const line = this.findLine(productId);
    if (!line) return { ok: false, reason: 'El producto no está en el pedido.' };
    return this.setQuantity(productId, line.quantity - 1);
  }

  /** Nota para cocina asociada a una línea ("sin azúcar", "leche de avena"...). */
  setNote(productId: string, note: string): OrderChangeResult {
    const line = this.findLine(productId);
    if (!line) return { ok: false, reason: 'El producto no está en el pedido.' };
    line.note = note;
    return { ok: true };
  }

  remove(productId: string): OrderChangeResult {
    const index = this.lines.findIndex((line) => line.product.id === productId);
    if (index === -1) return { ok: false, reason: 'El producto no está en el pedido.' };
    this.lines.splice(index, 1);
    return { ok: true };
  }

  clear(): void {
    this.lines = [];
  }

  /** Copia inmutable del pedido para imprimir el comprobante. */
  toReceipt() {
    return {
      number: this.number,
      serviceMode: this.serviceMode,
      lines: this.lines.map((line) => ({
        name: line.product.name,
        unitPrice: line.product.price,
        quantity: line.quantity,
        note: line.note,
        lineTotal: round2(line.product.price * line.quantity)
      })),
      totals: this.totals
    };
  }
}

export type Receipt = ReturnType<Order['toReceipt']>;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
