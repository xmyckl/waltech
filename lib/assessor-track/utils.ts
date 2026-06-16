import type { KSBStatus, LearnerStatus, AlertSeverity } from '@/types/assessor-track';

/** Today's date as ISO string — single source of truth for date comparisons. */
export const TODAY = new Date().toISOString().slice(0, 10);

/** OTJ completion percentage, rounded to nearest integer. */
export function otjPct(logged: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((logged / target) * 100);
}

/** Number of calendar days between two ISO date strings. Negative = past. */
export function diffDays(from: string, to: string): number {
  return Math.ceil(
    (new Date(to).getTime() - new Date(from).getTime()) / 86_400_000,
  );
}

/** CSS class suffix for a learner status badge. */
export function statusBadgeClass(status: LearnerStatus | string): string {
  const map: Record<string, string> = {
    'on-track': 'at-badge--green',
    'at-risk':  'at-badge--amber',
    'behind':   'at-badge--red',
  };
  return map[status] ?? 'at-badge--grey';
}

/** CSS class suffix for a KSB status badge. */
export function ksbBadgeClass(status: KSBStatus): string {
  const map: Record<KSBStatus, string> = {
    'complete':    'at-badge--green',
    'in-progress': 'at-badge--blue',
    'not-started': 'at-badge--grey',
  };
  return map[status];
}

/** CSS class suffix for an alert severity badge. */
export function alertBadgeClass(severity: AlertSeverity): string {
  return severity === 'critical' ? 'at-badge--red' : 'at-badge--amber';
}

/** Progress bar fill colour based on OTJ percentage. */
export function otjFillColour(pct: number): string {
  return pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
}

/** Text/number colour based on OTJ percentage. */
export function otjTextColour(pct: number): string {
  return pct >= 70 ? '#166534' : pct >= 40 ? '#713f12' : '#991b1b';
}

/** Convert a kebab-case review type to a readable label. */
export function typeLabel(type: string): string {
  return type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
}

/** Generate a unique ID with a given prefix. */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** ISO date string for the first day of the current month. */
export function currentMonthStart(): string {
  return `${TODAY.slice(0, 7)}-01`;
}

/** ISO date string for the last day of the current month. */
export function currentMonthEnd(): string {
  const [y, m] = TODAY.split('-').map(Number);
  return new Date(y, m, 0).toISOString().slice(0, 10);
}
