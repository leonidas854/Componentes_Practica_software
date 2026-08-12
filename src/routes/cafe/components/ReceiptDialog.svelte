<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import { formatCurrency } from '$lib/utils/format';
  import type { Receipt } from '../models/Order.svelte';

  /**
   * Componente visual: Comprobante del pedido.
   * Muestra el resumen exigido por la práctica: qué productos se pidieron,
   * en qué cantidad y con qué importe.
   * PROPIEDADES: open, receipt.
   * EVENTOS: click (cerrar / nuevo pedido).
   */
  interface ReceiptDialogProps {
    open: boolean;
    receipt: Receipt | null;
    onClose: () => void;
    onNewOrder: () => void;
  }

  let { open, receipt, onClose, onNewOrder }: ReceiptDialogProps = $props();
</script>

<Modal
  {open}
  size="sm"
  title="Pedido registrado"
  subtitle={receipt ? `Comprobante #${receipt.number}` : ''}
  {onClose}
>
  {#if receipt}
    <div class="receipt">
      <div class="receipt-head">
        <span class="material-symbols-outlined check-icon">check_circle</span>
        <p class="receipt-mode">
          {receipt.serviceMode === 'dine-in' ? 'Consumo en local' : 'Para llevar'}
        </p>
      </div>

      <table class="receipt-table">
        <thead>
          <tr>
            <th scope="col">Producto</th>
            <th scope="col" class="num">Cant.</th>
            <th scope="col" class="num">Importe</th>
          </tr>
        </thead>
        <tbody>
          {#each receipt.lines as line (line.name)}
            <tr>
              <td>
                <span class="item-name">{line.name}</span>
                <span class="item-unit">{formatCurrency(line.unitPrice)} c/u</span>
                {#if line.note}
                  <span class="item-note">“{line.note}”</span>
                {/if}
              </td>
              <td class="num">{line.quantity}</td>
              <td class="num">{formatCurrency(line.lineTotal)}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="receipt-totals">
        <div class="receipt-row">
          <span>Subtotal</span>
          <span>{formatCurrency(receipt.totals.subtotal)}</span>
        </div>
        {#if receipt.totals.discount > 0}
          <div class="receipt-row discount">
            <span>Descuento</span>
            <span>−{formatCurrency(receipt.totals.discount)}</span>
          </div>
        {/if}
        <div class="receipt-row">
          <span>Impuesto (8 %)</span>
          <span>{formatCurrency(receipt.totals.tax)}</span>
        </div>
        <div class="receipt-row grand">
          <span>Total cobrado</span>
          <span>{formatCurrency(receipt.totals.total)}</span>
        </div>
      </div>
    </div>
  {/if}

  {#snippet footer()}
    <Button variant="secondary" onclick={onClose}>Cerrar</Button>
    <Button variant="primary" onclick={onNewOrder}>Nuevo pedido</Button>
  {/snippet}
</Modal>

<style>
  .receipt {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .receipt-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .check-icon {
    font-size: 44px !important;
    color: var(--success-color);
  }

  .receipt-mode {
    font-size: 0.85rem;
    color: var(--text-muted);
    font-weight: 600;
  }

  .receipt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }

  .receipt-table th {
    text-align: left;
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--border-color);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  .receipt-table td {
    padding: 10px 0;
    border-bottom: 1px solid var(--border-color);
    vertical-align: top;
  }

  .num {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .item-name {
    display: block;
    font-weight: 600;
  }

  .item-unit {
    display: block;
    font-size: 0.72rem;
    color: var(--text-muted);
  }

  .item-note {
    display: block;
    font-size: 0.72rem;
    color: var(--text-muted);
    font-style: italic;
    margin-top: 2px;
  }

  .receipt-totals {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .receipt-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .receipt-row.discount {
    color: var(--success-color);
    font-weight: 600;
  }

  .receipt-row.grand {
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    border-top: 1px solid var(--border-color);
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
  }
</style>
