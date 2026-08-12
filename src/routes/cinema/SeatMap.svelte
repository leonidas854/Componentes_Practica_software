<script lang="ts">
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

  // Split each row in half for the aisle gap
  function leftHalf(row: Seat[]): Seat[] {
    const mid = Math.ceil(row.length / 2);
    return row.slice(0, mid);
  }

  function rightHalf(row: Seat[]): Seat[] {
    const mid = Math.ceil(row.length / 2);
    return row.slice(mid);
  }
</script>

<div class="seat-map-container">
  <!-- The Screen -->
  <div class="screen-wrapper">
    <div class="screen-curve">
      <div class="screen-glow"></div>
    </div>
    <span class="screen-label">PANTALLA</span>
  </div>

  <!-- Seat Grid -->
  <div class="seats-grid">
    {#each seats as row}
      <div class="seat-row">
        <span class="row-label">{row[0].row}</span>
        <div class="row-seats">
          {#each leftHalf(row) as seat}
            <button 
              class="seat-btn {seat.status}"
              disabled={seat.status === 'occupied'}
              onclick={() => onSeatToggle(seat)}
              aria-label={`Asiento ${seat.id}`}
              title={seat.id}
            >
              {seat.col}
            </button>
          {/each}
          <div class="aisle"></div>
          {#each rightHalf(row) as seat}
            <button 
              class="seat-btn {seat.status}"
              disabled={seat.status === 'occupied'}
              onclick={() => onSeatToggle(seat)}
              aria-label={`Asiento ${seat.id}`}
              title={seat.id}
            >
              {seat.col}
            </button>
          {/each}
        </div>
        <span class="row-label">{row[0].row}</span>
      </div>
    {/each}
  </div>

  <!-- Legend -->
  <div class="legend">
    <div class="legend-item">
      <div class="legend-swatch available"></div>
      <span>Disponible</span>
    </div>
    <div class="legend-item">
      <div class="legend-swatch selected"></div>
      <span>Seleccionado</span>
    </div>
    <div class="legend-item">
      <div class="legend-swatch occupied"></div>
      <span>Ocupado</span>
    </div>
  </div>
</div>

<style>
  .seat-map-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
  }

  /* Screen */
  .screen-wrapper {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .screen-curve {
    width: 100%;
    height: 48px;
    border-radius: 50% 50% 0 0 / 100% 100% 0 0;
    background: var(--surface-high);
    border-bottom: 4px solid rgba(255, 184, 0, 0.3);
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

  /* Seats Grid */
  .seats-grid {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--surface-low);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
  }

  .seat-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .row-label {
    width: 24px;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .row-seats {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .aisle {
    width: 16px;
  }

  /* Seat Button */
  .seat-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px 8px 4px 4px;
    border: 1px solid var(--border-color);
    font-size: 0.7rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .seat-btn.available {
    background-color: #353436;
    color: #e5e2e3;
    border-color: rgba(81, 69, 50, 0.5);
  }

  .seat-btn.available:hover {
    background-color: #414756;
    border-color: #414756;
    transform: scale(1.08);
  }

  .seat-btn.selected {
    background-color: #ffb800;
    color: #131314;
    border-color: #ffb800;
    box-shadow: 0 0 12px rgba(255, 184, 0, 0.4);
  }

  .seat-btn.occupied {
    background-color: var(--surface-low);
    color: rgba(81, 69, 50, 0.5);
    border-color: transparent;
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Legend */
  .legend {
    display: flex;
    gap: var(--spacing-xl);
    padding-top: var(--spacing-md);
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .legend-swatch {
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }

  .legend-swatch.available {
    background-color: #353436;
    border: 1px solid rgba(81, 69, 50, 0.5);
  }
  .legend-swatch.selected {
    background-color: #ffb800;
    border: 1px solid #ffb800;
  }
  .legend-swatch.occupied {
    background-color: var(--surface-low);
    border: 1px solid transparent;
  }
</style>
