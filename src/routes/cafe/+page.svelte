<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import ProductCard from './ProductCard.svelte';
  import type { Product } from './ProductCard.svelte';
  import CartSummary from './CartSummary.svelte';
  import type { CartItem } from './CartSummary.svelte';

  const MENU: Product[] = [
    { id: 'c1', name: 'Café Americano', description: 'Café negro clásico, intenso y aromático.', price: 2.50 },
    { id: 'c2', name: 'Latte Vainilla', description: 'Espresso con leche cremosa y toque de vainilla.', price: 3.75 },
    { id: 'c3', name: 'Cappuccino', description: 'Mitad leche, mitad espuma con un shot de espresso.', price: 3.50 },
    { id: 'c4', name: 'Mocha Blanco', description: 'Chocolate blanco, espresso y crema batida.', price: 4.25 },
    { id: 's1', name: 'Croissant Mantequilla', description: 'Pan hojaldrado clásico recién horneado.', price: 2.00 },
    { id: 's2', name: 'Muffin de Arándanos', description: 'Esponjoso muffin con arándanos frescos.', price: 2.50 },
    { id: 's3', name: 'Sándwich Pavo', description: 'Pan integral, pavo ahumado, queso y vegetales.', price: 5.50 }
  ];

  // State
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
    
    alert(`Pedido registrado exitosamente.\nTotal cobrado: $${cartTotal.toFixed(2)}`);
    handleClearCart();
  }
</script>

<Header title="Capresso - Cafetería" backUrl="/" />

<main class="cafe-container">
  <div class="content-grid">
    <section class="menu-section">
      <h2 class="section-title">Menú</h2>
      
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

    <aside class="cart-section">
      <div class="sticky-cart">
        <CartSummary 
          items={cartItems}
          total={cartTotal}
          onClearCart={handleClearCart}
          onCheckout={handleCheckout}
        />
      </div>
    </aside>
  </div>
</main>

<style>
  .cafe-container {
    padding: var(--spacing-xl);
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
  }

  .section-title {
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
  }

  .sticky-cart {
    position: sticky;
    top: 100px; /* Account for header */
    height: calc(100vh - 140px);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 960px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .sticky-cart {
      position: static;
      height: auto;
    }
  }
</style>
