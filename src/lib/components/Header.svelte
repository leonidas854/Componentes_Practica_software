<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';

  let { 
    title, 
    backUrl, 
    class: className = '' 
  } = $props<{
    title: string;
    backUrl?: string;
    class?: string;
  }>();
</script>

<header class="header {className}">
  <div class="header-content">
    {#if backUrl}
      <a href={backUrl} class="back-link" aria-label="Go back">
        <ArrowLeft size={20} />
      </a>
    {/if}
    <h1 class="title text-gradient">{title}</h1>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(23, 28, 40, 0.8);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border-bottom: 1px solid var(--border-color);
    padding: var(--spacing-md) var(--spacing-xl);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .back-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--surface-color);
    color: var(--text-main);
    transition: all var(--transition-fast);
  }

  .back-link:hover {
    background-color: var(--surface-hover);
    color: var(--primary-color);
    transform: translateX(-2px);
  }

  .title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }
</style>
