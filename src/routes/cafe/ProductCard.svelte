<script lang="ts">
  import { Plus, Minus } from 'lucide-svelte';
  
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  }

  let { 
    product,
    quantity = 0,
    onAdd,
    onRemove
  } = $props<{
    product: Product;
    quantity: number;
    onAdd: (id: string) => void;
    onRemove: (id: string) => void;
  }>();
</script>

<div class="product-card glass-panel">
  <div class="product-info">
    <div class="product-header">
      <h3 class="product-name">{product.name}</h3>
      <span class="product-price text-gradient">${product.price.toFixed(2)}</span>
    </div>
    <p class="product-desc">{product.description}</p>
  </div>
  
  <div class="product-controls">
    {#if quantity > 0}
      <button 
        class="control-btn decrease" 
        onclick={() => onRemove(product.id)}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <span class="quantity">{quantity}</span>
    {/if}
    <button 
      class="control-btn increase" 
      onclick={() => onAdd(product.id)}
      aria-label="Increase quantity"
    >
      <Plus size={16} />
      {#if quantity === 0}
        <span>Agregar</span>
      {/if}
    </button>
  </div>
</div>

<style>
  .product-card {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    justify-content: space-between;
    transition: transform var(--transition-normal);
  }

  .product-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xs);
  }

  .product-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
  }

  .product-price {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .product-desc {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
  }

  .product-controls {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    margin-top: auto;
  }

  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: 500;
    font-size: 0.9rem;
  }

  .control-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .control-btn.increase {
    background: var(--primary-color);
    border-color: var(--primary-hover);
    color: white;
  }

  .control-btn.increase:hover {
    background: var(--primary-hover);
  }

  .quantity {
    font-weight: bold;
    min-width: 24px;
    text-align: center;
  }
</style>
