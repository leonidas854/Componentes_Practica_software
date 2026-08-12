<script lang="ts">
  let { 
    value = $bindable(''), 
    type = 'text', 
    label, 
    placeholder = '', 
    disabled = false,
    min,
    max,
    class: className = '',
    id = `input-${Math.random().toString(36).substring(2, 9)}`,
    oninput,
    onchange
  } = $props<{
    value?: string | number;
    type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time';
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    min?: number | string;
    max?: number | string;
    class?: string;
    id?: string;
    oninput?: (e: Event) => void;
    onchange?: (e: Event) => void;
  }>();
</script>

<div class="input-wrapper {className}">
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <input 
    {id}
    {type} 
    bind:value 
    {placeholder} 
    {disabled}
    {min}
    {max}
    {oninput}
    {onchange}
  />
</div>

<style>
  .input-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    width: 100%;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-muted);
  }

  input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: rgba(11, 15, 25, 0.5);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-main);
    font-family: var(--font-family);
    font-size: var(--font-size-base);
    transition: all var(--transition-fast);
    outline: none;
  }

  input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-glow);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
