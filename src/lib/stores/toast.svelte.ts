/**
 * Estado global de notificaciones (patrón "store" implementado con una clase + runas).
 * Cualquier módulo puede publicar un aviso sin acoplarse al componente que lo dibuja.
 */
export type ToastTone = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  title: string;
  detail: string;
  tone: ToastTone;
}

class ToastStore {
  current = $state<ToastMessage | null>(null);

  #counter = 0;
  #timer: ReturnType<typeof setTimeout> | null = null;

  /** Muestra un aviso y programa su cierre automático. */
  show(title: string, detail = '', tone: ToastTone = 'info', duration = 4000): void {
    this.#counter += 1;
    this.current = { id: this.#counter, title, detail, tone };

    if (this.#timer) clearTimeout(this.#timer);
    this.#timer = setTimeout(() => this.dismiss(), duration);
  }

  success(title: string, detail = ''): void {
    this.show(title, detail, 'success');
  }

  error(title: string, detail = ''): void {
    this.show(title, detail, 'error');
  }

  dismiss(): void {
    if (this.#timer) {
      clearTimeout(this.#timer);
      this.#timer = null;
    }
    this.current = null;
  }
}

export const toast = new ToastStore();
