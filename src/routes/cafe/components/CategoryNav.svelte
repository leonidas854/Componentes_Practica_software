<script lang="ts">
  import type { Category } from '../models/types';

  /**
   * Componente visual: Menú lateral de categorías.
   * PROPIEDADES: categories, selectedId (null = todas), counts.
   * EVENTOS: click.
   */
  interface CategoryNavProps {
    categories: Category[];
    selectedId: string | null;
    counts: Record<string, number>;
    totalCount: number;
    onSelect: (categoryId: string | null) => void;
  }

  let { categories, selectedId, counts, totalCount, onSelect }: CategoryNavProps = $props();
</script>

<nav class="category-nav" aria-label="Categorías de la carta">
  <h2 class="nav-title">Categorías</h2>

  <button
    type="button"
    class="category-btn"
    class:active={selectedId === null}
    aria-pressed={selectedId === null}
    onclick={() => onSelect(null)}
  >
    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
      restaurant_menu
    </span>
    <span class="category-name">Toda la carta</span>
    <span class="category-count">{totalCount}</span>
  </button>

  {#each categories as category (category.id)}
    <button
      type="button"
      class="category-btn"
      class:active={selectedId === category.id}
      aria-pressed={selectedId === category.id}
      onclick={() => onSelect(category.id)}
    >
      <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">
        {category.icon}
      </span>
      <span class="category-name">{category.name}</span>
      <span class="category-count">{counts[category.id] ?? 0}</span>
    </button>
  {/each}
</nav>

<style>
  .category-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--spacing-lg);
  }

  .nav-title {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: var(--spacing-sm);
  }

  .category-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .category-btn:hover {
    background: var(--surface-hover);
    color: var(--text-main);
  }

  .category-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .category-btn.active {
    background: var(--primary-color);
    color: var(--text-on-primary);
    font-weight: 600;
  }

  .category-name {
    flex: 1;
    min-width: 0;
  }

  .category-count {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 1px 7px;
    border-radius: var(--radius-full);
    background: var(--surface-high);
    color: var(--text-muted);
  }

  .category-btn.active .category-count {
    background: rgba(255, 255, 255, 0.22);
    color: var(--text-on-primary);
  }

  .category-btn :global(.material-symbols-outlined) {
    font-size: 20px;
  }

  /* En pantallas estrechas las categorías se muestran en horizontal. */
  @media (max-width: 900px) {
    .category-nav {
      flex-direction: row;
      overflow-x: auto;
      padding: var(--spacing-md);
      gap: var(--spacing-sm);
    }

    .nav-title {
      display: none;
    }

    .category-btn {
      width: auto;
      flex-shrink: 0;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-color);
    }
  }
</style>
