<script lang="ts">
  import EmptyState from '$lib/components/EmptyState.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import TopNav from '$lib/components/TopNav.svelte';
  import { toast } from '$lib/stores/toast.svelte';
  import { formatCurrency, formatDateLong } from '$lib/utils/format';

  import AgendaList from './components/AgendaList.svelte';
  import DatePicker from './components/DatePicker.svelte';
  import ReservationForm from './components/ReservationForm.svelte';
  import RoomCard from './components/RoomCard.svelte';

  import { ROOMS, buildCalendar, buildInitialReservations } from './data/rooms';
  import { ReservationManager } from './models/ReservationManager.svelte';
  import type { Reservation, ReservationDraft } from './models/Reservation';
  import type { Room } from './models/Room';

  /**
   * PRÁCTICA 3 — Reserva de salas de reuniones.
   *
   * La vista coordina componentes visuales y eventos; toda la lógica
   * (disponibilidad, colisiones, aforo, coste) vive en las clases del modelo.
   */

  const CALENDAR = buildCalendar(7);
  const manager = new ReservationManager(ROOMS, buildInitialReservations(CALENDAR));

  // ----- Estado -----
  let selectedDate = $state(CALENDAR[0].value);
  let minCapacity = $state('0');
  let searchTerm = $state('');

  let formOpen = $state(false);
  let formRoom = $state<Room | null>(null);
  let formStart = $state(ReservationManager.OPENING_HOUR);
  let formEnd = $state(ReservationManager.OPENING_HOUR + 1);

  const CAPACITY_OPTIONS = [
    { value: '0', label: 'Cualquier aforo' },
    { value: '4', label: '4 personas o más' },
    { value: '10', label: '10 personas o más' },
    { value: '15', label: '15 personas o más' }
  ];

  // ----- Datos derivados -----
  let visibleRooms = $derived(
    ROOMS.filter((room) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesCapacity = room.capacity >= Number(minCapacity);
      const matchesSearch = term === '' || room.name.toLowerCase().includes(term);
      return matchesCapacity && matchesSearch;
    })
  );

  let dayReservations = $derived(manager.forDate(selectedDate));

  // ----- Manejadores de eventos -----

  /** EVENTO CLICK: abre el formulario, opcionalmente con una franja preseleccionada. */
  function openForm(room: Room, startHour?: number, endHour?: number) {
    formRoom = room;

    const start = startHour ?? ReservationManager.OPENING_HOUR;
    // Propone una hora por defecto sin salirse del tramo libre elegido.
    const proposedEnd = Math.min(
      start + 1,
      endHour ?? ReservationManager.CLOSING_HOUR,
      ReservationManager.CLOSING_HOUR
    );

    formStart = start;
    formEnd = proposedEnd > start ? proposedEnd : Math.min(start + 0.5, ReservationManager.CLOSING_HOUR);
    formOpen = true;
  }

  /** EVENTO SUBMIT: delega el alta en el gestor, que aplica las reglas de negocio. */
  function submitReservation(draft: ReservationDraft) {
    const result = manager.add(draft);

    if (!result.ok) {
      toast.error('No se pudo reservar', result.errors.map((issue) => issue.message).join('\n'));
      return;
    }

    formOpen = false;
    const room = manager.getRoom(draft.roomId);
    toast.success(
      'Reserva confirmada',
      `${draft.title} · ${draft.slot.toString()}\n` +
        `${room?.name ?? ''}${room ? ` · ${formatCurrency(room.costFor(draft.slot))}` : ''}`
    );
  }

  /** EVENTO CLICK: cancela una reserva existente. */
  function cancelReservation(reservation: Reservation) {
    if (manager.cancel(reservation.id)) {
      toast.show('Reserva cancelada', `${reservation.title} · ${reservation.slot.toString()}`);
    }
  }

  /** EVENTO CLICK (tramo ocupado de la barra horaria): muestra su detalle. */
  function inspectReservation(reservation: Reservation) {
    const room = manager.getRoom(reservation.roomId);
    toast.show(
      reservation.title,
      `${room?.name ?? ''} · ${reservation.slot.toString()}\n` +
        `Organiza: ${reservation.organizer} · ${reservation.attendees} asistentes`
    );
  }
</script>

<TopNav
  brand="MeetSpace"
  brandIcon="meeting_room"
  links={[
    { href: '/cinema', label: 'Cartelera' },
    { href: '/cafe', label: 'Carta' },
    { href: '/meetings', label: 'Salas' }
  ]} />

<div class="meetings-layout">
  <main class="rooms-column scrollbar-hide">
    <header class="page-header">
      <div>
        <h1>Salas de reuniones</h1>
        <p class="page-subtitle">{formatDateLong(selectedDate)}</p>
      </div>
    </header>

    <DatePicker days={CALENDAR} selected={selectedDate} onSelect={(date) => (selectedDate = date)} />

    <div class="filters">
      <!-- EVENTO INPUT: búsqueda por nombre de sala -->
      <Input
        type="search"
        placeholder="Buscar sala…"
        icon="search"
        class="filter-search"
        bind:value={searchTerm} />

      <!-- EVENTO CHANGE: filtro por aforo mínimo -->
      <Select options={CAPACITY_OPTIONS} class="filter-capacity" bind:value={minCapacity} />
    </div>

    {#if visibleRooms.length === 0}
      <EmptyState
        icon="door_front"
        title="Ninguna sala coincide"
        description="Ajusta el aforo mínimo o cambia el término de búsqueda." />
    {:else}
      <div class="room-list">
        {#each visibleRooms as room (room.id)}
          <RoomCard
            {room}
            segments={manager.timeline(room.id, selectedDate)}
            freeHours={manager.freeHours(room.id, selectedDate)}
            bookingCount={manager.forRoomAndDate(room.id, selectedDate).length}
            onReserve={openForm}
            onInspect={inspectReservation} />
        {/each}
      </div>
    {/if}
  </main>

  <div class="agenda-column">
    <AgendaList reservations={dayReservations} rooms={ROOMS} onCancel={cancelReservation} />
  </div>
</div>

<ReservationForm
  open={formOpen}
  room={formRoom}
  date={selectedDate}
  {manager}
  initialStart={formStart}
  initialEnd={formEnd}
  onClose={() => (formOpen = false)}
  onSubmit={submitReservation} />

<style>
  .meetings-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    flex: 1;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    animation: fadeIn var(--transition-normal);
  }

  .rooms-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    height: calc(100vh - 64px);
    overflow-y: auto;
  }

  /*
     La columna es un contenedor flex de altura fija: sin esto, sus hijos se
     comprimen cuando el listado de salas desborda y el selector de fecha
     aparece recortado.
  */
  .rooms-column > :global(*) {
    flex-shrink: 0;
  }

  .agenda-column {
    height: calc(100vh - 64px);
    position: sticky;
    top: 64px;
  }

  .page-header h1 {
    font-size: 1.9rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .page-subtitle {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-top: 4px;
  }

  /* Sólo la inicial en mayúscula: "Martes, 11 de agosto". */
  .page-subtitle::first-letter {
    text-transform: uppercase;
  }

  .filters {
    display: flex;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .filters :global(.filter-search) {
    max-width: 300px;
  }

  .filters :global(.filter-capacity) {
    max-width: 220px;
  }

  .room-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  @media (max-width: 1000px) {
    .meetings-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    .rooms-column,
    .agenda-column {
      height: auto;
      position: static;
    }

    .agenda-column {
      border-top: 1px solid var(--border-color);
    }
  }

  @media (max-width: 600px) {
    .rooms-column {
      padding: var(--spacing-md);
    }

    .page-header h1 {
      font-size: 1.4rem;
    }

    .filters {
      flex-direction: column;
    }

    .filters :global(.filter-search),
    .filters :global(.filter-capacity) {
      max-width: none;
    }
  }
</style>
