<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Componente visual: Etiqueta / distintivo.
   * PROPIEDADES: tone, icon, size.
   */
  interface BadgeProps {
    tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
    icon?: string;
    size?: 'sm' | 'md';
    class?: string;
    children: Snippet;
  }

  let {
    tone = 'neutral',
    icon,
    size = 'sm',
    class: className = '',
    children
  }: BadgeProps = $props();
</script>

<span class="badge badge-{tone} badge-{size} {className}">
  {#if icon}
    <span class="material-symbols-outlined badge-icon" aria-hidden="true">{icon}</span>
  {/if}
  {@render children()}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    border-radius: var(--radius-full);
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
  }

  .badge-sm {
    padding: 3px 9px;
    font-size: 0.7rem;
  }
  .badge-md {
    padding: 5px 12px;
    font-size: 0.8rem;
  }

  .badge-icon {
    font-size: 14px !important;
  }

  .badge-neutral {
    background: var(--surface-high);
    color: var(--text-muted);
    border-color: var(--border-color);
  }

  .badge-primary {
    background: var(--primary-glow);
    color: var(--primary-color);
    border-color: var(--border-color);
  }

  .badge-success {
    background: color-mix(in srgb, var(--success-color) 15%, transparent);
    color: var(--success-color);
  }

  .badge-warning {
    background: color-mix(in srgb, var(--warning-color) 18%, transparent);
    color: var(--warning-color);
  }

  .badge-danger {
    background: color-mix(in srgb, var(--danger-color) 15%, transparent);
    color: var(--danger-color);
  }
</style>
