import type { SeatStatus, SeatTier } from './types';

/**
 * CLASE Seat — representa una butaca de la sala.
 * El campo `status` es reactivo, por lo que cualquier componente que lo lea
 * se vuelve a dibujar automáticamente al cambiar.
 */
export class Seat {
  /** Recargo fijo que se suma al precio base en las butacas VIP. */
  static readonly VIP_SURCHARGE = 3;

  readonly row: string;
  readonly col: number;
  readonly tier: SeatTier;

  status = $state<SeatStatus>('available');

  constructor(row: string, col: number, tier: SeatTier, status: SeatStatus = 'available') {
    this.row = row;
    this.col = col;
    this.tier = tier;
    this.status = status;
  }

  /** Identificador legible de la butaca: "C7". */
  get id(): string {
    return `${this.row}${this.col}`;
  }

  get isVip(): boolean {
    return this.tier === 'vip';
  }

  get surcharge(): number {
    return this.isVip ? Seat.VIP_SURCHARGE : 0;
  }

  /** Sólo las butacas libres o ya elegidas por el usuario admiten interacción. */
  get isSelectable(): boolean {
    return this.status !== 'occupied';
  }

  /** Alterna entre libre y seleccionada. Devuelve el nuevo estado. */
  toggle(): SeatStatus {
    if (!this.isSelectable) return this.status;
    this.status = this.status === 'selected' ? 'available' : 'selected';
    return this.status;
  }

  release(): void {
    if (this.status === 'selected') this.status = 'available';
  }

  /** Marca la butaca como vendida (tras confirmar la compra). */
  confirmSale(): void {
    if (this.status === 'selected') this.status = 'occupied';
  }

  /** Precio final de esta butaca para una función y tarifa concretas. */
  priceFor(basePrice: number, multiplier: number): number {
    return (basePrice + this.surcharge) * multiplier;
  }
}
