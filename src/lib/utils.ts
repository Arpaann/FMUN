import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates an unguessable, human-readable delegate reference code.
 * Example: FMUN-2026-X9K2W7
 */
export function generateReferenceCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous 0/O, 1/I
  let code = '';
  const randomBytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return `FMUN-2026-${code}`;
}

/**
 * Generates a 32-byte cryptographically secure random token for temporary reservation holds.
 */
export function generateReservationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a reservation token using SHA-256 for secure storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Formats Nepalese currency (NPR).
 */
export function formatNPR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return 'Coming soon';
  }
  return `NPR ${amount.toLocaleString('en-IN')}`;
}

/**
 * Graceful date formatter with Nepali time / UTC handling.
 */
export function formatDiplomaticDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Coming soon';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Coming soon';
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Coming soon';
  }
}
