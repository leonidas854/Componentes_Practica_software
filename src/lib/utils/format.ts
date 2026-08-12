/**
 * Utilidades de formato compartidas por los tres módulos de la práctica.
 * Se mantienen puras (sin estado) para poder probarlas de forma aislada.
 */

/** Formatea un número como importe monetario: 4.5 -> "$4.50" */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Convierte una hora decimal de 24h a texto de 12h.
 * 9 -> "9:00 AM" | 13.5 -> "1:30 PM" | 12 -> "12:00 PM" | 0 -> "12:00 AM"
 */
export function formatHour(hour: number): string {
  const whole = Math.floor(hour);
  const minutes = Math.round((hour - whole) * 60);
  const suffix = whole >= 12 ? 'PM' : 'AM';
  const display = whole % 12 === 0 ? 12 : whole % 12;
  return `${display}:${minutes.toString().padStart(2, '0')} ${suffix}`;
}

/** Duración en horas decimales a texto legible: 1.5 -> "1 h 30 min" */
export function formatDuration(hours: number): string {
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  if (whole === 0) return `${minutes} min`;
  if (minutes === 0) return `${whole} h`;
  return `${whole} h ${minutes} min`;
}

/** Fecha ISO (YYYY-MM-DD) a texto largo en español. */
export function formatDateLong(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

/** Devuelve la fecha local en formato ISO corto, evitando el desfase de UTC. */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Genera un identificador corto y único para entidades creadas en el cliente. */
let sequence = 0;
export function createId(prefix = 'id'): string {
  sequence += 1;
  return `${prefix}-${Date.now().toString(36)}-${sequence}`;
}
