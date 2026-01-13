import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as Indian Rupee currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "₹10,000" or "₹10L" for lakhs)
 */
export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    // Format in crores (1 crore = 10 million)
    const crores = amount / 10000000;
    return `₹${crores.toFixed(crores >= 10 ? 1 : 2)}Cr`;
  } else if (amount >= 100000) {
    // Format in lakhs (1 lakh = 100,000)
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(lakhs >= 10 ? 1 : 2)}L`;
  } else if (amount >= 1000) {
    // Format in thousands with comma
    return `₹${(amount / 1000).toFixed(1)}K`;
  } else {
    // Format small amounts directly
    return `₹${amount.toLocaleString('en-IN')}`;
  }
}
