<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import Select from '$lib/components/Select.svelte';
  import { formatCurrency, formatDateLong, formatDuration, formatHour } from '$lib/utils/format';

  import { ReservationManager, type IssueField } from '../models/ReservationManager.svelte';
  import type { ReservationDraft } from '../models/Reservation';
  import type { Room } from '../models/Room';
  import { TimeSlot } from '../models/TimeSlot';

  /**
   * Componente visual: Formulario de reserva.
   *
   * MANEJO DE EVENTOS:
   *  - submit → registrar la reserva
   *  - input  → validación en vivo del título y del organizador
   *  - change → horas de inicio/fin y número de asistentes
   *
   * La validación NO se implementa aquí: se delega en ReservationManager,
   * que es quien conoce las reglas de negocio.
   */
  interface ReservationFormProps {
    open: boolean;
    room: Room | null;
    date: string;
    manager: ReservationManager;
    initialStart?: number;
    initialEnd?: number;
    onClose: () => void;
    onSubmit: (draft: ReservationDraft) => void;
  }

  let {
    open,
    room,
    date,
    manager,
    initialStart = ReservationManager.OPENING_HOUR,
    initialEnd = ReservationManager.OPENING_HOUR + 1,
    onClose,
    onSubmit
  }: ReservationFormProps = $props();

  let title = $state('');
  let organizer = $state('');
  let attendees = $state(2);
  // Los valores reales se cargan en el $effect que reacciona a `open`.
  let startHour = $state(ReservationManager.OPENING_HOUR);
  let endHour = $state(ReservationManager.OPENING_HOUR + 1);
  let submitAttempted = $state(false);

  /** Opciones horarias cada 30 minutos dentro del horario de apertura. */
  const HOUR_STEPS = Array.from(
    { length: ReservationManager.totalOpenHours * 2 + 1 },
    (_, index) => ReservationManager.OPENING_HOUR + index * 0.5
  );

  const startOptions = HOUR_STEPS.filter((hour) => hour < ReservationManager.CLOSING_HOUR).map(
    (hour) => ({ value: String(hour), label: formatHour(hour) })
  );

  const endOptions = HOUR_STEPS.filter((hour) => hour > ReservationManager.OPENING_HOUR).map(
    (hour) => ({ value: String(hour), label: formatHour(hour) })
  );

  /** Al abrir el formulario se precargan la sala y la franja elegidas. */
  $effect(() => {
    if (open) {
      title = '';
      organizer = '';
      attendees = 2;
      startHour = initialStart;
      endHour = initialEnd;
      submitAttempted = false;
    }
  });

  let slot = $derived(new TimeSlot(startHour, endHour));

  let draft = $derived<ReservationDraft | null>(
    room
      ? {
          roomId: room.id,
          title,
          organizer,
          date,
          slot,
          attendees
        }
      : null
  );

  /** Problemas detectados por el gestor de reservas, agrupados por campo. */
  let issues = $derived(draft ? manager.validate(draft) : []);
  let isValid = $derived(draft !== null && issues.length === 0);

  function errorFor(field: IssueField): string {
    if (!submitAttempted) return '';
    return issues.find((issue) => issue.field === field)?.message ?? '';
  }

  let slotError = $derived(errorFor('slot'));
  let estimatedCost = $derived(room && slot.isValid ? room.costFor(slot) : 0);

  /** EVENTO SUBMIT. */
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    submitAttempted = true;
    if (!draft || !isValid) return;
    onSubmit(draft);
  }

  /** Al mover la hora de inicio, arrastra la de fin para no invalidar la franja. */
  function handleStartChange(value: string) {
    startHour = Number(value);
    if (endHour <= startHour) {
      endHour = Math.min(startHour + 1, ReservationManager.CLOSING_HOUR);
    }
  }
</script>

<Modal
  {open}
  title="Reservar sala"
  subtitle={room ? `${room.name} · ${formatDateLong(date)}` : ''}
  {onClose}
>
  <form id="reservation-form" class="reservation-form" onsubmit={handleSubmit} novalidate>
    <Input
      label="Título de la reunión"
      placeholder="Revisión de sprint"
      icon="title"
      required
      bind:value={title}
      error={errorFor('title')} />

    <Input
      label="Organiza"
      placeholder="Nombre del responsable"
      icon="person"
      required
      bind:value={organizer}
      error={errorFor('organizer')} />

    <div class="row">
      <Select
        label="Hora de inicio"
        options={startOptions}
        value={String(startHour)}
        onchange={(event) => handleStartChange((event.currentTarget as HTMLSelectElement).value)} />

      <Select
        label="Hora de fin"
        options={endOptions}
        value={String(endHour)}
        onchange={(event) =>
          (endHour = Number((event.currentTarget as HTMLSelectElement).value))} />
    </div>

    {#if slotError}
      <p class="slot-error" role="alert">{slotError}</p>
    {/if}

    <Input
      label="Número de asistentes"
      type="number"
      min={1}
      max={room?.capacity ?? 50}
      icon="groups"
      bind:value={attendees}
      error={errorFor('attendees')}
      hint={room ? `Esta sala admite hasta ${room.capacity} personas.` : ''} />

    <!-- Resumen calculado automáticamente a partir de la franja elegida -->
    <div class="cost-preview" class:invalid={!slot.isValid}>
      <div class="cost-row">
        <span class="cost-label">Duración</span>
        <span>{slot.isValid ? formatDuration(slot.durationHours) : '—'}</span>
      </div>
      <div class="cost-row">
        <span class="cost-label">Franja</span>
        <span>{slot.isValid ? slot.toString() : '—'}</span>
      </div>
      <div class="cost-row total">
        <span class="cost-label">Coste estimado</span>
        <span class="cost-amount">{formatCurrency(estimatedCost)}</span>
      </div>
    </div>
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={onClose}>Cancelar</Button>
    <Button variant="primary" type="submit" form="reservation-form">Confirmar reserva</Button>
  {/snippet}
</Modal>

<style>
  .reservation-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  .slot-error {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--danger-color);
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--danger-color) 10%, transparent);
  }

  .cost-preview {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--surface-low);
    border: 1px solid var(--border-color);
  }

  .cost-preview.invalid {
    opacity: 0.6;
  }

  .cost-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 0.85rem;
  }

  .cost-label {
    color: var(--text-muted);
  }

  .cost-row.total {
    border-top: 1px solid var(--border-color);
    padding-top: 8px;
    font-weight: 700;
  }

  .cost-amount {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  @media (max-width: 520px) {
    .row {
      grid-template-columns: 1fr;
    }
  }
</style>
