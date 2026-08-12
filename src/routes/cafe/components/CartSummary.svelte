<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import QuantityStepper from '$lib/components/QuantityStepper.svelte';
  import { formatCurrency } from '$lib/utils/format';
  import { Order } from '../models/Order.svelte';
  import type { ServiceMode } from '../models/types';

  /**
   * Componente visual: Resumen del pedido.
   *
   * MANEJO DE EVENTOS:
   *  - click  → modalidad de servicio, quitar línea, vaciar, procesar
   *  - change → cantidad escrita directamente en el selector
   *  - input  → nota para cocina de cada línea
   */
  interface CartSummaryProps {
    order: Order;
    onSetQuantity: (productId: string, quantity: number) => void;
    onSetNote: (productId: string, note: string) => void;
    onRemove: (productId: string) => void;
    onServiceModeChange: (mode: ServiceMode) => void;
    onClear: () => void;
    onCheckout: () => void;
  }

  let {
    order,
    onSetQuantity,
    onSetNote,
    onRemove,
    onServiceModeChange,
    onClear,
    onCheckout
  }: CartSummaryProps = $props();

  const SERVICE_MODES: { id: ServiceMode; label: string; icon: string }[] = [
    { id: 'dine-in', label: 'En local', icon: 'storefront' },
    { id: 'takeaway', label: 'Para llevar', icon: 'takeout_dining' }
  ];

  /** Cuánto falta para alcanzar la promoción por volumen. */
  let amountToDiscount = $derived(Order.DISCOUNT_THRESHOLD - order.subtotal);
</script>

<section class="cart-panel">
  <header class="cart-header">
    <div class="cart-title-row">
      <h2>Pedido actual</h2>
      <Badge tone="primary">#{order.number}</Badge>
    </div>

    <!-- EVENTO CLICK: modalidad de servicio -->
    <div class="mode-toggle" role="group" aria-label="Modalidad del pedido">
      {#each SERVICE_MODES as mode (mode.id)}
        <button
          type="button"
          class="mode-btn"
          class:active={order.serviceMode === mode.id}
          aria-pressed={order.serviceMode === mode.id}
          onclick={() => onServiceModeChange(mode.id)}
        >
          <span class="material-symbols-outlined">{mode.icon}</span>
          {mode.label}
        </button>
      {/each}
    </div>
  </header>

  <div class="cart-items scrollbar-hide">
    {#if order.isEmpty}
      <EmptyState
        icon="shopping_cart"
        title="Aún no hay productos"
        description="Selecciona artículos de la carta para registrar el pedido." />
    {:else}
      {#each order.lines as line (line.product.id)}
        <article class="cart-line">
          <div class="line-top">
            <div class="line-identity">
              <h3>{line.product.name}</h3>
              <span class="line-unit">
                {formatCurrency(line.product.price)} × {line.quantity}
              </span>
            </div>
            <div class="line-right">
              <span class="line-total">
                {formatCurrency(line.product.price * line.quantity)}
              </span>
              <button
                type="button"
                class="line-remove"
                onclick={() => onRemove(line.product.id)}
                aria-label="Quitar {line.product.name} del pedido"
              >
                <span class="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>

          <div class="line-bottom">
            <QuantityStepper
              value={line.quantity}
              min={0}
              max={20}
              size="sm"
              editable
              label="cantidad de {line.product.name}"
              onChange={(next) => onSetQuantity(line.product.id, next)} />

            <!-- EVENTO INPUT: nota para cocina -->
            <input
              class="line-note"
              type="text"
              maxlength="40"
              placeholder="Nota (ej. sin azúcar)"
              aria-label="Nota para {line.product.name}"
              value={line.note}
              oninput={(event) =>
                onSetNote(line.product.id, (event.currentTarget as HTMLInputElement).value)} />
          </div>
        </article>
      {/each}
    {/if}
  </div>

  <footer class="cart-footer">
    {#if !order.isEmpty && order.discount === 0}
      <p class="promo-hint">
        <span class="material-symbols-outlined">redeem</span>
        Añade {formatCurrency(amountToDiscount)} más y obtén un 10 % de descuento
      </p>
    {/if}

    <div class="totals">
      <div class="total-line">
        <span>Subtotal ({order.itemCount} {order.itemCount === 1 ? 'artículo' : 'artículos'})</span>
        <span>{formatCurrency(order.subtotal)}</span>
      </div>

      {#if order.discount > 0}
        <div class="total-line discount">
          <span>Descuento por volumen (10 %)</span>
          <span>−{formatCurrency(order.discount)}</span>
        </div>
      {/if}

      <div class="total-line">
        <span>Impuesto (8 %)</span>
        <span>{formatCurrency(order.tax)}</span>
      </div>

      <div class="divider"></div>

      <div class="total-line grand">
        <span>Total</span>
        <span class="grand-amount">{formatCurrency(order.total)}</span>
      </div>
    </div>

    <div class="footer-actions">
      <Button variant="ghost" size="sm" disabled={order.isEmpty} onclick={onClear}>Vaciar</Button>
      <Button variant="primary" fullWidth disabled={order.isEmpty} onclick={onCheckout}>
        Procesar pedido
        <span class="material-symbols-outlined" style="font-size: 18px;">arrow_forward</span>
      </Button>
    </div>
  </footer>
</section>

<style>
  .cart-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-color);
    border-left: 1px solid var(--border-color);
  }

  /* Cabecera */
  .cart-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-bright);
  }

  .cart-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .cart-title-row h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .mode-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    padding: 4px;
    border-radius: var(--radius-full);
    background: var(--surface-high);
  }

  .mode-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 7px 10px;
    border: none;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .mode-btn:hover {
    color: var(--text-main);
  }

  .mode-btn.active {
    background: var(--surface-color);
    color: var(--primary-color);
    box-shadow: var(--shadow-sm);
  }

  .mode-btn :global(.material-symbols-outlined) {
    font-size: 17px;
  }

  /* Líneas */
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .cart-line {
    padding: 12px;
    border-radius: var(--radius-sm);
    background: var(--surface-low);
    border: 1px solid var(--border-color);
  }

  .line-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }

  .line-identity h3 {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .line-unit {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .line-right {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  .line-total {
    font-size: 0.9rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .line-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
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

  .line-bottom {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: 10px;
  }

  .line-note {
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border-color);
    background: var(--surface-color);
    color: var(--text-main);
    font-family: inherit;
    font-size: 0.75rem;
    outline: none;
    transition: border-color var(--transition-fast);
  }

  .line-note:focus {
    border-color: var(--primary-color);
  }

  /* Pie */
  .cart-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    background: var(--surface-bright);
  }

  .promo-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    margin-bottom: var(--spacing-md);
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--warning-color) 12%, transparent);
    color: var(--text-main);
    font-size: 0.75rem;
    font-weight: 500;
  }

  .promo-hint :global(.material-symbols-outlined) {
    font-size: 16px;
    color: var(--warning-color);
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
    font-size: 0.82rem;
    color: var(--text-muted);
  }

  .total-line.discount {
    color: var(--success-color);
    font-weight: 600;
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
    font-size: 1.4rem;
    color: var(--primary-color);
    font-variant-numeric: tabular-nums;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
</style>
