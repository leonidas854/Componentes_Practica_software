<script lang="ts">
  import { Monitor } from 'lucide-svelte';
  
  export type SeatStatus = 'available' | 'selected' | 'occupied';
  
  export interface Seat {
    id: string;
    row: string;
    col: number;
    status: SeatStatus;
  }

  let { 
    seats,
    onSeatToggle
  } = $props<{
    seats: Seat[][];
    onSeatToggle: (seat: Seat) => void;
  }>();

</script>

<div class="seat-map-container">
  <div class="screen-area">
    <div class="screen-curve"></div>
    <span class="screen-text">PANTALLA</span>
  </div>

  <div class="seats-grid">
    {#each seats as row, rowIndex}
      <div class="seat-row">
        <span class="row-label">{row[0].row}</span>
        <div class="row-seats">
          {#each row as seat}
            <button 
              class="seat {seat.status}"
              disabled={seat.status === 'occupied'}
              onclick={() => onSeatToggle(seat)}
              aria-label={`Asiento ${seat.id}`}
              title={seat.id}
            >
              <!-- Seat SVG representation -->
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 18v3h3v-3h10v3h3v-6H4v3zm15-8h3v3h-3v-3zM2 10h3v3H2v-3zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z"/>
              </svg>
            </button>
          {/each}
        </div>
        <span class="row-label">{row[0].row}</span>
      </div>
    {/each}
  </div>

  <div class="legend">
    <div class="legend-item">
      <div class="seat-sample available"></div>
      <span>Disponible</span>
    </div>
    <div class="legend-item">
      <div class="seat-sample selected"></div>
      <span>Seleccionado</span>
    </div>
    <div class="legend-item">
      <div class="seat-sample occupied"></div>
      <span>Ocupado</span>
    </div>
  </div>
</div>

<style>
  .seat-map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--surface-color);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
  }

  .screen-area {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }

  .screen-curve {
    width: 100%;
    height: 40px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
    border-top: 4px solid var(--primary-color);
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    box-shadow: 0 10px 20px var(--primary-glow);
  }

  .screen-text {
    font-size: 0.8rem;
    color: var(--text-muted);
    letter-spacing: 0.2em;
  }

  .seats-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .seat-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .row-label {
    width: 20px;
    text-align: center;
    font-weight: 600;
    color: var(--text-muted);
  }

  .row-seats {
    display: flex;
    gap: var(--spacing-sm);
  }

  .seat {
    background: none;
    border: none;
    padding: 0;
    width: 32px;
    height: 32px;
    cursor: pointer;
    transition: transform var(--transition-fast), color var(--transition-fast);
    color: var(--border-color); /* default for available */
  }

  .seat svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
  }

  .seat:hover:not(:disabled) {
    transform: scale(1.1);
    color: rgba(255, 255, 255, 0.5);
  }

  .seat.available {
    color: var(--text-muted);
  }

  .seat.selected {
    color: var(--primary-color);
    filter: drop-shadow(0 0 8px var(--primary-color));
  }

  .seat.occupied {
    color: var(--danger-color);
    cursor: not-allowed;
    opacity: 0.5;
  }

  .legend {
    display: flex;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-lg);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    width: 100%;
    justify-content: center;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .seat-sample {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }

  .seat-sample.available { background-color: var(--text-muted); }
  .seat-sample.selected { background-color: var(--primary-color); }
  .seat-sample.occupied { background-color: var(--danger-color); }
</style>
