<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import { formatCurrency, formatDuration } from '$lib/utils/format';
  import type { Reservation } from '../models/Reservation';
  import type { Room } from '../models/Room';

  /**
   * Componente visual: Agenda del día con las reservas registradas.
   * PROPIEDADES: reservations, rooms, date.
   * EVENTOS: click (cancelar reserva).
   */
  interface AgendaListProps {
    reservations: Reservation[];
    rooms: Room[];
    onCancel: (reservation: Reservation) => void;
  }

  let { reservations, rooms, onCancel }: AgendaListProps = $props();

  function roomFor(roomId: string): Room | undefined {
    return rooms.find((room) => room.id === roomId);
  }

  /** Coste total de la jornada, calculado a partir de las tarifas de cada sala. */
  let dayTotal = $derived(
    reservations.reduce((sum, reservation) => {
      const room = roomFor(reservation.roomId);
      return room ? sum + reservation.costIn(room) : sum;
    }, 0)
  );
</script>

<aside class="agenda">
  <header class="agenda-header">
    <h2>Agenda del día</h2>
    <Badge tone="primary">{reservations.length}</Badge>
  </header>

  <div class="agenda-body scrollbar-hide">
    {#if reservations.length === 0}
      <EmptyState
        icon="event_note"
        title="Sin reuniones"
        description="Elige un tramo libre en la barra horaria de una sala." />
    {:else}
      {#each reservations as reservation (reservation.id)}
        {@const room = roomFor(reservation.roomId)}
        <article class="agenda-item">
          <div class="agenda-time">
            <span class="agenda-hour">{reservation.slot.toString()}</span>
            <span class="agenda-duration">{formatDuration(reservation.durationHours)}</span>
          </div>

          <div class="agenda-main">
            <h3 class="agenda-title">{reservation.title}</h3>
            <p class="agenda-detail">
              {room?.name ?? 'Sala desconocida'} · {reservation.organizer}
            </p>
            <p class="agenda-detail muted">
              {reservation.attendees}
              {reservation.attendees === 1 ? 'asistente' : 'asistentes'}
              {#if room}· {formatCurrency(reservation.costIn(room))}{/if}
            </p>
          </div>

          <button
            type="button"
            class="agenda-cancel"
            onclick={() => onCancel(reservation)}
            aria-label="Cancelar {reservation.title}"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </article>
      {/each}
    {/if}
  </div>

  {#if reservations.length > 0}
    <footer class="agenda-footer">
      <span>Total facturable</span>
      <span class="agenda-total">{formatCurrency(dayTotal)}</span>
    </footer>
  {/if}
</aside>

<style>
  .agenda {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--surface-color);
    border-left: 1px solid var(--border-color);
  }

  .agenda-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
  }

  .agenda-header h2 {
    font-size: 1.15rem;
    font-weight: 700;
  }

  .agenda-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .agenda-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: var(--spacing-sm);
    align-items: flex-start;
    padding: 12px;
    border-radius: var(--radius-sm);
    background: var(--surface-low);
    border: 1px solid var(--border-color);
    border-left: 3px solid var(--primary-color);
  }

  .agenda-time {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 96px;
  }

  .agenda-hour {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--primary-color);
    white-space: nowrap;
  }

  .agenda-duration {
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  .agenda-main {
    min-width: 0;
  }

  .agenda-title {
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .agenda-detail {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .agenda-detail.muted {
    opacity: 0.85;
  }

  .agenda-cancel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .agenda-cancel:hover {
    background: var(--danger-color);
    color: #fff;
  }

  .agenda-cancel :global(.material-symbols-outlined) {
    font-size: 17px;
  }

  .agenda-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    background: var(--surface-low);
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .agenda-total {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
  }

  @media (max-width: 520px) {
    .agenda-item {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .agenda-time {
      grid-column: 1 / -1;
      flex-direction: row;
      gap: var(--spacing-sm);
      align-items: baseline;
    }
  }
</style>
