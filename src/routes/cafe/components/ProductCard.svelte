<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import QuantityStepper from '$lib/components/QuantityStepper.svelte';
  import { formatCurrency } from '$lib/utils/format';
  import type { Product } from '../models/types';

  /**
   * Componente visual: Tarjeta de producto.
   * PROPIEDADES: product, quantity.
   * EVENTOS: click (añadir), change (cantidad escrita a mano en el selector).
   */
  interface ProductCardProps {
    product: Product;
    quantity: number;
    onAdd: (product: Product) => void;
    onSetQuantity: (productId: string, quantity: number) => void;
  }

  let { product, quantity, onAdd, onSetQuantity }: ProductCardProps = $props();

  let isAvailable = $derived(product.available !== false);
</script>

<article class="product-card" class:selected={quantity > 0} class:unavailable={!isAvailable}>
  {#if product.image}
    <div class="image-wrap">
      <img class="product-image" src={product.image} alt={product.name} loading="lazy" />
      {#if product.popular && isAvailable}
        <span class="image-badge"><Badge tone="warning" icon="local_fire_department">Popular</Badge></span>
      {/if}
      {#if !isAvailable}
        <div class="sold-out-veil"><span>Agotado</span></div>
      {/if}
      {#if quantity > 0}
        <span class="qty-bubble" aria-hidden="true">{quantity}</span>
      {/if}
    </div>
  {/if}

  <div class="product-body">
    <h3 class="product-name">{product.name}</h3>
    <p class="product-description">{product.description}</p>

    <div class="product-footer">
      <span class="product-price">{formatCurrency(product.price)}</span>

      {#if !isAvailable}
        <span class="unavailable-note">No disponible</span>
      {:else if quantity > 0}
        <QuantityStepper
          value={quantity}
          min={0}
          max={20}
          size="sm"
          editable
          label="cantidad de {product.name}"
          onChange={(next) => onSetQuantity(product.id, next)} />
      {:else}
        <button
          type="button"
          class="add-btn"
          onclick={() => onAdd(product)}
          aria-label="Añadir {product.name} al pedido"
        >
          <span class="material-symbols-outlined">add</span>
        </button>
      {/if}
    </div>
  </div>
</article>

<style>
  .product-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-normal);
  }

  .product-card:hover:not(.unavailable) {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .product-card.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-glow);
  }

  .product-card.unavailable {
    opacity: 0.65;
  }

  /* Imagen */
  .image-wrap {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: var(--spacing-md);
    background: var(--surface-high);
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-badge {
    position: absolute;
    top: 8px;
    left: 8px;
  }

  .qty-bubble {
    position: absolute;
    top: 8px;
    right: 8px;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    border-radius: var(--radius-full);
    background: var(--primary-color);
    color: var(--text-on-primary);
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-sm);
  }

  .sold-out-veil {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* Cuerpo */
  .product-body {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .product-name {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .product-description {
    color: var(--text-muted);
    font-size: 0.82rem;
    line-height: 1.45;
    margin-top: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-top: auto;
    padding-top: var(--spacing-md);
  }

  .product-price {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--primary-color);
    font-variant-numeric: tabular-nums;
  }

  .unavailable-note {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--text-on-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }

  .add-btn:hover {
    background: var(--primary-hover);
    transform: scale(1.1);
  }

  .add-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .add-btn :global(.material-symbols-outlined) {
    font-size: 20px;
  }
</style>
