<script lang="ts">
  import { formatHour } from '$lib/utils/format';
  import { ReservationManager, type TimelineSegment } from '../models/ReservationManager.svelte';
  import type { Reservation } from '../models/Reservation';

  /**
   * Componente visual: Barra horaria de una sala.
   *
   * MANEJO DE EVENTOS:
   *  - click      → reservar un tramo libre / abrir el detalle de uno ocupado
   *  - mouseenter → resaltar el tramo bajo el cursor
   *  - mouseleave → limpiar el resaltado
   */
  interface RoomTimelineProps {
    segments: TimelineSegment[];
    onPickFree: (startHour: number, endHour: number) => void;
    onPickBusy?: (reservation: Reservation) => void;
  }

  let { segments, onPickFree, onPickBusy }: RoomTimelineProps = $props();

  let hovered = $state<TimelineSegment | null>(null);

  /** Marcas horarias cada 3 horas a lo largo de la jornada. */
  const TICKS = Array.from(
    { length: Math.floor(ReservationManager.totalOpenHours / 3) + 1 },
    (_, index) => ReservationManager.OPENING_HOUR + index * 3
  );
</script>

<div class="timeline">
  <div class="timeline-labels" aria-hidden="true">
    {#each TICKS as tick (tick)}
      <span>{formatHour(tick)}</span>
    {/each}
  </div>

  <div class="timeline-bar">
    {#each segments as segment (`${segment.type}-${segment.slot.start}-${segment.slot.end}`)}
      {#if segment.type === 'free'}
        <button
          type="button"
          class="segment free"
          style="width: {segment.widthPercent}%"
          title="Libre {segment.slot.toString()} — clic para reservar"
          aria-label="Reservar de {segment.slot.toString()}"
          onclick={() => onPickFree(segment.slot.start, segment.slot.end)}
          onmouseenter={() => (hovered = segment)}
          onmouseleave={() => (hovered = null)}
        >
          <span class="segment-label">Libre</span>
        </button>
      {:else}
        <button
          type="button"
          class="segment busy"
          style="width: {segment.widthPercent}%"
          title="{segment.reservation?.title} — {segment.slot.toString()}"
          aria-label="Reunión {segment.reservation?.title} de {segment.slot.toString()}"
          onclick={() => segment.reservation && onPickBusy?.(segment.reservation)}
          onmouseenter={() => (hovered = segment)}
          onmouseleave={() => (hovered = null)}
        >
          <span class="segment-label">{segment.reservation?.title ?? 'Ocupada'}</span>
        </button>
      {/if}
    {/each}
  </div>

  <p class="timeline-hint" class:visible={hovered !== null}>
    {#if hovered}
      {hovered.type === 'free'
        ? `Libre ${hovered.slot.toString()} · clic para reservar`
        : `${hovered.reservation?.title} · ${hovered.slot.toString()} · ${hovered.reservation?.organizer}`}
    {/if}
  </p>
</div>

<style>
  .timeline {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }

  .timeline-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: 0.04em;
  }

  .timeline-bar {
    display: flex;
    width: 100%;
    height: 34px;
    border-radius: var(--radius-sm);
    overflow: hidden;
    border: 1px solid var(--border-color);
    background: var(--surface-high);
  }

  .segment {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-width: 0;
    padding: 0 4px;
    border: none;
    border-right: 1px solid var(--surface-color);
    font-family: inherit;
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: filter var(--transition-fast);
    overflow: hidden;
  }

  .segment:last-child {
    border-right: none;
  }

  .segment:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
    z-index: 1;
  }

  .segment-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .segment.free {
    background: color-mix(in srgb, var(--success-color) 22%, var(--surface-low));
    color: var(--text-main);
  }

  .segment.free:hover {
    filter: brightness(1.15);
  }

  .segment.busy {
    background: var(--surface-high);
    color: var(--text-muted);
    cursor: pointer;
  }

  .segment.busy:hover {
    filter: brightness(1.1);
  }

  .timeline-hint {
    font-size: 0.7rem;
    color: var(--text-muted);
    min-height: 1em;
    opacity: 0;
    transition: opacity var(--transition-fast);
  }

  .timeline-hint.visible {
    opacity: 1;
  }
</style>
