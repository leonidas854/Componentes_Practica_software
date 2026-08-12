import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDuration, formatHour, toISODate } from './format';

describe('Utilidades de formato', () => {
  describe('formatCurrency', () => {
    it('siempre muestra dos decimales', () => {
      expect(formatCurrency(4.5)).toBe('$4.50');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(12)).toBe('$12.00');
    });
  });

  describe('formatHour', () => {
    it('convierte horas de 24 h a formato de 12 h', () => {
      expect(formatHour(9)).toBe('9:00 AM');
      expect(formatHour(13.5)).toBe('1:30 PM');
      expect(formatHour(20)).toBe('8:00 PM');
    });

    it('trata correctamente el mediodía y la medianoche', () => {
      expect(formatHour(12)).toBe('12:00 PM');
      expect(formatHour(0)).toBe('12:00 AM');
    });
  });

  describe('formatDuration', () => {
    it('describe duraciones en horas y minutos', () => {
      expect(formatDuration(1.5)).toBe('1 h 30 min');
      expect(formatDuration(2)).toBe('2 h');
      expect(formatDuration(0.5)).toBe('30 min');
    });
  });

  describe('toISODate', () => {
    it('usa la fecha local, sin desplazamiento por UTC', () => {
      // 1 de marzo de 2026 a las 23:30 hora local
      expect(toISODate(new Date(2026, 2, 1, 23, 30))).toBe('2026-03-01');
    });
  });
});
