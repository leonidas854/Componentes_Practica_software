<script lang="ts">
  import type { Auditorium } from '../models/Auditorium.svelte';
  import type { Seat } from '../models/Seat.svelte';

  /**
   * Componente visual: Mapa de butacas.
   *
   * MANEJO DE EVENTOS — este componente concentra cuatro tipos distintos:
   *  - click        → seleccionar / liberar una butaca
   *  - mouseenter   → mostrar la butaca bajo el cursor en la vista previa
   *  - mouseleave   → limpiar la vista previa
   *  - keydown      → desplazarse por la rejilla con las flechas del teclado
   */
  interface SeatMapProps {
    auditorium: Auditorium;
    onToggle: (seat: Seat) => void;
    onHover?: (seat: Seat | null) => void;
  }

  let { auditorium, onToggle, onHover }: SeatMapProps = $props();

  /** Contenedor de la rejilla; se usa para mover el foco con el teclado. */
  let gridElement: HTMLDivElement | null = $state(null);

  const STATUS_TEXT = {
    available: 'disponible',
    selected: 'seleccionada',
    occupied: 'ocupada'
  } as const;

  const ARROW_DELTAS: Record<string, [number, number]> = {
    ArrowUp: [-1, 0],
    ArrowDown: [1, 0],
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1]
  };

  /**
   * EVENTO KEYDOWN: navegación por la rejilla con las flechas del teclado.
   *
   * Las butacas ocupadas están deshabilitadas y no admiten el foco, así que se
   * avanza en la misma dirección hasta dar con una seleccionable. Sin esto, el
   * recorrido con el teclado se quedaría bloqueado al primer asiento vendido.
   */
  function handleKeydown(event: KeyboardEvent, rowIndex: number, colIndex: number) {
    const delta = ARROW_DELTAS[event.key];
    if (!delta) return;

    event.preventDefault();

    let nextRow = rowIndex + delta[0];
    let nextCol = colIndex + delta[1];

    let candidate = auditorium.seatAt(nextRow, nextCol);
    while (candidate && !candidate.isSelectable) {
      nextRow += delta[0];
      nextCol += delta[1];
      candidate = auditorium.seatAt(nextRow, nextCol);
    }

    // Se salió de la rejilla sin encontrar butaca disponible: el foco no se mueve.
    if (!candidate) return;

    gridElement
      ?.querySelector<HTMLButtonElement>(`[data-row="${nextRow}"][data-col="${nextCol}"]`)
      ?.focus();
  }
</script>

<div class="seat-map">
  <!-- Pantalla -->
  <div class="screen-wrapper">
    <div class="screen-curve"><div class="screen-glow"></div></div>
    <span class="screen-label">Pantalla</span>
  </div>

  <!-- Rejilla de butacas -->
  <div class="seats-grid" bind:this={gridElement}>
    {#each auditorium.rows as row, rowIndex (row[0].row)}
      <div class="seat-row">
        <span class="row-label" aria-hidden="true">{row[0].row}</span>

        <div class="row-seats">
          {#each row as seat, colIndex (seat.id)}
            {#if colIndex === Math.floor(row.length / 2)}
              <div class="aisle" aria-hidden="true"></div>
            {/if}
            <button
              type="button"
              class="seat-btn {seat.status}"
              class:vip={seat.isVip}
              data-row={rowIndex}
              data-col={colIndex}
              disabled={!seat.isSelectable}
              aria-label="Butaca {seat.id}, {seat.isVip ? 'VIP' : 'estándar'}, {STATUS_TEXT[
                seat.status
              ]}"
              aria-pressed={seat.status === 'selected'}
              onclick={() => onToggle(seat)}
              onmouseenter={() => onHover?.(seat)}
              onmouseleave={() => onHover?.(null)}
              onkeydown={(event) => handleKeydown(event, rowIndex, colIndex)}
            >
              {seat.col}
            </button>
          {/each}
        </div>

        <span class="row-label" aria-hidden="true">{row[0].row}</span>
      </div>
    {/each}
  </div>

  <!-- Leyenda -->
  <div class="legend">
    <div class="legend-item"><span class="swatch available"></span> Disponible</div>
    <div class="legend-item"><span class="swatch vip"></span> VIP (+$3)</div>
    <div class="legend-item"><span class="swatch selected"></span> Seleccionada</div>
    <div class="legend-item"><span class="swatch occupied"></span> Ocupada</div>
  </div>

  <p class="keyboard-hint">
    <span class="material-symbols-outlined" aria-hidden="true">keyboard</span>
    Usa las flechas para moverte y Enter para seleccionar
  </p>
</div>

<style>
  .seat-map {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
    width: 100%;
  }

  /* Pantalla */
  .screen-wrapper {
    width: 100%;
    max-width: 560px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .screen-curve {
    width: 100%;
    height: 44px;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    background: var(--surface-high);
    border-bottom: 4px solid var(--primary-glow);
    position: relative;
    overflow: hidden;
  }

  .screen-glow {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(255, 222, 168, 0.15), transparent);
  }

  .screen-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  /* Rejilla */
  .seats-grid {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: var(--spacing-md);
    background: var(--surface-low);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    max-width: 100%;
    overflow-x: auto;
  }

  .seat-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .row-label {
    width: 20px;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .row-seats {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .aisle {
    width: 14px;
    flex-shrink: 0;
  }

  /* Butaca */
  .seat-btn {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    border-radius: 8px 8px 4px 4px;
    border: 1px solid var(--border-color);
    font-size: 0.65rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #353436;
    color: #e5e2e3;
  }

  .seat-btn:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    z-index: 1;
  }

  .seat-btn.available:hover {
    background-color: #4b4a4d;
    transform: scale(1.12);
  }

  .seat-btn.vip.available {
    border-color: var(--primary-color);
    background-color: #3d3628;
  }

  .seat-btn.selected {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    border-color: var(--primary-color);
    box-shadow: 0 0 12px var(--primary-glow);
    transform: scale(1.05);
  }

  .seat-btn.occupied {
    background-color: var(--surface-low);
    color: rgba(255, 255, 255, 0.18);
    border-color: transparent;
    cursor: not-allowed;
  }

  /* Leyenda */
  .legend {
    display: flex;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .swatch {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    display: inline-block;
    border: 1px solid var(--border-color);
  }

  .swatch.available {
    background-color: #353436;
  }
  .swatch.vip {
    background-color: #3d3628;
    border-color: var(--primary-color);
  }
  .swatch.selected {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
  .swatch.occupied {
    background-color: var(--surface-low);
    opacity: 0.5;
  }

  .keyboard-hint {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    color: var(--text-muted);
    opacity: 0.75;
  }

  .keyboard-hint :global(.material-symbols-outlined) {
    font-size: 16px;
  }
</style>
