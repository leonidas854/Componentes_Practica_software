<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { 
    variant = 'primary', 
    type = 'button', 
    disabled = false, 
    onclick, 
    children,
    class: className = '',
    style = ''
  } = $props<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
    class?: string;
    style?: string;
  }>();
</script>

<button
  {type}
  {disabled}
  {onclick}
  class="btn btn-{variant} {className}"
  {style}
>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-base);
    font-weight: 500;
    font-family: var(--font-family);
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    gap: var(--spacing-sm);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
    box-shadow: var(--shadow-sm);
  }
  
  .btn-primary:hover:not(:disabled) {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: var(--surface-color);
    color: var(--text-main);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--surface-hover);
  }

  .btn-danger {
    background-color: var(--danger-color);
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    opacity: 0.9;
  }
  
  .btn-ghost {
    background-color: transparent;
    color: var(--text-main);
  }
  
  .btn-ghost:hover:not(:disabled) {
    background-color: var(--surface-hover);
  }
</style>
