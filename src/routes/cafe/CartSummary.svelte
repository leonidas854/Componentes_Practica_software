<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import type { Product } from './ProductCard.svelte';
  import { ShoppingCart, Trash2 } from 'lucide-svelte';

  export interface CartItem {
    product: Product;
    quantity: number;
  }

  let { 
    items,
    total,
    onClearCart,
    onCheckout
  } = $props<{
    items: CartItem[];
    total: number;
    onClearCart: () => void;
    onCheckout: () => void;
  }>();

</script>

<div class="cart-summary glass-panel">
  <div class="cart-header">
    <div class="cart-title">
      <ShoppingCart size={20} color="var(--primary-color)" />
      <h2>Tu Pedido</h2>
    </div>
    {#if items.length > 0}
      <button class="clear-btn" onclick={onClearCart} aria-label="Clear cart" title="Vaciar pedido">
        <Trash2 size={16} />
      </button>
    {/if}
  </div>

  <div class="cart-items">
    {#if items.length === 0}
      <div class="empty-cart">
        <p>No has agregado ningún producto todavía.</p>
      </div>
    {:else}
      {#each items as item}
        <div class="cart-item">
          <div class="item-details">
            <span class="item-name">{item.product.name}</span>
            <span class="item-quantity">x{item.quantity}</span>
          </div>
          <span class="item-price">${(item.product.price * item.quantity).toFixed(2)}</span>
        </div>
      {/each}
    {/if}
  </div>

  <div class="cart-footer">
    <div class="total-row">
      <span>Total:</span>
      <span class="total-amount text-gradient">${total.toFixed(2)}</span>
    </div>
    
    <Button 
      variant="primary" 
      disabled={items.length === 0}
      onclick={onCheckout}
      style="width: 100%;"
    >
      Procesar Pedido
    </Button>
  </div>
</div>

<style>
  .cart-summary {
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: calc(100vh - 150px);
  }

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .cart-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .cart-title h2 {
    font-size: 1.25rem;
    margin: 0;
  }

  .clear-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
  }

  .clear-btn:hover {
    color: var(--danger-color);
    background: rgba(239, 68, 68, 0.1);
  }

  .cart-items {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
    padding-right: var(--spacing-xs);
  }

  /* Custom Scrollbar for webkit */
  .cart-items::-webkit-scrollbar {
    width: 6px;
  }
  .cart-items::-webkit-scrollbar-track {
    background: transparent;
  }
  .cart-items::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 10px;
  }

  .empty-cart {
    color: var(--text-muted);
    font-style: italic;
    text-align: center;
    padding: var(--spacing-xl) 0;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm);
    background: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius-sm);
  }

  .item-details {
    display: flex;
    flex-direction: column;
  }

  .item-name {
    font-weight: 500;
  }

  .item-quantity {
    font-size: 0.85rem;
    color: var(--primary-color);
  }

  .item-price {
    font-weight: 600;
  }

  .cart-footer {
    border-top: 1px dashed var(--border-color);
    padding-top: var(--spacing-md);
    margin-top: auto;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: var(--spacing-lg);
  }

  .total-amount {
    font-size: 1.8rem;
  }
</style>
