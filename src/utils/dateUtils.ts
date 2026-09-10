// ── Constants ────────────────────────────────────────────────────────────────

/** Pixels per hour in the calendar grid */
export const HOUR_HEIGHT = 60;

/** Pixels per minute */
export const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

/** Total minutes in a day */
export const TOTAL_MINUTES = 24 * 60;

/** Snap interval in minutes */
export const SNAP_MINUTES = 15;

// ── Date helpers ─────────────────────────────────────────────────────────────

/** Snap a minute value to the nearest SNAP_MINUTES interval */
export function snapToGrid(minutes: number): number {
  return Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Convert a base day + minutes-from-midnight into a full Date */
export function minutesToDate(baseDay: Date, minutes: number): Date {
  const d = new Date(baseDay);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(minutes);
  return d;
}

/** Get minutes from midnight for a given Date */
export function dateToMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

/** Generate a random short ID */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Return an array of 7 consecutive days starting from `from` (time zeroed) */
export function get7Days(from: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

/** Format a Date to "HH:mm" */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

/** Format a Date to local datetime-local input value (YYYY-MM-DDTHH:mm) */
export function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Parse a datetime-local input value to a Date */
export function fromLocalInputValue(value: string): Date {
  return new Date(value);
}
