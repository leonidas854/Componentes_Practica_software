<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import SeatMap, { type Seat } from './SeatMap.svelte';

  // Movie data
  interface Movie {
    id: string;
    title: string;
    genre: string;
    duration: string;
    rating: number;
    poster: string;
  }

  const MOVIES: Movie[] = [
    {
      id: 'm1',
      title: 'Neon Orbit: The Awakening',
      genre: 'Sci-Fi',
      duration: '142 min',
      rating: 8.9,
      poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADo5jCGYOxOuEpv88-SHKILwjsG4XqjJIXeONdS1zRx7Q0AscBknlJyLfJTUt7V9skln7tcKartIGi08ChjAWLLzB9szFoUtx2uN22RCaPa9OY7xalZKX8XuuNfCOz4auQyxeOhvnv3jPx4gFuwwz9cahizFV2f3XFaixwXIiJUzgo4PByD9JlExMfvXWOpczeV1U7CMRCAggG1o8P4U7iaka9az8BCmXI9NKN7XpNe6EARDMqpQpYfw'
    },
    {
      id: 'm2',
      title: 'Bridge to Nowhere',
      genre: 'Drama',
      duration: '110 min',
      rating: 7.5,
      poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc3c49E5_99dUe0E5QLq4WxM5T2y_Pq5l8KQhSiut3ADg_OXB1XbdgkWDuWN3uJLEa7KXECa2noh5x89X4zfBKkKXMyMqROAXF6RpgbiNymhGPdLEuP0Th8oiiRQMX-Bp5AQMrtR_NrRdX-WRtDv4hzU7uqStemuUstMdiJm5SGfYknn0A5l3K9Oor7jKP8Wy_nV51KrMMffr1nx3XbBgOVbSGDrXZvYDtePqbAwNY4NzBwnWkFEfhmg'
    },
    {
      id: 'm3',
      title: 'La Última Sombra',
      genre: 'Thriller',
      duration: '128 min',
      rating: 8.2,
      poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADo5jCGYOxOuEpv88-SHKILwjsG4XqjJIXeONdS1zRx7Q0AscBknlJyLfJTUt7V9skln7tcKartIGi08ChjAWLLzB9szFoUtx2uN22RCaPa9OY7xalZKX8XuuNfCOz4auQyxeOhvnv3jPx4gFuwwz9cahizFV2f3XFaixwXIiJUzgo4PByD9JlExMfvXWOpczeV1U7CMRCAggG1o8P4U7iaka9az8BCmXI9NKN7XpNe6EARDMqpQpYfw'
    }
  ];

  const TICKET_PRICE = 15.00;
  const SHOWTIMES = ['4:30 PM', '7:00 PM', '8:30 PM', '10:00 PM'];

  // State
  let selectedMovie = $state<Movie>(MOVIES[0]);
  let selectedShowtime = $state(SHOWTIMES[2]); // Default 8:30 PM

  // Initialize seats
  let seats = $state(
    ['A', 'B', 'C', 'D', 'E', 'F'].map(row => 
      Array.from({ length: 8 }, (_, i) => ({
        id: `${row}${i + 1}`,
        row,
        col: i + 1,
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

  function selectMovie(movie: Movie) {
    selectedMovie = movie;
    // Reset seats when changing movie
    seats = seats.map(row =>
      row.map(seat => ({
        ...seat,
        status: seat.status === 'selected' ? 'available' : seat.status
      }))
    );
  }

  function handlePurchase() {
    if (selectedSeats.length === 0) return;
    alert(`¡Compra realizada con éxito!\nPelícula: ${selectedMovie.title}\nHorario: ${selectedShowtime}\nAsientos: ${selectedSeats.map(s => s.id).join(', ')}\nTotal: $${totalAmount.toFixed(2)}`);
    
    seats = seats.map(row => 
      row.map(seat => ({
        ...seat,
        status: seat.status === 'selected' ? 'occupied' : seat.status
      }))
    );
  }
</script>

<!-- Inline TopNavBar -->
<header class="top-nav">
  <div class="nav-inner">
    <div class="nav-left">
      <a href="/" class="brand">Cine Center</a>
      <nav class="nav-links">
        <a href="/cinema" class="nav-link active">Cinema</a>
        <a href="/cafe" class="nav-link">Coffee</a>
        <a href="/meetings" class="nav-link">Meetings</a>
      </nav>
    </div>
    <div class="nav-right">
      <button class="nav-icon-btn" aria-label="Account">
        <span class="material-symbols-outlined">account_circle</span>
      </button>
      <button class="nav-icon-btn" aria-label="Settings">
        <span class="material-symbols-outlined">settings</span>
      </button>
    </div>
  </div>
</header>

<main class="cinema-layout">
  <!-- Left Sidebar: Movie Selection -->
  <aside class="movie-sidebar scrollbar-hide">
    <div class="sidebar-header">
      <h2>Now Showing</h2>
    </div>
    <div class="movie-list">
      {#each MOVIES as movie}
        <button 
          class="movie-card"
          class:active={selectedMovie.id === movie.id}
          onclick={() => selectMovie(movie)}
        >
          <img 
            class="movie-poster"
            src={movie.poster} 
            alt={movie.title}
          />
          <div class="movie-info">
            <span class="movie-title">{movie.title}</span>
            <span class="movie-meta">{movie.genre} • {movie.duration}</span>
            <div class="movie-rating">
              <span class="material-symbols-outlined star-icon" style="font-variation-settings: 'FILL' 1;">star</span>
              <span>{movie.rating}</span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </aside>

  <!-- Center: Seat Selection -->
  <section class="center-content scrollbar-hide">
    <div class="movie-header">
      <h1>{selectedMovie.title}</h1>
      <p class="showtime-info">
        <span class="material-symbols-outlined" style="font-size: 18px;">calendar_today</span>
        Hoy, {selectedShowtime} • Teatro 4
      </p>
    </div>

    <!-- Showtime Chips -->
    <div class="showtime-chips">
      {#each SHOWTIMES as time}
        <button 
          class="chip"
          class:active={selectedShowtime === time}
          onclick={() => selectedShowtime = time}
        >
          {time}
        </button>
      {/each}
    </div>

    <SeatMap {seats} onSeatToggle={handleSeatToggle} />
  </section>

  <!-- Right Sidebar: Order Summary -->
  <aside class="summary-sidebar">
    <h2 class="summary-title">Resumen</h2>

    <div class="summary-content">
      <!-- Ticket Details -->
      <div class="ticket-card">
        <h3>Entradas ({selectedSeats.length})</h3>
        {#if selectedSeats.length === 0}
          <p class="empty-msg">Selecciona tus asientos</p>
        {:else}
          {#each selectedSeats as seat}
            <div class="ticket-row">
              <span class="ticket-seat">Asiento {seat.id}</span>
              <span class="ticket-price">${TICKET_PRICE.toFixed(2)}</span>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Total -->
      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Total</span>
          <span class="total-amount">${totalAmount.toFixed(2)}</span>
        </div>
        <button 
          class="buy-btn"
          disabled={selectedSeats.length === 0}
          onclick={handlePurchase}
        >
          <span class="material-symbols-outlined" style="font-size: 20px;">confirmation_number</span>
          Comprar Entradas
        </button>
        <p class="tax-note">Impuestos y cargos incluidos</p>
      </div>
    </div>
  </aside>
</main>

<style>
  /* ===== Top Navigation ===== */
  .top-nav {
    background: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: var(--shadow-sm);
  }

  .nav-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--spacing-xl);
    height: 64px;
    max-width: 1440px;
    margin: 0 auto;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  .brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-container) !important;
    letter-spacing: -0.02em;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    height: 64px;
  }

  .nav-link {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted) !important;
    letter-spacing: 0.02em;
    transition: color var(--transition-fast);
    border-bottom: 2px solid transparent;
    padding-bottom: 2px;
  }

  .nav-link:hover {
    color: var(--primary-container) !important;
  }

  .nav-link.active {
    color: var(--primary-container) !important;
    border-bottom-color: var(--primary-container);
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .nav-icon-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: var(--spacing-sm);
    border-radius: 50%;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-icon-btn:hover {
    color: var(--primary-container);
    background: var(--surface-hover);
  }

  /* ===== Main Layout ===== */
  .cinema-layout {
    display: flex;
    flex: 1;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  /* ===== Movie Sidebar ===== */
  .movie-sidebar {
    width: 280px;
    flex-shrink: 0;
    background: #0e0e0f;
    border-right: 1px solid var(--border-color);
    overflow-y: auto;
    height: calc(100vh - 64px);
    display: none;
  }

  @media (min-width: 1024px) {
    .movie-sidebar {
      display: flex;
      flex-direction: column;
    }
  }

  .sidebar-header {
    padding: var(--spacing-md) var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    background: #0e0e0f;
    z-index: 5;
  }

  .sidebar-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .movie-list {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .movie-card {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    background: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    color: var(--text-main);
    font-family: inherit;
  }

  .movie-card:hover {
    background: var(--surface-hover);
  }

  .movie-card.active {
    background: var(--surface-high);
    border-color: rgba(81, 69, 50, 0.5);
    box-shadow: var(--shadow-sm);
  }

  .movie-poster {
    width: 64px;
    height: 96px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
    background: var(--surface-high);
  }

  .movie-card:not(.active) .movie-poster {
    opacity: 0.8;
  }

  .movie-card:hover .movie-poster {
    opacity: 1;
  }

  .movie-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .movie-title {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .movie-meta {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .movie-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 0.7rem;
    color: var(--text-muted);
  }

  .star-icon {
    font-size: 14px !important;
    color: var(--primary-container);
  }

  /* ===== Center Content ===== */
  .center-content {
    flex: 1;
    padding: var(--spacing-xl);
    overflow-y: auto;
    height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .movie-header {
    width: 100%;
    margin-bottom: var(--spacing-lg);
  }

  .movie-header h1 {
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .showtime-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-muted);
    margin-top: var(--spacing-sm);
    font-size: 1rem;
  }

  .showtime-chips {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    flex-wrap: wrap;
  }

  .chip {
    padding: 6px 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-muted);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-family: inherit;
  }

  .chip:hover {
    background: var(--surface-hover);
    color: var(--text-main);
  }

  .chip.active {
    background: var(--primary-container);
    color: var(--text-on-primary);
    border-color: var(--primary-container);
  }

  /* ===== Summary Sidebar ===== */
  .summary-sidebar {
    width: 320px;
    flex-shrink: 0;
    background: #0e0e0f;
    border-left: 1px solid var(--border-color);
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
  }

  .summary-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
  }

  .summary-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: var(--spacing-lg);
  }

  .ticket-card {
    background: var(--surface-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
  }

  .ticket-card h3 {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }

  .empty-msg {
    color: rgba(255, 255, 255, 0.3);
    font-style: italic;
    font-size: 0.9rem;
    padding: var(--spacing-sm) 0;
  }

  .ticket-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border-color);
  }

  .ticket-row:last-child {
    border-bottom: none;
  }

  .ticket-seat {
    color: var(--text-muted);
    font-size: 1rem;
  }

  .ticket-price {
    font-weight: 500;
    font-size: 1rem;
  }

  .total-section {
    margin-top: auto;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: var(--spacing-md);
  }

  .total-label {
    font-size: 1.125rem;
    color: var(--text-muted);
  }

  .total-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-container);
  }

  .buy-btn {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: none;
    background: var(--primary-container);
    color: var(--text-on-primary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    box-shadow: var(--shadow-md);
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .buy-btn:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  .buy-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .tax-note {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: var(--spacing-md);
  }

  /* ===== Responsive ===== */
  @media (max-width: 1024px) {
    .cinema-layout {
      flex-direction: column;
    }

    .center-content {
      height: auto;
    }

    .summary-sidebar {
      width: 100%;
      height: auto;
      position: static;
    }
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }

    .movie-header h1 {
      font-size: 1.5rem;
    }
  }
</style>
