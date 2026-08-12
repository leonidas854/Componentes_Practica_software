<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { formatCurrency, formatHour } from '$lib/utils/format';
  import type { TicketOrder } from '../models/TicketOrder.svelte';
  import type { CustomerDetails, Movie, Showtime } from '../models/types';

  /**
   * Componente visual: Diálogo de confirmación de compra.
   *
   * MANEJO DE EVENTOS:
   *  - submit → confirma la compra (formulario con validación)
   *  - input  → valida nombre y correo mientras se escribe
   *  - blur   → marca el campo como "tocado" para no mostrar errores prematuros
   */
  interface CheckoutDialogProps {
    open: boolean;
    order: TicketOrder;
    movie: Movie;
    showtime: Showtime;
    onClose: () => void;
    onConfirm: (customer: CustomerDetails) => void;
  }

  let { open, order, movie, showtime, onClose, onConfirm }: CheckoutDialogProps = $props();

  let name = $state('');
  let email = $state('');
  let touched = $state({ name: false, email: false });

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  let nameError = $derived(
    name.trim().length === 0
      ? 'Escribe el nombre del comprador.'
      : name.trim().length < 3
        ? 'El nombre debe tener al menos 3 caracteres.'
        : ''
  );

  let emailError = $derived(
    email.trim().length === 0
      ? 'Escribe un correo de contacto.'
      : EMAIL_PATTERN.test(email.trim())
        ? ''
        : 'El formato del correo no es válido.'
  );

  let isValid = $derived(nameError === '' && emailError === '');

  /** Al abrir el diálogo se limpia el formulario. */
  $effect(() => {
    if (open) {
      name = '';
      email = '';
      touched = { name: false, email: false };
    }
  });

  /** EVENTO SUBMIT: valida y, si todo es correcto, confirma la compra. */
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    touched = { name: true, email: true };
    if (!isValid) return;
    onConfirm({ name: name.trim(), email: email.trim() });
  }
</script>

<Modal {open} title="Confirmar compra" subtitle="Revisa los datos antes de pagar" {onClose}>
  <form id="checkout-form" class="checkout-form" onsubmit={handleSubmit} novalidate>
    <section class="recap">
      <div class="recap-row">
        <span class="recap-label">Película</span>
        <span class="recap-value">{movie.title}</span>
      </div>
      <div class="recap-row">
        <span class="recap-label">Función</span>
        <span class="recap-value">
          {formatHour(showtime.hour)} · {showtime.format} · {showtime.hall}
        </span>
      </div>
      <div class="recap-row">
        <span class="recap-label">Butacas</span>
        <span class="recap-value">{order.seatLabels}</span>
      </div>
      <div class="recap-row total">
        <span class="recap-label">Total a pagar</span>
        <span class="recap-total">{formatCurrency(order.total)}</span>
      </div>
    </section>

    <div class="fields">
      <Input
        label="Nombre del comprador"
        placeholder="Ana Martínez"
        icon="person"
        required
        bind:value={name}
        error={touched.name ? nameError : ''}
        onblur={() => (touched.name = true)} />

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="ana@correo.com"
        icon="mail"
        required
        bind:value={email}
        error={touched.email ? emailError : ''}
        hint="Enviaremos las entradas a esta dirección."
        onblur={() => (touched.email = true)} />
    </div>
  </form>

  {#snippet footer()}
    <Button variant="secondary" onclick={onClose}>Cancelar</Button>
    <Button variant="primary" type="submit" form="checkout-form" disabled={!isValid}>
      Pagar {formatCurrency(order.total)}
    </Button>
  {/snippet}
</Modal>

<style>
  .checkout-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .recap {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background: var(--surface-low);
    border: 1px solid var(--border-color);
  }

  .recap-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--spacing-md);
    font-size: 0.85rem;
  }

  .recap-label {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .recap-value {
    font-weight: 600;
    text-align: right;
  }

  .recap-row.total {
    border-top: 1px solid var(--border-color);
    padding-top: var(--spacing-sm);
    margin-top: 2px;
  }

  .recap-total {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }
</style>
