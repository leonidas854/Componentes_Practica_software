<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import Button from '$lib/components/Button.svelte';
  import SeatMap, { type Seat } from './SeatMap.svelte';

  const TICKET_PRICE = 10.00;

  // Initialize seats using Svelte 5 state
  let seats = $state(
    ['A', 'B', 'C', 'D', 'E'].map(row => 
      Array.from({ length: 10 }, (_, i) => ({
        id: `${row}${i + 1}`,
        row,
        col: i + 1,
        // Randomly set some seats as occupied for demo purposes
        status: Math.random() > 0.8 ? 'occupied' : 'available'
      } as Seat))
    )
  );

  let selectedSeats = $derived(
    seats.flat().filter(seat => seat.status === 'selected')
  );

  let totalAmount = $derived(selectedSeats.length * TICKET_PRICE);

  function handleSeatToggle(toggledSeat: Seat) {
    if (toggledSeat.status === 'occupied') return;

    // Find the seat in the state array and update it
    seats = seats.map(row => 
      row.map(seat => {
        if (seat.id === toggledSeat.id) {
          return { 
            ...seat, 
            status: seat.status === 'selected' ? 'available' : 'selected' 
          };
        }
        return seat;
      })
    );
  }

  function handlePurchase() {
    if (selectedSeats.length === 0) return;
    
    alert(`Compra realizada con éxito!\nAsientos: ${selectedSeats.map(s => s.id).join(', ')}\nTotal: $${totalAmount.toFixed(2)}`);
    
    // Mark as occupied after purchase
    seats = seats.map(row => 
      row.map(seat => ({
        ...seat,
        status: seat.status === 'selected' ? 'occupied' : seat.status
      }))
    );
  }
</script>

<Header title="Cine Center - Venta de Entradas" backUrl="/" />

<main class="cinema-container">
  <div class="content-grid">
    <section class="seat-selection-section">
      <h2 class="section-title">Selección de Asientos</h2>
      <SeatMap {seats} onSeatToggle={handleSeatToggle} />
    </section>

    <aside class="summary-section">
      <div class="summary-card glass-panel">
        <h2>Resumen de Compra</h2>
        
        <div class="summary-details">
          <div class="detail-row">
            <span>Precio por Entrada:</span>
            <span>${TICKET_PRICE.toFixed(2)}</span>
          </div>
          
          <div class="selected-seats-list">
            <h3>Asientos Seleccionados ({selectedSeats.length})</h3>
            {#if selectedSeats.length === 0}
              <p class="empty-state">No hay asientos seleccionados</p>
            {:else}
              <div class="tags">
                {#each selectedSeats as seat}
                  <span class="seat-tag">{seat.id}</span>
                {/each}
              </div>
            {/if}
          </div>

          <div class="total-row">
            <span>Total:</span>
            <span class="total-amount text-gradient">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <Button 
          variant="primary" 
          disabled={selectedSeats.length === 0}
          onclick={handlePurchase}
          style="width: 100%; margin-top: var(--spacing-lg);"
        >
          Confirmar Compra
        </Button>
      </div>
    </aside>
  </div>
</main>

<style>
  .cinema-container {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
  }

  .section-title {
    margin-bottom: var(--spacing-lg);
    font-size: 1.5rem;
  }

  .summary-section {
    position: sticky;
    top: 100px; /* Offset for header if needed */
  }

  .summary-card {
    padding: var(--spacing-xl);
  }

  .summary-card h2 {
    font-size: 1.25rem;
    margin-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: var(--spacing-sm);
  }

  .summary-details {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .selected-seats-list h3 {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-sm);
  }

  .empty-state {
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.9rem;
    font-style: italic;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
  }

  .seat-tag {
    background: var(--primary-glow);
    color: var(--primary-color);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 600;
    border: 1px solid var(--primary-color);
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px dashed var(--border-color);
    font-size: 1.2rem;
    font-weight: bold;
  }

  .total-amount {
    font-size: 1.8rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .content-grid {
      grid-template-columns: 1fr;
    }
    
    .summary-section {
      position: static;
    }
  }
</style>
