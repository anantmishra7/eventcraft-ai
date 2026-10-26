import { describe, it, expect } from 'vitest';
import { formatINR, formatDate, getDaysUntil, formatPercentage } from '../utils/formatters';

describe('Frontend Formatter Utilities', () => {
  it('formatINR should format Indian currency correctly', () => {
    expect(formatINR(1500000)).toMatch(/₹\s?15,00,000/);
    expect(formatINR(0)).toMatch(/₹\s?0/);
  });

  it('formatDate should format valid dates', () => {
    const formatted = formatDate('2026-12-18');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Dec');
  });

  it('getDaysUntil should compute difference from today', () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const days = getDaysUntil(futureDate);
    expect(days).toBeGreaterThanOrEqual(9);
    expect(days).toBeLessThanOrEqual(11);
  });

  it('formatPercentage should compute rounded percentage string', () => {
    expect(formatPercentage(25, 100)).toBe('25.0%');
    expect(formatPercentage(0, 100)).toBe('0.0%');
    expect(formatPercentage(10, 0)).toBe('0%');
  });
});
