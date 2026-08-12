<script lang="ts">
  /**
   * Componente visual: Estado vacío.
   * PROPIEDADES: icon, title, description.
   */
  interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    class?: string;
  }

  let {
    icon = 'inbox',
    title,
    description = '',
    class: className = ''
  }: EmptyStateProps = $props();
</script>

<div class="empty-state {className}">
  <span class="material-symbols-outlined empty-icon" aria-hidden="true">{icon}</span>
  <p class="empty-title">{title}</p>
  {#if description}
    <p class="empty-description">{description}</p>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-xl) var(--spacing-md);
    color: var(--text-muted);
  }

  .empty-icon {
    font-size: 44px !important;
    opacity: 0.35;
    margin-bottom: var(--spacing-xs);
  }

  .empty-title {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .empty-description {
    font-size: 0.8rem;
    opacity: 0.8;
    max-width: 28ch;
  }
</style>
