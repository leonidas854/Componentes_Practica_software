<script lang="ts">
  import { formatCurrency, formatHour } from '$lib/utils/format';
  import type { Showtime } from '../models/types';

  /**
   * Componente visual: Selector de función (horario + formato).
   * PROPIEDADES: showtimes, selectedId.
   * EVENTOS: click.
   */
  interface ShowtimeSelectorProps {
    showtimes: Showtime[];
    selectedId: string;
    onSelect: (showtime: Showtime) => void;
  }

  let { showtimes, selectedId, onSelect }: ShowtimeSelectorProps = $props();
</script>

<div class="showtime-selector">
  <span class="selector-label">Función</span>
  <div class="chips" role="group" aria-label="Horarios disponibles">
    {#each showtimes as showtime (showtime.id)}
      <button
        type="button"
        class="chip"
        class:active={selectedId === showtime.id}
        aria-pressed={selectedId === showtime.id}
        onclick={() => onSelect(showtime)}
      >
        <span class="chip-time">{formatHour(showtime.hour)}</span>
        <span class="chip-meta">{showtime.format} · {formatCurrency(showtime.basePrice)}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .showtime-selector {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    width: 100%;
  }

  .selector-label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .chips {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
  }

  .chip {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    padding: 8px 14px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--surface-low);
    color: var(--text-main);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
  }

  .chip:hover {
    border-color: var(--primary-color);
  }

  .chip:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .chip.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-on-primary);
  }

  .chip-time {
    font-size: 0.9rem;
    font-weight: 700;
  }

  .chip-meta {
    font-size: 0.7rem;
    opacity: 0.8;
  }
</style>
