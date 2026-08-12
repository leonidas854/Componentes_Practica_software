<script lang="ts">
  import type { Product } from './ProductCard.svelte';

  export interface CartItem {
    product: Product;
    quantity: number;
  }

  let { 
    items,
    total,
    onClearCart,
    onCheckout,
    onAdd,
    onRemove,
    orderNumber = 1042
  } = $props<{
    items: CartItem[];
    total: number;
    onClearCart: () => void;
    onCheckout: () => void;
    onAdd?: (id: string) => void;
    onRemove?: (id: string) => void;
    orderNumber?: number;
  }>();

  const TAX_RATE = 0.08;
  let subtotal = $derived(total);
  let tax = $derived(subtotal * TAX_RATE);
  let grandTotal = $derived(subtotal + tax);
</script>

<div class="cart-panel">
  <!-- Header -->
  <div class="cart-header">
    <div>
      <h2>Pedido Actual</h2>
      <div class="order-meta">
        <p class="order-number">Pedido #{orderNumber}</p>
        <span class="dine-badge">En Local</span>
      </div>
    </div>
  </div>

  <!-- Item List -->
  <div class="cart-items scrollbar-hide">
    {#if items.length === 0}
      <div class="empty-cart">
        <span class="material-symbols-outlined empty-icon">shopping_cart</span>
        <p>No has agregado ningún producto todavía.</p>
      </div>
    {:else}
      {#each items as item}
        <div class="cart-item">
          <div class="item-top">
            <div class="item-info">
              <h4>{item.product.name}</h4>
              <p class="item-note">Preparación estándar</p>
            </div>
            <span class="item-total">${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
          <div class="item-bottom">
            <button 
              class="remove-btn"
              onclick={() => {
                if (onRemove) {
                  for (let i = 0; i < item.quantity; i++) {
                    onRemove(item.product.id);
                  }
                }
              }}
            >
              <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
              Quitar
            </button>
            <div class="item-qty-controls">
              <button 
                class="item-qty-btn"
                onclick={() => onRemove?.(item.product.id)}
                aria-label="Reducir"
              >
                <span class="material-symbols-outlined" style="font-size: 16px;">remove</span>
              </button>
              <span class="item-qty">{item.quantity}</span>
              <button 
                class="item-qty-btn"
                onclick={() => onAdd?.(item.product.id)}
                aria-label="Agregar"
              >
                <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
              </button>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Totals & Checkout -->
  <div class="cart-footer">
    <div class="totals">
      <div class="total-line">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div class="total-line">
        <span>Impuesto (8%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div class="divider"></div>
      <div class="total-line grand">
        <span>Total</span>
        <span class="grand-amount">${grandTotal.toFixed(2)}</span>
      </div>
    </div>

    <!-- Payment Method Buttons -->
    <div class="payment-methods">
      <button class="payment-btn">
        <span class="material-symbols-outlined" style="font-size: 20px;">credit_card</span>
        Tarjeta
      </button>
      <button class="payment-btn">
        <span class="material-symbols-outlined" style="font-size: 20px;">payments</span>
        Efectivo
      </button>
    </div>

    <button 
      class="finalize-btn"
      disabled={items.length === 0}
      onclick={onCheckout}
    >
      Procesar Pedido
      <span class="material-symbols-outlined" style="font-size: 20px;">arrow_forward</span>
    </button>
  </div>
</div>

<style>
  .cart-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-color);
    border-left: 1px solid var(--border-color);
    box-shadow: -4px 0 15px -3px rgba(0, 0, 0, 0.05);
  }

  /* Header */
  .cart-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-bright);
  }

  .cart-header h2 {
    font-size: 1.5rem;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .order-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-number {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .dine-badge {
    background: rgba(0, 53, 15, 0.1);
    color: var(--success-color);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 600;
  }

  /* Item List */
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-2xl) 0;
    color: var(--text-muted);
    font-style: italic;
  }

  .empty-icon {
    font-size: 48px !important;
    opacity: 0.3;
  }

  .cart-item {
    padding: 12px;
    background: var(--bg-color);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-color);
  }

  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .item-info h4 {
    font-size: 0.875rem;
    font-weight: 500;
    margin: 0;
  }

  .item-note {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin: 2px 0 0 0;
  }

  .item-total {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-sm);
  }

  .remove-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    background: none;
    border: none;
    color: var(--danger-color);
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    font-family: inherit;
    padding: 4px 0;
    border-radius: var(--radius-full);
    transition: opacity var(--transition-fast);
  }

  .remove-btn:hover {
    opacity: 0.8;
  }

  .item-qty-controls {
    display: flex;
    align-items: center;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    overflow: hidden;
    height: 32px;
    box-shadow: var(--shadow-sm);
  }

  .item-qty-btn {
    width: 32px;
    height: 100%;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--transition-fast);
  }

  .item-qty-btn:hover {
    background: var(--surface-hover);
  }

  .item-qty {
    width: 32px;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
  }

  /* Footer */
  .cart-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    background: var(--surface-bright);
  }

  .totals {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: var(--spacing-lg);
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .divider {
    height: 1px;
    background: var(--border-color);
    margin: 4px 0;
  }

  .total-line.grand {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-main);
  }

  .grand-amount {
    color: var(--primary-container);
  }

  /* Payment Methods */
  .payment-methods {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: var(--spacing-md);
  }

  .payment-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: 12px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    background: var(--surface-color);
    color: var(--text-main);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
    box-shadow: var(--shadow-sm);
  }

  .payment-btn:hover {
    background: var(--surface-hover);
  }

  /* Finalize Button */
  .finalize-btn {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-full);
    border: none;
    background: var(--primary-color);
    color: var(--text-on-primary);
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    box-shadow: var(--shadow-sm);
    font-family: inherit;
  }

  .finalize-btn:hover:not(:disabled) {
    opacity: 0.9;
  }

  .finalize-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
