<script lang="ts">
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import TopNav from '$lib/components/TopNav.svelte';
  import { toast } from '$lib/stores/toast.svelte';
  import { formatCurrency } from '$lib/utils/format';

  import CartSummary from './components/CartSummary.svelte';
  import CategoryNav from './components/CategoryNav.svelte';
  import ProductCard from './components/ProductCard.svelte';
  import ReceiptDialog from './components/ReceiptDialog.svelte';

  import { CATEGORIES, MENU, countByCategory, filterMenu } from './data/menu';
  import { Order, type Receipt } from './models/Order.svelte';
  import type { Product, ServiceMode } from './models/types';

  /**
   * PRÁCTICA 2 — Registro de pedidos de una cafetería.
   *
   * El problema original era el cálculo manual del importe y la falta de un
   * resumen del pedido. Aquí la clase Order calcula todos los importes y el
   * comprobante final detalla qué productos se solicitaron.
   */

  // ----- Estado -----
  let order = $state<Order>(new Order());
  let selectedCategory = $state<string | null>(null);
  let searchTerm = $state('');
  /** Criterio de ordenación de la carta: 'name' | 'price-asc' | 'price-desc'. */
  let sortMode = $state('name');

  let showReceipt = $state(false);
  let lastReceipt = $state<Receipt | null>(null);

  // ----- Datos derivados -----
  const categoryCounts = countByCategory(MENU);

  let visibleProducts = $derived.by(() => {
    const filtered = filterMenu(MENU, selectedCategory, searchTerm);

    return [...filtered].sort((a, b) => {
      if (sortMode === 'price-asc') return a.price - b.price;
      if (sortMode === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name, 'es');
    });
  });

  let currentCategoryName = $derived(
    selectedCategory === null
      ? 'Toda la carta'
      : (CATEGORIES.find((category) => category.id === selectedCategory)?.name ?? 'Carta')
  );

  const SORT_OPTIONS = [
    { value: 'name', label: 'Nombre (A-Z)' },
    { value: 'price-asc', label: 'Precio: menor a mayor' },
    { value: 'price-desc', label: 'Precio: mayor a menor' }
  ];

  // ----- Manejadores de eventos -----

  /** EVENTO CLICK (tarjeta de producto): añade una unidad al pedido. */
  function addProduct(product: Product) {
    const result = order.add(product);
    if (!result.ok) {
      toast.error('No se pudo añadir', result.reason ?? '');
      return;
    }
    toast.show(`${product.name} añadido`, `Total del pedido: ${formatCurrency(order.total)}`, 'info', 1800);
  }

  /** EVENTO CHANGE (selector de cantidad): fija la cantidad exacta. */
  function setQuantity(productId: string, quantity: number) {
    const result = order.setQuantity(productId, quantity);
    if (!result.ok && quantity > 0) {
      toast.error('Cantidad no válida', result.reason ?? '');
    }
  }

  /** EVENTO INPUT (nota de la línea). */
  function setNote(productId: string, note: string) {
    order.setNote(productId, note);
  }

  function removeProduct(productId: string) {
    const name = order.findLine(productId)?.product.name;
    order.remove(productId);
    if (name) toast.show(`${name} quitado del pedido`);
  }

  function changeServiceMode(mode: ServiceMode) {
    order.serviceMode = mode;
  }

  function clearOrder() {
    if (order.isEmpty) return;
    order.clear();
    toast.show('Pedido vaciado', 'Puedes comenzar de nuevo.');
  }

  /** EVENTO CLICK (procesar): genera el comprobante con el resumen del pedido. */
  function checkout() {
    if (order.isEmpty) return;
    lastReceipt = order.toReceipt();
    showReceipt = true;
  }

  /** Cierra el comprobante y abre un pedido nuevo con numeración correlativa. */
  function startNewOrder() {
    showReceipt = false;
    order = new Order();
    toast.success('Pedido cobrado', `Comprobante #${lastReceipt?.number} emitido.`);
  }

  /** EVENTO KEYDOWN: la tecla Escape limpia el buscador. */
  function handleSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      searchTerm = '';
    }
  }
</script>

<TopNav
  brand="Capresso"
  brandIcon="local_cafe"
  links={[
    { href: '/cinema', label: 'Cartelera' },
    { href: '/cafe', label: 'Carta' },
    { href: '/meetings', label: 'Salas' }
  ]} />

<div class="cafe-layout">
  <!-- Columna izquierda: categorías -->
  <aside class="category-column">
    <CategoryNav
      categories={CATEGORIES}
      selectedId={selectedCategory}
      counts={categoryCounts}
      totalCount={MENU.length}
      onSelect={(id) => (selectedCategory = id)} />
  </aside>

  <!-- Columna central: carta -->
  <main class="menu-column scrollbar-hide">
    <header class="menu-header">
      <div class="menu-heading">
        <h1>{currentCategoryName}</h1>
        <p class="menu-count">
          {visibleProducts.length}
          {visibleProducts.length === 1 ? 'producto' : 'productos'}
        </p>
      </div>

      <div class="menu-controls">
        <!-- EVENTO INPUT: búsqueda en vivo sobre la carta -->
        <Input
          type="search"
          placeholder="Buscar producto…"
          icon="search"
          class="search-field"
          bind:value={searchTerm}
          onkeydown={handleSearchKeydown} />

        <!-- EVENTO CHANGE: criterio de ordenación -->
        <Select options={SORT_OPTIONS} class="sort-field" bind:value={sortMode} />
      </div>
    </header>

    {#if visibleProducts.length === 0}
      <EmptyState
        icon="search_off"
        title="Sin resultados"
        description="Prueba con otro término o cambia de categoría." />
    {:else}
      <div class="products-grid">
        {#each visibleProducts as product (product.id)}
          <ProductCard
            {product}
            quantity={order.quantityOf(product.id)}
            onAdd={addProduct}
            onSetQuantity={setQuantity} />
        {/each}
      </div>
    {/if}
  </main>

  <!-- Columna derecha: pedido -->
  <div class="cart-column">
    <CartSummary
      {order}
      onSetQuantity={setQuantity}
      onSetNote={setNote}
      onRemove={removeProduct}
      onServiceModeChange={changeServiceMode}
      onClear={clearOrder}
      onCheckout={checkout} />
  </div>
</div>

<ReceiptDialog
  open={showReceipt}
  receipt={lastReceipt}
  onClose={() => (showReceipt = false)}
  onNewOrder={startNewOrder} />

<style>
  .cafe-layout {
    display: grid;
    grid-template-columns: 240px minmax(0, 1fr) 360px;
    flex: 1;
    max-width: 1500px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  .category-column {
    border-right: 1px solid var(--border-color);
    height: calc(100vh - 64px);
    overflow-y: auto;
    position: sticky;
    top: 64px;
  }

  .menu-column {
    padding: var(--spacing-xl);
    height: calc(100vh - 64px);
    overflow-y: auto;
  }

  .cart-column {
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
  }

  /* Cabecera de la carta */
  .menu-header {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .menu-heading h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .menu-count {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .menu-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .menu-controls :global(.search-field) {
    max-width: 320px;
  }

  .menu-controls :global(.sort-field) {
    max-width: 220px;
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: var(--spacing-md);
  }

  /* Responsive */
  @media (max-width: 1200px) {
    .cafe-layout {
      grid-template-columns: minmax(0, 1fr) 330px;
    }

    .category-column {
      grid-column: 1 / -1;
      position: static;
      height: auto;
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
  }

  @media (max-width: 900px) {
    .cafe-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .menu-column,
    .cart-column {
      height: auto;
      position: static;
    }

    .cart-column {
      border-top: 1px solid var(--border-color);
    }

    .menu-controls {
      flex-direction: column;
    }

    .menu-controls :global(.search-field),
    .menu-controls :global(.sort-field) {
      max-width: none;
    }
  }

  @media (max-width: 600px) {
    .menu-column {
      padding: var(--spacing-md);
    }

    .menu-heading h1 {
      font-size: 1.35rem;
    }
  }
</style>
