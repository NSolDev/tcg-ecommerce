// src/lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice, getInitials, truncateText, formatDate } from './utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      // Verificar que el formato es correcto sin ser demasiado estricto
      expect(formatPrice(49.99)).toContain('49,99');
      expect(formatPrice(0)).toContain('0,00');
      expect(formatPrice(1000)).toContain('1000,00');
    });
  });

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      // Para nombres de una sola palabra, devuelve la primera letra
      expect(getInitials('Jane')).toBe('J');
      expect(getInitials('')).toBe('');
    });
  });

  describe('truncateText', () => {
    it('should truncate text', () => {
      const longText = 'This is a very long text that should be truncated';
      const result = truncateText(longText, 20);
      expect(result.length).toBeLessThanOrEqual(23); // 20 + "..."
      expect(result).toContain('...');
      expect(truncateText('Short text', 50)).toBe('Short text');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toBe('15 de enero de 2024');
    });
  });
});
