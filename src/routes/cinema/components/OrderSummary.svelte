<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { formatCurrency, formatHour } from '$lib/utils/format';
  import type { TicketOrder } from '../models/TicketOrder.svelte';
  import type { Movie, Showtime, TicketType } from '../models/types';

  /**
   * Componente visual: Resumen del pedido.
   * PROPIEDADES: order, movie, showtime, ticketTypes.
   * EVENTOS: change (cambiar la tarifa de una entrada), click (quitar, vaciar, comprar).
   */
  interface OrderSummaryProps {
    order: TicketOrder;
    movie: Movie;
    showtime: Showtime;
    ticketTypes: TicketType[];
    onChangeTicketType: (seatId: string, ticketTypeId: string) => void;
    onRemoveSeat: (seatId: string) => void;
    onClear: () => void;
    onCheckout: () => void;
  }

  let {
    order,
    movie,
    showtime,
    ticketTypes,
    onChangeTicketType,
    onRemoveSeat,
    onClear,
    onCheckout
  }: OrderSummaryProps = $props();

  /** Las líneas se muestran ordenadas por butaca para que la lista no salte. */
  let sortedLines = $derived(
    [...order.lines].sort((a, b) => a.seatLabel.localeCompare(b.seatLabel, 'es', { numeric: true }))
  );
</script>

<aside class="summary-panel">
  <header class="summary-header">
    <h2>Tu pedido</h2>
    <p class="summary-sub">
      {movie.title} · {formatHour(showtime.hour)} · {showtime.format}
    </p>
    <p class="summary-sub muted">{showtime.hall}</p>
  </header>

  <div class="summary-body scrollbar-hide">
    {#if order.isEmpty}
      <EmptyState
        icon="event_seat"
        title="Sin butacas seleccionadas"
        description="Elige tus asientos en el mapa para ver el importe." />
    {:else}
      <ul class="line-list">
        {#each sortedLines as line (line.seatId)}
          <li class="line-item">
            <div class="line-top">
              <span class="line-seat">
                Butaca {line.seatLabel}
                {#if line.tier === 'vip'}
                  <Badge tone="primary">VIP</Badge>
                {/if}
              </span>
              <span class="line-price">{formatCurrency(line.unitPrice)}</span>
            </div>

            <div class="line-bottom">
              <!-- EVENTO CHANGE: cambiar la tarifa recalcula el total al instante -->
              <select
                class="fare-select"
                aria-label="Tarifa de la butaca {line.seatLabel}"
                value={line.ticketTypeId}
                onchange={(event) =>
                  onChangeTicketType(line.seatId, (event.currentTarget as HTMLSelectElement).value)}
              >
                {#each ticketTypes as type (type.id)}
                  <option value={type.id}>{type.label}</option>
                {/each}
              </select>

              <button
                type="button"
                class="line-remove"
                onclick={() => onRemoveSeat(line.seatId)}
                aria-label="Quitar butaca {line.seatLabel}"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </li>
        {/each}
      </ul>

      {#if order.breakdownByType.length > 1}
        <div class="breakdown">
          <span class="breakdown-title">Desglose por tarifa</span>
          {#each order.breakdownByType as row (row.ticketTypeId)}
            <div class="breakdown-row">
              <span>{row.label} × {row.quantity}</span>
              <span>{formatCurrency(row.amount)}</span>
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  <footer class="summary-footer">
    <div class="totals">
      <div class="total-line">
        <span>Subtotal ({order.count} {order.count === 1 ? 'entrada' : 'entradas'})</span>
        <span>{formatCurrency(order.subtotal)}</span>
      </div>
      <div class="total-line">
        <span>Cargo por servicio (5 %)</span>
        <span>{formatCurrency(order.serviceFee)}</span>
      </div>
      <div class="divider"></div>
      <div class="total-line grand">
        <span>Total</span>
        <span class="grand-amount">{formatCurrency(order.total)}</span>
      </div>
    </div>

    <div class="footer-actions">
      <Button variant="ghost" size="sm" disabled={order.isEmpty} onclick={onClear}>
        Vaciar
      </Button>
      <Button variant="primary" fullWidth disabled={order.isEmpty} onclick={onCheckout}>
        <span class="material-symbols-outlined" style="font-size: 18px;">confirmation_number</span>
        Comprar
      </Button>
    </div>

    <p class="capacity-note">
      {order.remainingCapacity} de 8 entradas disponibles en esta compra
    </p>
  </footer>
</aside>

<style>
  .summary-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-color);
    border-left: 1px solid var(--border-color);
  }

  .summary-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .summary-header h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .summary-sub {
    font-size: 0.8rem;
    color: var(--text-main);
    margin-top: 4px;
  }

  .summary-sub.muted {
    color: var(--text-muted);
    margin-top: 2px;
  }

  .summary-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
  }

  .line-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    list-style: none;
  }

  .line-item {
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    background: var(--surface-low);
    border: 1px solid var(--border-color);
  }

  .line-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .line-seat {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .line-price {
    font-size: 0.9rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .line-bottom {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
  }

  .fare-select {
    flex: 1;
    padding: 5px 8px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border-color);
    background: var(--surface-high);
    color: var(--text-main);
    font-size: 0.75rem;
    font-family: inherit;
    cursor: pointer;
  }

  .fare-select:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 1px;
  }

  .line-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .line-remove:hover {
    background: var(--danger-color);
    color: #fff;
  }

  .line-remove :global(.material-symbols-outlined) {
    font-size: 16px;
  }

  .breakdown {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm) 12px;
    border-radius: var(--radius-sm);
    background: var(--surface-low);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .breakdown-title {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    margin-bottom: 2px;
  }

  .breakdown-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .summary-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    background: var(--surface-low);
  }

  .totals {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: var(--spacing-md);
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .divider {
    height: 1px;
    background: var(--border-color);
    margin: 2px 0;
  }

  .total-line.grand {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .grand-amount {
    color: var(--primary-color);
    font-size: 1.35rem;
    font-variant-numeric: tabular-nums;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .capacity-note {
    text-align: center;
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: var(--spacing-sm);
  }
</style>
