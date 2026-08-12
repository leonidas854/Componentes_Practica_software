<script lang="ts">
  import { toast } from '$lib/stores/toast.svelte';

  /**
   * Componente visual: Aviso flotante.
   * Se alimenta del store global de notificaciones; no recibe propiedades.
   * EVENTOS: click (cerrar).
   */
  const ICONS = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  } as const;
</script>

{#if toast.current}
  {#key toast.current.id}
    <div class="toast toast-{toast.current.tone}" role="status" aria-live="polite">
      <span class="material-symbols-outlined toast-icon" aria-hidden="true">
        {ICONS[toast.current.tone]}
      </span>
      <div class="toast-text">
        <strong>{toast.current.title}</strong>
        {#if toast.current.detail}
          <span class="toast-detail">{toast.current.detail}</span>
        {/if}
      </div>
      <button class="toast-close" onclick={() => toast.dismiss()} aria-label="Cerrar aviso">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>
  {/key}
{/if}

<style>
  .toast {
    position: fixed;
    bottom: var(--spacing-lg);
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-sm);
    min-width: 280px;
    max-width: min(440px, calc(100vw - 32px));
    padding: 12px var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--surface-color);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-lg);
    animation: fadeInUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast-icon {
    font-size: 22px;
    flex-shrink: 0;
  }

  .toast-success {
    border-left: 4px solid var(--success-color);
  }
  .toast-success .toast-icon {
    color: var(--success-color);
  }

  .toast-error {
    border-left: 4px solid var(--danger-color);
  }
  .toast-error .toast-icon {
    color: var(--danger-color);
  }

  .toast-info {
    border-left: 4px solid var(--primary-color);
  }
  .toast-info .toast-icon {
    color: var(--primary-color);
  }

  .toast-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .toast-detail {
    color: var(--text-muted);
    font-size: 0.8rem;
    white-space: pre-line;
  }

  .toast-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .toast-close:hover {
    background: var(--surface-hover);
  }

  .toast-close :global(.material-symbols-outlined) {
    font-size: 16px;
  }
</style>
