<script lang="ts">
  import type { CalendarDay } from '../data/rooms';

  /**
   * Componente visual: Selector de día.
   * PROPIEDADES: days, selected.
   * EVENTOS: click.
   */
  interface DatePickerProps {
    days: CalendarDay[];
    selected: string;
    onSelect: (date: string) => void;
  }

  let { days, selected, onSelect }: DatePickerProps = $props();
</script>

<div class="date-picker scrollbar-hide" role="group" aria-label="Seleccionar día">
  {#each days as day (day.value)}
    <button
      type="button"
      class="date-btn"
      class:active={selected === day.value}
      class:today={day.isToday}
      aria-pressed={selected === day.value}
      onclick={() => onSelect(day.value)}
    >
      <span class="date-weekday">{day.weekday}</span>
      <span class="date-number">{day.dayNumber}</span>
      {#if day.isToday}<span class="today-dot" aria-hidden="true"></span>{/if}
    </button>
  {/each}
</div>

<style>
  .date-picker {
    display: flex;
    gap: var(--spacing-sm);
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .date-btn {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 60px;
    padding: 10px 12px;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--surface-low);
    color: var(--text-muted);
    font-family: inherit;
    cursor: pointer;
    transition: all var(--transition-fast);
    flex-shrink: 0;
  }

  .date-btn:hover {
    border-color: var(--primary-color);
    color: var(--text-main);
  }

  .date-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .date-btn.active {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: var(--text-on-primary);
  }

  .date-weekday {
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .date-number {
    font-size: 1.15rem;
    font-weight: 700;
  }

  .today-dot {
    position: absolute;
    bottom: 5px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--secondary-color);
  }

  .date-btn.active .today-dot {
    background: var(--text-on-primary);
  }
</style>
