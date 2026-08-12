<script lang="ts">
  import ProductCard from './ProductCard.svelte';
  import type { Product } from './ProductCard.svelte';
  import CartSummary from './CartSummary.svelte';
  import type { CartItem } from './CartSummary.svelte';

  // Categories
  interface Category {
    id: string;
    name: string;
    icon: string;
  }

  const CATEGORIES: Category[] = [
    { id: 'coffee', name: 'Café', icon: 'coffee' },
    { id: 'tea', name: 'Té', icon: 'emoji_food_beverage' },
    { id: 'pastry', name: 'Pasteles', icon: 'bakery_dining' },
    { id: 'sandwich', name: 'Sándwiches', icon: 'lunch_dining' },
    { id: 'cold', name: 'Bebidas Frías', icon: 'local_drink' },
  ];

  const MENU: Product[] = [
    { 
      id: 'c1', name: 'Espresso', description: 'Shot intenso y aromático.', price: 3.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxS7jguWm0paCAWtu-WRpUH1y2i6aPhR5M4JAgwqp1Vns_TChhyzbzQUDZ4hV7wnYU9-7fA1QT_IzEwJOe7Jt3mcNA1vxcv0PvcusJARGqdloppmi-3awrgaigvewnovDX1W0FN9m5K4Vt0JKCYDaT8dhWs9EQMU-xBXUlR_H9uWFOBAhv3XosRn0pPlYdEkWWqtg29WNHWzf1CWKbH7mPYWoY1ZjfKnMj2zHRefTfY_BPpRDv397VuA',
      popular: true
    },
    { 
      id: 'c2', name: 'Café Latte', description: 'Espresso suave con leche vaporizada.', price: 4.75,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCiHh9jA4Cd-lFRpdYqHZw35Iq0UISYsVDMZWWdkXxWgQ4FxKbrEdfVVdylAGc3LImrk_f_TN1uHoVBPNnYge6Rq8GruDterIqPzJT7ZtyGVmXmZe9UJ3ocbppkpar5TDlG6cDyEWVKTWEY-5wGu5JNSEtWVss_fc_Wcrf-Z6W_9BIGzc21d_jmeebx4hqsiSYeF-zEDt2l9AlsZ2LlmyUTocnVQbt8IJ4ES8m5bJ18AqHCv9XCreGwA'
    },
    { 
      id: 'c3', name: 'Cappuccino', description: 'Partes iguales de espresso, leche y espuma.', price: 4.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XduItZXm51gjpspUPpInas4to6t0KbvC5eOGqw-9tcbQosf5e0vHcBr14_i0F_Aqsu_D8bwEQiGhfA2dHZAmf9i43hVX1B7_bED2hsT2CH1X4SHQjoTeKWuCYiMr7ZyeoDcqJ2Ncyj_kzQDJzoY-M2bmz1eLfTh5GQouOzODg_3RleJM0rBObWZ4EYHHg_5xQ7_X6i-LTHqhBntfmHK2IwhP8cQG4kgNjchevDgvDwbk4DM6lipcqw'
    },
    { 
      id: 'c4', name: 'Americano', description: 'Espresso diluido con agua caliente.', price: 3.75,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI6RKg2FmDiYCTD_Ax4nOekjOLpgfbGTFG0BGAodT7MPgJGgpq8MzlVGgn_0oAO3VZhme6ciydq0nqjVxgZlRqFi2qXUjv7su9ggx-H7iC_U90iNK73U5dIDxTRc3bs_qnpKRLAsXOE_sia4c_5LqWQHs9dxtf28ZjA0V04ZrDSYYzapa6z5YEM59BubtbEd1JFRRgkZJ2BFKm-JJ8INdSHZAzFQ8HRdy8EJrR1mQty-uLqVgf2S1xUA'
    },
    { 
      id: 'c5', name: 'Mocha Blanco', description: 'Chocolate blanco, espresso y crema batida.', price: 5.25,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxS7jguWm0paCAWtu-WRpUH1y2i6aPhR5M4JAgwqp1Vns_TChhyzbzQUDZ4hV7wnYU9-7fA1QT_IzEwJOe7Jt3mcNA1vxcv0PvcusJARGqdloppmi-3awrgaigvewnovDX1W0FN9m5K4Vt0JKCYDaT8dhWs9EQMU-xBXUlR_H9uWFOBAhv3XosRn0pPlYdEkWWqtg29WNHWzf1CWKbH7mPYWoY1ZjfKnMj2zHRefTfY_BPpRDv397VuA',
      popular: true
    },
    { 
      id: 's1', name: 'Croissant Mantequilla', description: 'Pan hojaldrado clásico recién horneado.', price: 3.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XduItZXm51gjpspUPpInas4to6t0KbvC5eOGqw-9tcbQosf5e0vHcBr14_i0F_Aqsu_D8bwEQiGhfA2dHZAmf9i43hVX1B7_bED2hsT2CH1X4SHQjoTeKWuCYiMr7ZyeoDcqJ2Ncyj_kzQDJzoY-M2bmz1eLfTh5GQouOzODg_3RleJM0rBObWZ4EYHHg_5xQ7_X6i-LTHqhBntfmHK2IwhP8cQG4kgNjchevDgvDwbk4DM6lipcqw'
    },
    { 
      id: 's2', name: 'Muffin de Arándanos', description: 'Esponjoso muffin con arándanos frescos.', price: 2.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCiHh9jA4Cd-lFRpdYqHZw35Iq0UISYsVDMZWWdkXxWgQ4FxKbrEdfVVdylAGc3LImrk_f_TN1uHoVBPNnYge6Rq8GruDterIqPzJT7ZtyGVmXmZe9UJ3ocbppkpar5TDlG6cDyEWVKTWEY-5wGu5JNSEtWVss_fc_Wcrf-Z6W_9BIGzc21d_jmeebx4hqsiSYeF-zEDt2l9AlsZ2LlmyUTocnVQbt8IJ4ES8m5bJ18AqHCv9XCreGwA'
    },
    { 
      id: 's3', name: 'Sándwich Pavo', description: 'Pan integral, pavo ahumado, queso y vegetales.', price: 5.50,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI6RKg2FmDiYCTD_Ax4nOekjOLpgfbGTFG0BGAodT7MPgJGgpq8MzlVGgn_0oAO3VZhme6ciydq0nqjVxgZlRqFi2qXUjv7su9ggx-H7iC_U90iNK73U5dIDxTRc3bs_qnpKRLAsXOE_sia4c_5LqWQHs9dxtf28ZjA0V04ZrDSYYzapa6z5YEM59BubtbEd1JFRRgkZJ2BFKm-JJ8INdSHZAzFQ8HRdy8EJrR1mQty-uLqVgf2S1xUA'
    }
  ];

  // State
  let selectedCategory = $state('coffee');
  let cart = $state<Record<string, number>>({});

  // Derived values
  let cartItems = $derived(
    Object.entries(cart)
      .map(([id, quantity]) => {
        const product = MENU.find(p => p.id === id);
        return product ? { product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null && item.quantity > 0)
  );

  let cartTotal = $derived(
    cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  // Handlers
  function handleAdd(id: string) {
    cart[id] = (cart[id] || 0) + 1;
  }

  function handleRemove(id: string) {
    if (cart[id] > 0) {
      cart[id] -= 1;
      if (cart[id] === 0) {
        delete cart[id];
      }
    }
  }

  function handleClearCart() {
    cart = {};
  }

  function handleCheckout() {
    if (cartItems.length === 0) return;
    const tax = cartTotal * 0.08;
    const grandTotal = cartTotal + tax;
    alert(`¡Pedido registrado exitosamente!\nSubtotal: $${cartTotal.toFixed(2)}\nImpuesto: $${tax.toFixed(2)}\nTotal cobrado: $${grandTotal.toFixed(2)}`);
    handleClearCart();
  }
</script>

<!-- TopNavBar -->
<header class="top-nav">
  <div class="nav-inner">
    <div class="nav-left">
      <span class="material-symbols-outlined brand-icon" style="font-size: 28px; font-variation-settings: 'FILL' 1;">local_cafe</span>
      <a href="/" class="brand">Capresso</a>
      <nav class="nav-links">
        <a href="/cafe" class="nav-link active">Menú</a>
        <a href="/cafe" class="nav-link">Pedidos</a>
        <a href="/cafe" class="nav-link">Inventario</a>
      </nav>
    </div>
    <div class="nav-right">
      <button class="nav-icon-btn" aria-label="Buscar">
        <span class="material-symbols-outlined">search</span>
      </button>
      <button class="nav-icon-btn" aria-label="Configuración">
        <span class="material-symbols-outlined">settings</span>
      </button>
      <div class="avatar">JD</div>
    </div>
  </div>
</header>

<main class="cafe-layout">
  <!-- Left Sidebar: Categories -->
  <aside class="category-sidebar scrollbar-hide">
    <h2 class="sidebar-title">Categorías</h2>
    <nav class="category-list">
      {#each CATEGORIES as cat}
        <button 
          class="category-btn"
          class:active={selectedCategory === cat.id}
          onclick={() => selectedCategory = cat.id}
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">{cat.icon}</span>
          <span>{cat.name}</span>
        </button>
      {/each}
    </nav>
  </aside>

  <!-- Center: Product Grid -->
  <section class="products-area scrollbar-hide">
    <div class="products-header">
      <h1>Menú de Café</h1>
      <div class="filter-chips">
        <button class="filter-chip active">Caliente</button>
        <button class="filter-chip">Helado</button>
      </div>
    </div>

    <div class="products-grid">
      {#each MENU as product}
        <ProductCard 
          {product} 
          quantity={cart[product.id] || 0}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      {/each}
    </div>
  </section>

  <!-- Right Panel: Cart -->
  <aside class="cart-panel-wrap">
    <CartSummary 
      items={cartItems}
      total={cartTotal}
      onClearCart={handleClearCart}
      onCheckout={handleCheckout}
      onAdd={handleAdd}
      onRemove={handleRemove}
    />
  </aside>
</main>

<style>
  /* ===== Top Navigation ===== */
  .top-nav {
    background: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: var(--shadow-sm);
  }

  .nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-lg);
    height: 64px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .brand-icon {
    color: var(--primary-container);
  }

  .brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color) !important;
    margin-right: var(--spacing-xl);
  }

  .nav-links {
    display: none;
    gap: var(--spacing-xl);
    height: 64px;
  }

  @media (min-width: 768px) {
    .nav-links {
      display: flex;
    }
  }

  .nav-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    padding: 0 var(--spacing-sm);
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted) !important;
    letter-spacing: 0.02em;
    border-bottom: 2px solid transparent;
    padding-bottom: 2px;
    transition: color var(--transition-fast);
  }

  .nav-link:hover {
    color: var(--primary-color) !important;
  }

  .nav-link.active {
    color: var(--primary-color) !important;
    border-bottom-color: var(--primary-color);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .nav-icon-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    transition: color var(--transition-fast);
    display: flex;
    align-items: center;
  }

  .nav-icon-btn:hover {
    color: var(--primary-color);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary-color);
    color: var(--text-on-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.75rem;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }

  /* ===== Main Layout ===== */
  .cafe-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  /* ===== Category Sidebar ===== */
  .category-sidebar {
    width: 256px;
    flex-shrink: 0;
    background: var(--surface-low);
    border-right: 1px solid var(--border-color);
    padding: var(--spacing-md);
    overflow-y: auto;
    height: calc(100vh - 64px);
    display: none;
  }

  @media (min-width: 1024px) {
    .category-sidebar {
      display: flex;
      flex-direction: column;
    }
  }

  .sidebar-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-lg);
    padding: 0 var(--spacing-md);
  }

  .category-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .category-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    text-align: left;
    padding: 12px var(--spacing-md);
    border: none;
    border-radius: var(--radius-full);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .category-btn:hover {
    background: var(--surface-hover);
  }

  .category-btn.active {
    background: var(--secondary-container);
    color: var(--text-muted);
    font-weight: 700;
  }

  /* ===== Products Area ===== */
  .products-area {
    flex: 1;
    padding: var(--spacing-lg);
    overflow-y: auto;
    height: calc(100vh - 64px);
  }

  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  .products-header h1 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .filter-chips {
    display: flex;
    gap: var(--spacing-sm);
  }

  .filter-chip {
    padding: 8px 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .filter-chip:hover {
    background: var(--surface-hover);
  }

  .filter-chip.active {
    background: var(--primary-color);
    color: var(--text-on-primary);
    border-color: var(--primary-color);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }

  @media (min-width: 768px) {
    .products-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .products-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* ===== Cart Panel ===== */
  .cart-panel-wrap {
    width: 360px;
    flex-shrink: 0;
    height: calc(100vh - 64px);
    z-index: 10;
    display: none;
  }

  @media (min-width: 1024px) {
    .cart-panel-wrap {
      display: block;
    }
  }

  /* ===== Responsive ===== */
  @media (max-width: 1024px) {
    .cafe-layout {
      flex-direction: column;
      overflow: auto;
    }

    .products-area {
      height: auto;
    }
  }
</style>
