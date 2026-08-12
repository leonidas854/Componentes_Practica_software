<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import TopNav from '$lib/components/TopNav.svelte';
  import { toast } from '$lib/stores/toast.svelte';
  import { formatCurrency, formatHour } from '$lib/utils/format';

  import CheckoutDialog from './components/CheckoutDialog.svelte';
  import MovieList from './components/MovieList.svelte';
  import OrderSummary from './components/OrderSummary.svelte';
  import SeatMap from './components/SeatMap.svelte';
  import ShowtimeSelector from './components/ShowtimeSelector.svelte';

  import { MOVIES, SHOWTIMES, TICKET_TYPES, showtimesForMovie } from './data/catalog';
  import { Auditorium } from './models/Auditorium.svelte';
  import { TicketOrder } from './models/TicketOrder.svelte';
  import type { CustomerDetails, Movie, Showtime } from './models/types';
  import type { Seat } from './models/Seat.svelte';

  /**
   * PRÁCTICA 1 — Venta de entradas de cine.
   * Esta vista sólo coordina: escucha los eventos de los componentes visuales
   * y delega las reglas de negocio en las clases Auditorium y TicketOrder.
   */

  // ----- Estado principal -----
  const INITIAL_MOVIE = MOVIES[0];
  const INITIAL_SHOWTIME = showtimesForMovie(INITIAL_MOVIE.id)[0];

  let selectedMovie = $state<Movie>(INITIAL_MOVIE);
  let selectedShowtime = $state<Showtime>(INITIAL_SHOWTIME);

  /** La sala y el pedido se recrean al cambiar de función. */
  let auditorium = $state<Auditorium>(new Auditorium(INITIAL_SHOWTIME.id));
  let order = $state<TicketOrder>(new TicketOrder(INITIAL_SHOWTIME.basePrice, TICKET_TYPES));

  /** Butaca bajo el cursor (evento mouseenter/mouseleave del mapa). */
  let hoveredSeat = $state<Seat | null>(null);

  let showCheckout = $state(false);

  let availableShowtimes = $derived(showtimesForMovie(selectedMovie.id));

  // ----- Manejadores de eventos -----

  /** Cambia de función: reinicia la sala y el pedido. */
  function selectShowtime(showtime: Showtime) {
    if (showtime.id === selectedShowtime.id) return;
    selectedShowtime = showtime;
    auditorium = new Auditorium(showtime.id);
    order = new TicketOrder(showtime.basePrice, TICKET_TYPES);
    hoveredSeat = null;
  }

  /** EVENTO CLICK (cartelera): cambia de película y salta a su primera función. */
  function selectMovie(movie: Movie) {
    if (movie.id === selectedMovie.id) return;
    selectedMovie = movie;
    selectShowtime(showtimesForMovie(movie.id)[0]);
  }

  /** EVENTO DBLCLICK (cartelera): atajo a la función más temprana de la película. */
  function quickPickEarliest(movie: Movie) {
    selectMovie(movie);
    const earliest = showtimesForMovie(movie.id)[0];
    selectShowtime(earliest);
    toast.show(
      'Función más temprana seleccionada',
      `${movie.title} — ${formatHour(earliest.hour)} (${earliest.format})`
    );
  }

  /** EVENTO CLICK (mapa de butacas): añade o quita la butaca del pedido. */
  function toggleSeat(seat: Seat) {
    if (!seat.isSelectable) return;

    if (order.has(seat.id)) {
      order.removeSeat(seat.id);
      seat.release();
      return;
    }

    const result = order.addSeat(seat);
    if (!result.ok) {
      toast.error('No se pudo añadir la butaca', result.reason ?? '');
      return;
    }
    seat.toggle();
  }

  /** EVENTO CHANGE (resumen): cambia la tarifa de una entrada ya seleccionada. */
  function changeTicketType(seatId: string, ticketTypeId: string) {
    order.setTicketType(seatId, ticketTypeId);
  }

  /** EVENTO CLICK (resumen): quita una butaca desde la lista del pedido. */
  function removeSeat(seatId: string) {
    order.removeSeat(seatId);
    auditorium.findById(seatId)?.release();
  }

  function clearOrder() {
    order.clear();
    auditorium.clearSelection();
    toast.show('Pedido vaciado', 'Todas las butacas quedaron libres.');
  }

  /** EVENTO SUBMIT (diálogo): confirma la compra y marca las butacas como vendidas. */
  function confirmPurchase(customer: CustomerDetails) {
    const seats = order.seatLabels;
    const total = order.total;

    auditorium.confirmSelection();
    order.clear();
    showCheckout = false;

    toast.success(
      '¡Compra realizada!',
      `${selectedMovie.title} · ${formatHour(selectedShowtime.hour)}\n` +
        `Butacas: ${seats}\nTotal: ${formatCurrency(total)}\n` +
        `Entradas enviadas a ${customer.email}`
    );
  }
</script>

<TopNav
  brand="Cine Center"
  brandIcon="movie"
  links={[
    { href: '/cinema', label: 'Cartelera' },
    { href: '/cafe', label: 'Cafetería' },
    { href: '/meetings', label: 'Salas' }
  ]} />

<div class="cinema-layout">
  <!-- Columna izquierda: cartelera -->
  <aside class="left-column scrollbar-hide">
    <MovieList
      movies={MOVIES}
      selectedId={selectedMovie.id}
      onSelect={selectMovie}
      onQuickPick={quickPickEarliest} />
  </aside>

  <!-- Columna central: función y mapa de butacas -->
  <main class="center-column scrollbar-hide">
    <header class="movie-header">
      <div class="movie-heading">
        <h1>{selectedMovie.title}</h1>
        <div class="movie-badges">
          <Badge tone="neutral">{selectedMovie.ageRating}</Badge>
          <Badge tone="neutral" icon="schedule">{selectedMovie.durationMin} min</Badge>
          <Badge tone="primary" icon="star">{selectedMovie.rating}</Badge>
        </div>
      </div>
      <p class="movie-synopsis">{selectedMovie.synopsis}</p>
    </header>

    <ShowtimeSelector
      showtimes={availableShowtimes}
      selectedId={selectedShowtime.id}
      onSelect={selectShowtime} />

    <div class="hall-status">
      <span class="hall-item">
        <span class="material-symbols-outlined" aria-hidden="true">meeting_room</span>
        {selectedShowtime.hall}
      </span>
      <span class="hall-item">
        <span class="material-symbols-outlined" aria-hidden="true">event_seat</span>
        {auditorium.availableCount} libres de {auditorium.totalCount}
      </span>
      <span class="hall-item">
        <span class="material-symbols-outlined" aria-hidden="true">groups</span>
        {auditorium.occupancyPercent}% ocupada
      </span>

      <!-- Vista previa alimentada por los eventos mouseenter / mouseleave -->
      <span class="hover-preview" class:visible={hoveredSeat !== null}>
        {#if hoveredSeat}
          Butaca {hoveredSeat.id} · {hoveredSeat.isVip ? 'VIP' : 'Estándar'} ·
          {formatCurrency(selectedShowtime.basePrice + hoveredSeat.surcharge)}
        {/if}
      </span>
    </div>

    <SeatMap {auditorium} onToggle={toggleSeat} onHover={(seat) => (hoveredSeat = seat)} />
  </main>

  <!-- Columna derecha: resumen del pedido -->
  <div class="right-column">
    <OrderSummary
      {order}
      movie={selectedMovie}
      showtime={selectedShowtime}
      ticketTypes={TICKET_TYPES}
      onChangeTicketType={changeTicketType}
      onRemoveSeat={removeSeat}
      onClear={clearOrder}
      onCheckout={() => (showCheckout = true)} />
  </div>
</div>

<CheckoutDialog
  open={showCheckout}
  {order}
  movie={selectedMovie}
  showtime={selectedShowtime}
  onClose={() => (showCheckout = false)}
  onConfirm={confirmPurchase} />

<style>
  .cinema-layout {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr) 340px;
    flex: 1;
    max-width: 1500px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  .left-column {
    border-right: 1px solid var(--border-color);
    height: calc(100vh - 64px);
    overflow-y: auto;
    position: sticky;
    top: 64px;
  }

  .center-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    height: calc(100vh - 64px);
    overflow-y: auto;
  }

  /* Evita que los hijos se compriman cuando el contenido desborda en vertical. */
  .center-column > :global(*) {
    flex-shrink: 0;
  }

  .right-column {
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
  }

  /* Cabecera de la película */
  .movie-heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex-wrap: wrap;
  }

  .movie-header h1 {
    font-size: 1.9rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .movie-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .movie-synopsis {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 70ch;
    margin-top: var(--spacing-sm);
  }

  /* Estado de la sala */
  .hall-status {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
    padding: 10px var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--surface-low);
    border: 1px solid var(--border-color);
    font-size: 0.8rem;
    color: var(--text-muted);
  }

  .hall-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .hall-item :global(.material-symbols-outlined) {
    font-size: 17px;
  }

  .hover-preview {
    margin-left: auto;
    font-weight: 700;
    color: var(--primary-color);
    opacity: 0;
    transition: opacity var(--transition-fast);
    min-height: 1em;
  }

  .hover-preview.visible {
    opacity: 1;
  }

  /* Responsive */
  /*
     En pantallas medianas la cartelera pasa a ser una tira horizontal
     situada sobre el resto del contenido, en lugar de ocultarse.
  */
  @media (max-width: 1200px) {
    .cinema-layout {
      grid-template-columns: minmax(0, 1fr) 320px;
    }
    .left-column {
      grid-column: 1 / -1;
      position: static;
      height: auto;
      overflow: visible;
      border-right: none;
      border-bottom: 1px solid var(--border-color);
    }
  }

  @media (max-width: 900px) {
    .cinema-layout {
      grid-template-columns: minmax(0, 1fr);
    }
    .center-column,
    .right-column {
      height: auto;
      position: static;
    }
    .right-column {
      border-top: 1px solid var(--border-color);
    }
  }

  @media (max-width: 600px) {
    .center-column {
      padding: var(--spacing-md);
    }
    .movie-header h1 {
      font-size: 1.4rem;
    }
  }
</style>
