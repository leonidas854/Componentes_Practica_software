import type { Seat } from './Seat.svelte';
import type { TicketLine, TicketType } from './types';

export interface OrderChangeResult {
  ok: boolean;
  reason?: string;
}

export interface TypeBreakdownRow {
  ticketTypeId: string;
  label: string;
  quantity: number;
  amount: number;
}

/**
 * CLASE TicketOrder — el pedido de entradas en curso.
 *
 * Concentra TODO el cálculo de importes: precio unitario por butaca y tarifa,
 * subtotal, cargo por servicio y total. La vista se limita a mostrar el resultado.
 */
export class TicketOrder {
  /** Número máximo de entradas por operación. */
  static readonly MAX_SEATS = 8;
  /** Cargo por servicio aplicado sobre el subtotal. */
  static readonly SERVICE_FEE_RATE = 0.05;

  readonly basePrice: number;
  readonly defaultTicketTypeId: string;

  lines = $state<TicketLine[]>([]);

  #ticketTypes: Map<string, TicketType>;

  constructor(basePrice: number, ticketTypes: TicketType[]) {
    if (ticketTypes.length === 0) {
      throw new Error('TicketOrder requiere al menos una tarifa disponible.');
    }
    this.basePrice = basePrice;
    this.#ticketTypes = new Map(ticketTypes.map((type) => [type.id, type]));
    this.defaultTicketTypeId = ticketTypes[0].id;
  }

  // ----- Consultas -----

  get count(): number {
    return this.lines.length;
  }

  get isEmpty(): boolean {
    return this.lines.length === 0;
  }

  get isFull(): boolean {
    return this.lines.length >= TicketOrder.MAX_SEATS;
  }

  get remainingCapacity(): number {
    return TicketOrder.MAX_SEATS - this.lines.length;
  }

  has(seatId: string): boolean {
    return this.lines.some((line) => line.seatId === seatId);
  }

  /** Etiquetas de las butacas ordenadas, p. ej. "A3, A4, D7". */
  get seatLabels(): string {
    return this.lines
      .map((line) => line.seatLabel)
      .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))
      .join(', ');
  }

  // ----- Cálculo de importes -----

  get subtotal(): number {
    return this.lines.reduce((sum, line) => sum + line.unitPrice, 0);
  }

  get serviceFee(): number {
    return round2(this.subtotal * TicketOrder.SERVICE_FEE_RATE);
  }

  get total(): number {
    return round2(this.subtotal + this.serviceFee);
  }

  /** Agrupa las entradas por tarifa para el desglose del resumen. */
  get breakdownByType(): TypeBreakdownRow[] {
    const grouped = new Map<string, TypeBreakdownRow>();

    for (const line of this.lines) {
      const existing = grouped.get(line.ticketTypeId);
      if (existing) {
        existing.quantity += 1;
        existing.amount = round2(existing.amount + line.unitPrice);
      } else {
        grouped.set(line.ticketTypeId, {
          ticketTypeId: line.ticketTypeId,
          label: this.#ticketTypes.get(line.ticketTypeId)?.label ?? line.ticketTypeId,
          quantity: 1,
          amount: round2(line.unitPrice)
        });
      }
    }

    return [...grouped.values()];
  }

  // ----- Comandos -----

  /** Añade una butaca al pedido aplicando el límite máximo de entradas. */
  addSeat(seat: Seat, ticketTypeId: string = this.defaultTicketTypeId): OrderChangeResult {
    if (this.has(seat.id)) {
      return { ok: false, reason: 'La butaca ya está en el pedido.' };
    }
    if (this.isFull) {
      return {
        ok: false,
        reason: `Máximo ${TicketOrder.MAX_SEATS} entradas por compra.`
      };
    }

    this.lines.push({
      seatId: seat.id,
      seatLabel: seat.id,
      tier: seat.tier,
      surcharge: seat.surcharge,
      ticketTypeId,
      unitPrice: this.#priceFor(seat.surcharge, ticketTypeId)
    });

    return { ok: true };
  }

  removeSeat(seatId: string): OrderChangeResult {
    const index = this.lines.findIndex((line) => line.seatId === seatId);
    if (index === -1) return { ok: false, reason: 'La butaca no está en el pedido.' };
    this.lines.splice(index, 1);
    return { ok: true };
  }

  /** Cambia la tarifa de una entrada ya añadida y recalcula su precio. */
  setTicketType(seatId: string, ticketTypeId: string): OrderChangeResult {
    const line = this.lines.find((item) => item.seatId === seatId);
    if (!line) return { ok: false, reason: 'La butaca no está en el pedido.' };
    if (!this.#ticketTypes.has(ticketTypeId)) {
      return { ok: false, reason: 'Tarifa desconocida.' };
    }

    line.ticketTypeId = ticketTypeId;
    line.unitPrice = this.#priceFor(line.surcharge, ticketTypeId);
    return { ok: true };
  }

  clear(): void {
    this.lines = [];
  }

  // ----- Interno -----

  #priceFor(surcharge: number, ticketTypeId: string): number {
    const multiplier = this.#ticketTypes.get(ticketTypeId)?.multiplier ?? 1;
    return round2((this.basePrice + surcharge) * multiplier);
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
