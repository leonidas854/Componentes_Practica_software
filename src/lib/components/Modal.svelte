<script lang="ts">
  import type { Snippet } from 'svelte';

  /**
   * Componente visual: Ventana modal.
   * PROPIEDADES: open, title, subtitle, size, closeOnBackdrop.
   * EVENTOS: click (backdrop y botón cerrar), keydown (tecla Escape a nivel de ventana).
   */
  interface ModalProps {
    open?: boolean;
    title?: string;
    subtitle?: string;
    size?: 'sm' | 'md' | 'lg';
    closeOnBackdrop?: boolean;
    onClose?: () => void;
    children: Snippet;
    footer?: Snippet;
  }

  let {
    open = false,
    title = '',
    subtitle = '',
    size = 'md',
    closeOnBackdrop = true,
    onClose,
    children,
    footer
  }: ModalProps = $props();

  /** EVENTO DE TECLADO: cierra el modal con la tecla Escape. */
  function handleWindowKeydown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      event.preventDefault();
      onClose?.();
    }
  }

  function handleBackdropClick() {
    if (closeOnBackdrop) onClose?.();
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
  <div class="modal-overlay">
    <!-- Capa de fondo: un click fuera del diálogo lo cierra -->
    <button
      class="backdrop"
      aria-label="Cerrar ventana"
      tabindex="-1"
      onclick={handleBackdropClick}
    ></button>

    <div class="modal modal-{size}" role="dialog" aria-modal="true" aria-label={title}>
      <header class="modal-header">
        <div class="modal-heading">
          <h2>{title}</h2>
          {#if subtitle}<p class="modal-subtitle">{subtitle}</p>{/if}
        </div>
        <button class="close-btn" onclick={() => onClose?.()} aria-label="Cerrar">
          <span class="material-symbols-outlined">close</span>
        </button>
      </header>

      <div class="modal-body scrollbar-hide">
        {@render children()}
      </div>

      {#if footer}
        <footer class="modal-footer">
          {@render footer()}
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
  }

  .backdrop {
    position: absolute;
    inset: 0;
    border: none;
    padding: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    cursor: default;
    animation: fadeIn 0.15s ease;
  }

  .modal {
    position: relative;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background: var(--surface-color);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    animation: fadeInUp 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .modal-sm {
    max-width: 400px;
  }
  .modal-md {
    max-width: 560px;
  }
  .modal-lg {
    max-width: 760px;
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .modal-heading h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }

  .modal-subtitle {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .close-btn:hover {
    background: var(--surface-hover);
    color: var(--text-main);
  }

  .modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    background: var(--surface-low);
  }
</style>
