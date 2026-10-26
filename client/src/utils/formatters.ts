/**
 * Formats a number to Indian Rupee (INR) currency representation
 * e.g. 1500000 -> "₹15,00,000"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a YYYY-MM-DD or ISO string into a human-readable date
 * e.g. "2026-12-18" -> "18 Dec 2026"
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Calculates remaining days until event date
 */
export function getDaysUntil(dateString: string): number {
  try {
    const target = new Date(dateString).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

/**
 * Formats a fraction or ratio as percentage
 */
export function formatPercentage(value: number, total: number): string {
  if (total <= 0) return '0%';
  const pct = (value / total) * 100;
  return `${pct.toFixed(1)}%`;
}
