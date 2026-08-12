<script lang="ts">
  /**
   * Componente visual: Lista desplegable.
   * PROPIEDADES: value (bindable), options, label, disabled, error.
   * EVENTOS: change, focus, blur.
   */
  export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
  }

  interface SelectProps {
    value?: string;
    options: SelectOption[];
    label?: string;
    disabled?: boolean;
    error?: string;
    hint?: string;
    name?: string;
    id?: string;
    class?: string;
    onchange?: (event: Event) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    value = $bindable(''),
    options,
    label,
    disabled = false,
    error = '',
    hint = '',
    name,
    id = `select-${Math.random().toString(36).slice(2, 9)}`,
    class: className = '',
    onchange,
    onfocus,
    onblur
  }: SelectProps = $props();
</script>

<div class="select-wrapper {className}" class:has-error={!!error}>
  {#if label}
    <label for={id}>{label}</label>
  {/if}

  <div class="select-shell">
    <select
      {id}
      {name}
      {disabled}
      aria-invalid={!!error}
      bind:value
      {onchange}
      {onfocus}
      {onblur}
    >
      {#each options as option (option.value)}
        <option value={option.value} disabled={option.disabled}>{option.label}</option>
      {/each}
    </select>
    <span class="material-symbols-outlined select-arrow" aria-hidden="true">expand_more</span>
  </div>

  {#if error}
    <p class="field-error" role="alert">{error}</p>
  {:else if hint}
    <p class="field-hint">{hint}</p>
  {/if}
</div>

<style>
  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;
  }

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-muted);
  }

  .select-shell {
    position: relative;
    display: flex;
    align-items: center;
  }

  select {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    padding: 10px 36px 10px var(--spacing-md);
    background-color: var(--surface-low);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-main);
    font-family: var(--font-family);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all var(--transition-fast);
    outline: none;
  }

  select:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-glow);
  }

  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select-arrow {
    position: absolute;
    right: 10px;
    font-size: 20px;
    color: var(--text-muted);
    pointer-events: none;
  }

  .has-error select {
    border-color: var(--danger-color);
  }

  .field-error {
    font-size: 0.75rem;
    color: var(--danger-color);
    font-weight: 500;
  }

  .field-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
  }
</style>
