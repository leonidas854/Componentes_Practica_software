<script lang="ts">
  import { page } from '$app/stores';

  /**
   * Componente visual: Barra de navegación superior compartida por los tres módulos.
   * PROPIEDADES: brand, brandIcon, links.
   * EVENTOS: click (navegación mediante enlaces).
   */
  export interface NavLink {
    href: string;
    label: string;
  }

  interface TopNavProps {
    brand: string;
    brandIcon?: string;
    links?: NavLink[];
  }

  let { brand, brandIcon, links = [] }: TopNavProps = $props();

  let currentPath = $derived($page.url.pathname);
</script>

<header class="top-nav">
  <div class="nav-inner">
    <div class="nav-left">
      <a href="/" class="brand" title="Volver al inicio">
        {#if brandIcon}
          <span
            class="material-symbols-outlined brand-icon"
            style="font-variation-settings: 'FILL' 1;"
            aria-hidden="true">{brandIcon}</span>
        {/if}
        {brand}
      </a>

      {#if links.length > 0}
        <nav class="nav-links" aria-label="Secciones">
          {#each links as link (link.href)}
            <a href={link.href} class="nav-link" class:active={currentPath === link.href}>
              {link.label}
            </a>
          {/each}
        </nav>
      {/if}
    </div>

    <div class="nav-right">
      <a href="/" class="home-btn" aria-label="Inicio">
        <span class="material-symbols-outlined">home</span>
        <span class="home-label">Inicio</span>
      </a>
    </div>
  </div>
</header>

<style>
  .top-nav {
    background: var(--surface-color);
    backdrop-filter: var(--glass-blur);
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
    gap: var(--spacing-md);
    padding: 0 var(--spacing-lg);
    height: 64px;
    max-width: 1440px;
    margin: 0 auto;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    min-width: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .brand-icon {
    color: var(--primary-color);
    font-size: 26px;
  }

  .nav-links {
    display: none;
    align-items: center;
    gap: var(--spacing-lg);
    height: 64px;
  }

  @media (min-width: 768px) {
    .nav-links {
      display: flex;
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
    transition: color var(--transition-fast);
    border-bottom: 2px solid transparent;
  }

  .nav-link:hover {
    color: var(--text-main);
  }

  .nav-link.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .home-btn {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 8px 14px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    background: var(--surface-low);
    color: var(--text-muted);
    font-size: 0.85rem;
    font-weight: 600;
    transition: all var(--transition-fast);
  }

  .home-btn:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

  .home-btn :global(.material-symbols-outlined) {
    font-size: 18px;
  }

  .home-label {
    display: none;
  }

  @media (min-width: 640px) {
    .home-label {
      display: inline;
    }
  }
</style>
