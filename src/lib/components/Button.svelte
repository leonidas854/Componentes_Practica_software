<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Componente visual: Botón.
   * PROPIEDADES: variant, size, type, disabled, fullWidth, class, style.
   * EVENTOS: click, mouseenter, mouseleave, focus, blur.
   */
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    fullWidth?: boolean;
    /** Id del formulario a enviar cuando el botón vive fuera del <form>. */
    form?: string;
    title?: string;
    ariaLabel?: string;
    class?: string;
    style?: string;
    children?: Snippet;
    onclick?: (event: MouseEvent) => void;
    onmouseenter?: (event: MouseEvent) => void;
    onmouseleave?: (event: MouseEvent) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    fullWidth = false,
    form,
    title,
    ariaLabel,
    class: className = '',
    style = '',
    children,
    onclick,
    onmouseenter,
    onmouseleave,
    onfocus,
    onblur
  }: ButtonProps = $props();
</script>

<button
  {type}
  {disabled}
  {form}
  {title}
  {style}
  aria-label={ariaLabel}
  class="btn btn-{variant} btn-{size} {className}"
  class:full-width={fullWidth}
  {onclick}
  {onmouseenter}
  {onmouseleave}
  {onfocus}
  {onblur}
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
    font-weight: 600;
    font-family: var(--font-family);
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    gap: var(--spacing-sm);
    line-height: 1.2;
    white-space: nowrap;
  }

  .btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .full-width {
    width: 100%;
  }

  /* Tamaños */
  .btn-sm {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
  .btn-md {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  .btn-lg {
    padding: 14px 20px;
    font-size: 1rem;
  }

  /* Variantes */
  .btn-primary {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    box-shadow: var(--shadow-sm);
  }
  .btn-primary:hover:not(:disabled) {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
  }

  .btn-secondary {
    background-color: var(--surface-color);
    color: var(--text-main);
    border-color: var(--border-color);
  }
  .btn-secondary:hover:not(:disabled) {
    background-color: var(--surface-hover);
  }

  .btn-danger {
    background-color: var(--danger-color);
    color: #fff;
  }
  .btn-danger:hover:not(:disabled) {
    opacity: 0.88;
  }

  .btn-success {
    background-color: var(--success-color);
    color: #fff;
  }
  .btn-success:hover:not(:disabled) {
    opacity: 0.88;
  }

  .btn-ghost {
    background-color: transparent;
    color: var(--text-main);
  }
  .btn-ghost:hover:not(:disabled) {
    background-color: var(--surface-hover);
  }
</style>
