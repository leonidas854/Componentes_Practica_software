<script lang="ts">
  /**
   * Componente visual: Campo de entrada.
   * PROPIEDADES: value (bindable), type, label, placeholder, disabled, min, max, step, error, hint.
   * EVENTOS: input, change, keydown, focus, blur.
   */
  interface InputProps {
    value?: string | number;
    type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time' | 'search' | 'tel';
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    maxlength?: number;
    error?: string;
    hint?: string;
    icon?: string;
    name?: string;
    id?: string;
    class?: string;
    oninput?: (event: Event) => void;
    onchange?: (event: Event) => void;
    onkeydown?: (event: KeyboardEvent) => void;
    onfocus?: (event: FocusEvent) => void;
    onblur?: (event: FocusEvent) => void;
  }

  let {
    value = $bindable(''),
    type = 'text',
    label,
    placeholder = '',
    disabled = false,
    required = false,
    min,
    max,
    step,
    maxlength,
    error = '',
    hint = '',
    icon,
    name,
    id = `input-${Math.random().toString(36).slice(2, 9)}`,
    class: className = '',
    oninput,
    onchange,
    onkeydown,
    onfocus,
    onblur
  }: InputProps = $props();
</script>

<div class="input-wrapper {className}" class:has-error={!!error}>
  {#if label}
    <label for={id}>
      {label}
      {#if required}<span class="required-mark" aria-hidden="true">*</span>{/if}
    </label>
  {/if}

  <div class="input-shell">
    {#if icon}
      <span class="material-symbols-outlined input-icon" aria-hidden="true">{icon}</span>
    {/if}
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {disabled}
      {required}
      {min}
      {max}
      {step}
      {maxlength}
      class:with-icon={!!icon}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      bind:value
      {oninput}
      {onchange}
      {onkeydown}
      {onfocus}
      {onblur}
    />
  </div>

  {#if error}
    <p class="field-error" id="{id}-error" role="alert">{error}</p>
  {:else if hint}
    <p class="field-hint" id="{id}-hint">{hint}</p>
  {/if}
</div>

<style>
  .input-wrapper {
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

  .required-mark {
    color: var(--danger-color);
    margin-left: 2px;
  }

  .input-shell {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 10px;
    font-size: 18px;
    color: var(--text-muted);
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 10px var(--spacing-md);
    background-color: var(--surface-low);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-main);
    font-family: var(--font-family);
    font-size: 0.9rem;
    transition: all var(--transition-fast);
    outline: none;
  }

  input.with-icon {
    padding-left: 36px;
  }

  input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px var(--primary-glow);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .has-error input {
    border-color: var(--danger-color);
  }

  .has-error input:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
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
