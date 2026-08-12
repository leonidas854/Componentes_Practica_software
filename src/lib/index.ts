/**
 * Punto de entrada de la biblioteca compartida ($lib).
 * Reúne los componentes visuales reutilizables y las utilidades comunes
 * para que los tres módulos de la práctica importen desde un único lugar.
 */

// Componentes visuales
export { default as Badge } from './components/Badge.svelte';
export { default as Button } from './components/Button.svelte';
export { default as Card } from './components/Card.svelte';
export { default as EmptyState } from './components/EmptyState.svelte';
export { default as Input } from './components/Input.svelte';
export { default as Modal } from './components/Modal.svelte';
export { default as QuantityStepper } from './components/QuantityStepper.svelte';
export { default as Select } from './components/Select.svelte';
export { default as Toast } from './components/Toast.svelte';
export { default as TopNav } from './components/TopNav.svelte';

// Estado compartido
export { toast } from './stores/toast.svelte';

// Utilidades
export {
  createId,
  formatCurrency,
  formatDateLong,
  formatDuration,
  formatHour,
  toISODate
} from './utils/format';
