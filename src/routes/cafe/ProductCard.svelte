<script lang="ts">
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    popular?: boolean;
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

<div class="product-card" class:has-quantity={quantity > 0}>
  <!-- Image -->
  {#if product.image}
    <div class="product-image-wrap">
      <img class="product-image" src={product.image} alt={product.name} />
      {#if product.popular}
        <span class="badge-popular">Pop</span>
      {/if}
    </div>
  {/if}

  <!-- Info -->
  <div class="product-body">
    <div class="product-text">
      <h3 class="product-name">{product.name}</h3>
      <p class="product-desc">{product.description}</p>
    </div>
    
    <div class="product-footer">
      <span class="product-price">${product.price.toFixed(2)}</span>
      
      {#if quantity > 0}
        <!-- Quantity Controls -->
        <div class="qty-controls">
          <button 
            class="qty-btn"
            onclick={() => onRemove(product.id)}
            aria-label="Quitar uno"
          >
            <span class="material-symbols-outlined" style="font-size: 18px;">remove</span>
          </button>
          <span class="qty-count">{quantity}</span>
          <button 
            class="qty-btn"
            onclick={() => onAdd(product.id)}
            aria-label="Agregar uno"
          >
            <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
          </button>
        </div>
      {:else}
        <!-- Add Button -->
        <button 
          class="add-btn"
          onclick={() => onAdd(product.id)}
          aria-label="Agregar al pedido"
        >
          <span class="material-symbols-outlined" style="font-size: 20px;">add</span>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .product-card {
    background: var(--surface-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    height: 100%;
    border: 1px solid transparent;
    transition: all var(--transition-normal);
    cursor: pointer;
  }

  .product-card:hover {
    box-shadow: var(--shadow-md);
    border-color: rgba(39, 19, 16, 0.2);
  }

  .product-card.has-quantity {
    border-color: rgba(39, 19, 16, 0.4);
    box-shadow: 0 0 0 2px rgba(39, 19, 16, 0.1);
  }

  /* Image */
  .product-image-wrap {
    position: relative;
    aspect-ratio: 1;
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

  .badge-popular {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--secondary-container);
    color: var(--text-muted);
    padding: 4px 10px;
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 600;
  }

  /* Body */
  .product-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .product-name {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 4px 0;
    line-height: 1.3;
  }

  .product-desc {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Footer */
  .product-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--spacing-md);
  }

  .product-price {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--primary-container);
  }

  /* Add Button */
  .add-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: var(--primary-color);
    color: var(--text-on-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }

  .add-btn:hover {
    background: var(--primary-hover);
    transform: scale(1.1);
  }

  /* Quantity Controls */
  .qty-controls {
    display: flex;
    align-items: center;
    background: var(--surface-high);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .qty-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: var(--primary-container);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background var(--transition-fast);
  }

  .qty-btn:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .qty-count {
    width: 24px;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>
