<script lang="ts">
  import Badge from '$lib/components/Badge.svelte';
  import Button from '$lib/components/Button.svelte';
  import { formatCurrency, formatDuration } from '$lib/utils/format';
  import RoomTimeline from './RoomTimeline.svelte';
  import type { Reservation } from '../models/Reservation';
  import type { Room } from '../models/Room';
  import type { TimelineSegment } from '../models/ReservationManager.svelte';

  /**
   * Componente visual: Ficha de sala con su disponibilidad del día.
   * PROPIEDADES: room, segments, freeHours, bookingCount.
   * EVENTOS: click (reservar), delegados desde la barra horaria.
   */
  interface RoomCardProps {
    room: Room;
    segments: TimelineSegment[];
    freeHours: number;
    bookingCount: number;
    onReserve: (room: Room, startHour?: number, endHour?: number) => void;
    onInspect: (reservation: Reservation) => void;
  }

  let { room, segments, freeHours, bookingCount, onReserve, onInspect }: RoomCardProps = $props();

  let isFullyBooked = $derived(freeHours <= 0);
</script>

<article class="room-card">
  <div
    class="room-image"
    style="background-image: url('{room.image}')"
    role="img"
    aria-label="Fotografía de {room.name}">
  </div>

  <div class="room-content">
    <header class="room-header">
      <div class="room-identity">
        <h2 class="room-name">{room.name}</h2>
        <p class="room-meta">{room.description}</p>
        <div class="room-amenities" aria-label="Equipamiento">
          {#each room.amenities as amenity (amenity)}
            <span class="material-symbols-outlined amenity-icon" title={amenity}>{amenity}</span>
          {/each}
        </div>
      </div>

      <div class="room-pricing">
        <span class="room-price">{formatCurrency(room.pricePerHour)}</span>
        <span class="room-price-unit">/ hora</span>
      </div>
    </header>

    <div class="room-status">
      {#if isFullyBooked}
        <Badge tone="danger" icon="event_busy">Sin disponibilidad</Badge>
      {:else}
        <Badge tone="success" icon="event_available">{formatDuration(freeHours)} libres</Badge>
      {/if}
      <Badge tone="neutral" icon="groups">Aforo {room.capacity}</Badge>
      <Badge tone="neutral" icon="calendar_month">
        {bookingCount}
        {bookingCount === 1 ? 'reunión' : 'reuniones'}
      </Badge>
    </div>

    <RoomTimeline
      {segments}
      onPickFree={(start, end) => onReserve(room, start, end)}
      onPickBusy={onInspect} />

    <div class="room-actions">
      <Button variant="primary" size="sm" disabled={isFullyBooked} onclick={() => onReserve(room)}>
        <span class="material-symbols-outlined" style="font-size: 17px;">add</span>
        Reservar sala
      </Button>
    </div>
  </div>
</article>

<style>
  .room-card {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr);
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition-normal);
  }

  .room-card:hover {
    box-shadow: var(--shadow-md);
  }

  .room-image {
    background-size: cover;
    background-position: center;
    border-radius: var(--radius-sm);
    min-height: 150px;
    background-color: var(--surface-high);
  }

  .room-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 0;
  }

  .room-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-md);
  }

  .room-name {
    font-size: 1.2rem;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .room-meta {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .room-amenities {
    display: flex;
    gap: 10px;
    margin-top: var(--spacing-sm);
    color: var(--text-muted);
  }

  .amenity-icon {
    font-size: 19px !important;
  }

  .room-pricing {
    display: flex;
    align-items: baseline;
    gap: 3px;
    flex-shrink: 0;
  }

  .room-price {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text-main);
  }

  .room-price-unit {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .room-status {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .room-actions {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 760px) {
    .room-card {
      grid-template-columns: minmax(0, 1fr);
    }

    .room-image {
      min-height: 120px;
    }
  }
</style>
