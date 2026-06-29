import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, unit: 'cr' | 'l' | '' = '') {
  if (unit === 'cr') return `₹${value.toFixed(1)} Cr`
  if (unit === 'l') return `₹${value.toFixed(1)} L`
  return `₹${value.toLocaleString('en-IN')}`
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

export function formatHours(value: number) {
  if (value < 1) return `${Math.round(value * 60)}m`
  return `${value.toFixed(1)}h`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function slaCountdown(deadline: string): { label: string; urgent: boolean } {
  const diff = new Date(deadline).getTime() - Date.now()
  if (diff <= 0) return { label: 'Overdue', urgent: true }
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return { label: `${mins}m left`, urgent: true }
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return { label: `${hrs}h left`, urgent: hrs < 2 }
  const days = Math.floor(hrs / 24)
  return { label: `${days}d left`, urgent: false }
}

export function confidenceColor(score: number): string {
  if (score >= 0.85) return 'text-slate-600'
  if (score >= 0.70) return 'text-black'
  return 'text-primary'
}

export function confidenceBg(score: number): string {
  if (score >= 0.85) return 'bg-slate-400'
  if (score >= 0.70) return 'bg-black'
  return 'bg-primary'
}

export function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms))
}
