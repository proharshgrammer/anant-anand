import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string or Date into a localized short date.
 * e.g. "18 Jun 2026"
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return String(date);
  }
}

/**
 * Format a date string relative to now.
 * e.g. "2 days ago", "just now", "3 months ago"
 */
export function formatRelativeDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  try {
    const d = new Date(date);
    const diffMs = Date.now() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    return formatDate(date);
  } catch {
    return formatDate(date);
  }
}
