<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { 
    children, 
    header, 
    footer,
    class: className = '',
    interactive = false,
    onclick
  } = $props<{
    children: Snippet;
    header?: Snippet;
    footer?: Snippet;
    class?: string;
    interactive?: boolean;
    onclick?: () => void;
  }>();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div 
  class="card {className}" 
  class:interactive 
  {onclick}
  role={interactive ? 'button' : undefined}
  tabindex={interactive ? 0 : undefined}
  onkeydown={(e: KeyboardEvent) => {
    if (interactive && onclick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onclick();
    }
  }}
>
  {#if header}
    <div class="card-header">
      {@render header()}
    </div>
  {/if}
  
  <div class="card-body">
    {@render children()}
  </div>
  
  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .card {
    background: var(--surface-color);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform var(--transition-normal), box-shadow var(--transition-normal);
  }

  .card.interactive {
    cursor: pointer;
  }

  .card.interactive:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .card-header {
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    font-weight: 600;
  }

  .card-body {
    padding: var(--spacing-md);
    flex: 1;
  }

  .card-footer {
    padding: var(--spacing-md);
    border-top: 1px solid var(--border-color);
    background: rgba(0, 0, 0, 0.2);
  }
</style>
