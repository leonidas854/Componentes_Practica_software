<script lang="ts">
  /**
   * Componente visual: Selector de cantidad (- N +).
   * PROPIEDADES: value, min, max, size, disabled.
   * EVENTOS: click (botones), change (escritura directa de la cantidad).
   */
  interface QuantityStepperProps {
    value: number;
    min?: number;
    max?: number;
    size?: 'sm' | 'md';
    disabled?: boolean;
    editable?: boolean;
    label?: string;
    onChange: (nextValue: number) => void;
  }

  let {
    value,
    min = 0,
    max = 99,
    size = 'md',
    disabled = false,
    editable = false,
    label = 'cantidad',
    onChange
  }: QuantityStepperProps = $props();

  let canDecrease = $derived(!disabled && value > min);
  let canIncrease = $derived(!disabled && value < max);

  function decrease() {
    if (canDecrease) onChange(value - 1);
  }

  function increase() {
    if (canIncrease) onChange(value + 1);
  }

  /** EVENTO CHANGE: permite teclear la cantidad y la acota al rango permitido. */
  function handleDirectEdit(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const parsed = Number.parseInt(input.value, 10);
    const next = Number.isNaN(parsed) ? min : Math.min(max, Math.max(min, parsed));
    input.value = String(next);
    onChange(next);
  }
</script>

<div class="stepper stepper-{size}" class:disabled>
  <button
    type="button"
    class="step-btn"
    disabled={!canDecrease}
    onclick={decrease}
    aria-label="Disminuir {label}"
  >
    <span class="material-symbols-outlined">remove</span>
  </button>

  {#if editable}
    <input
      class="step-value"
      type="number"
      {min}
      {max}
      {disabled}
      aria-label={label}
      value={value}
      onchange={handleDirectEdit}
    />
  {:else}
    <span class="step-value" aria-live="polite">{value}</span>
  {/if}

  <button
    type="button"
    class="step-btn"
    disabled={!canIncrease}
    onclick={increase}
    aria-label="Aumentar {label}"
  >
    <span class="material-symbols-outlined">add</span>
  </button>
</div>

<style>
  .stepper {
    display: inline-flex;
    align-items: center;
    background: var(--surface-high);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-full);
    overflow: hidden;
  }

  .stepper.disabled {
    opacity: 0.5;
  }

  .step-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--text-main);
    cursor: pointer;
    transition: background var(--transition-fast);
  }

  .step-btn:hover:not(:disabled) {
    background: var(--surface-hover);
  }

  .step-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .step-value {
    text-align: center;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--text-main);
    background: transparent;
    border: none;
    font-family: var(--font-family);
  }

  /* Oculta las flechas nativas del input numérico */
  input.step-value::-webkit-outer-spin-button,
  input.step-value::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.step-value {
    -moz-appearance: textfield;
    appearance: textfield;
    outline: none;
  }

  /* Tamaños */
  .stepper-sm .step-btn {
    width: 28px;
    height: 28px;
  }
  .stepper-sm .step-btn :global(.material-symbols-outlined) {
    font-size: 16px;
  }
  .stepper-sm .step-value {
    width: 30px;
    font-size: 0.8rem;
  }

  .stepper-md .step-btn {
    width: 34px;
    height: 34px;
  }
  .stepper-md .step-btn :global(.material-symbols-outlined) {
    font-size: 18px;
  }
  .stepper-md .step-value {
    width: 36px;
    font-size: 0.9rem;
  }
</style>
