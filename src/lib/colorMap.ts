/**
 * Single source of truth for status/semantic color → Tailwind class mapping.
 * indigo = primary/active, emerald = success/approved, amber = pending/caution,
 * rose = rejected/critical, orange = escalated. Never inline ad-hoc colors —
 * every badge/chip/progress fill in the app should resolve through this map.
 */
export type SemanticTone = 'primary' | 'success' | 'pending' | 'critical' | 'escalated' | 'neutral'

interface ToneClasses {
  text: string
  bg: string
  border: string
  dot: string
  fill: string
}

export const TONE_MAP: Record<SemanticTone, ToneClasses> = {
  primary: {
    text: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    fill: 'bg-indigo-500',
  },
  success: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    fill: 'bg-emerald-500',
  },
  pending: {
    text: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    fill: 'bg-amber-500',
  },
  critical: {
    text: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    fill: 'bg-rose-500',
  },
  escalated: {
    text: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
    fill: 'bg-orange-500',
  },
  neutral: {
    text: 'text-slate-600',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    fill: 'bg-slate-400',
  },
}

export type DecisionStatusKey = 'pending' | 'approved' | 'rejected' | 'escalated' | 'auto_approved'

export const STATUS_TONE: Record<DecisionStatusKey, SemanticTone> = {
  pending: 'pending',
  approved: 'success',
  rejected: 'critical',
  escalated: 'escalated',
  auto_approved: 'primary',
}

export const STATUS_LABEL: Record<DecisionStatusKey, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  escalated: 'Escalated',
  auto_approved: 'Auto-Approved',
}

export type PillarKey = 'onboarding' | 'servicing' | 'regulatory' | 'memory'

/** Pillars are not a status, so they share one neutral identity color (indigo) — icon differentiates. */
export const PILLAR_TONE: Record<PillarKey, SemanticTone> = {
  onboarding: 'primary',
  servicing: 'primary',
  regulatory: 'primary',
  memory: 'primary',
}

/** Raw hex per tone — for contexts that can't take a Tailwind class (recharts fills/strokes, inline styles). */
export const TONE_HEX: Record<SemanticTone, string> = {
  primary: '#6366f1',
  success: '#10b981',
  pending: '#f59e0b',
  critical: '#f43f5e',
  escalated: '#fb923c',
  neutral: '#94a3b8',
}

/** Ordered indigo shades for ranked/proportional breakdowns that aren't tied to a status (e.g. risk bands). */
export const ORDERED_PALETTE = ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc']

export type KPIStatusKey = 'on_track' | 'near_target' | 'at_risk'

/** Maps a KPI's health status to a HeroUI Chip `color` and the shared tone used for its label text. */
export const KPI_STATUS: Record<KPIStatusKey, { chipColor: 'success' | 'accent' | 'warning'; tone: SemanticTone; label: string }> = {
  on_track: { chipColor: 'success', tone: 'success', label: 'On Track' },
  near_target: { chipColor: 'accent', tone: 'primary', label: 'Near Target' },
  at_risk: { chipColor: 'warning', tone: 'pending', label: 'At Risk' },
}
