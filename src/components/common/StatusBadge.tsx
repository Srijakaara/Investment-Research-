import { cn } from '@/lib/utils'
import type { DecisionStatus } from '@/types/decision'
import { Clock, CheckCircle2, XCircle, AlertTriangle, Zap } from 'lucide-react'

const ICON_MAP = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  escalated: AlertTriangle,
  auto_approved: Zap,
}

const MAP: Record<
  DecisionStatus | 'auto_approved',
  { label: string; containerClass: string; iconClass: string; pulseColor: string }
> = {
  pending: {
    label: 'Pending',
    containerClass: 'text-pending',
    iconClass: 'text-pending',
    pulseColor: 'bg-pending/40',
  },
  approved: {
    label: 'Approved',
    containerClass: 'text-approved',
    iconClass: 'text-approved',
    pulseColor: 'bg-approved/40',
  },
  rejected: {
    label: 'Rejected',
    containerClass: 'text-rejected',
    iconClass: 'text-rejected',
    pulseColor: 'bg-rejected/40',
  },
  escalated: {
    label: 'Escalated',
    containerClass: 'text-escalated',
    iconClass: 'text-escalated',
    pulseColor: 'bg-escalated/40',
  },
  auto_approved: {
    label: 'Auto-Approved',
    containerClass: 'text-gray-600',
    iconClass: 'text-gray-500',
    pulseColor: 'bg-gray-400/40',
  },
}

interface StatusBadgeProps {
  status: DecisionStatus | 'auto_approved'
  className?: string
  showDot?: boolean
}

export function StatusBadge({ status, className, showDot = true }: StatusBadgeProps) {
  const cfg = MAP[status]
  const Icon = ICON_MAP[status]

  // High attention status (pending or escalated) triggers pulse animation
  const shouldAnimate = status === 'pending' || status === 'escalated'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-bold tracking-tight whitespace-nowrap select-none transition-all duration-200',
        cfg.containerClass,
        className,
      )}
    >
      {showDot && (
        <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center">
          {shouldAnimate && (
            <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', cfg.pulseColor)} />
          )}
          <Icon className={cn('relative h-3.5 w-3.5', cfg.iconClass)} />
        </span>
      )}
      {cfg.label}
    </span>
  )
}
