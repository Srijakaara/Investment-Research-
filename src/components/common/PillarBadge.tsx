import { cn } from '@/lib/utils'
import type { Pillar } from '@/types/decision'
import { UserPlus, Zap, Scale, Cpu } from 'lucide-react'

const MAP: Record<Pillar, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  onboarding: {
    label: 'Onboarding',
    className: 'text-onboarding',
    icon: UserPlus,
  },
  servicing: {
    label: 'Servicing',
    className: 'text-servicing',
    icon: Zap,
  },
  regulatory: {
    label: 'Regulatory',
    className: 'text-regulatory',
    icon: Scale,
  },
  memory: {
    label: 'Memory',
    className: 'text-memory',
    icon: Cpu,
  },
}

interface PillarBadgeProps {
  pillar: Pillar
  className?: string
}

export function PillarBadge({ pillar, className }: PillarBadgeProps) {
  const cfg = MAP[pillar]
  const Icon = cfg.icon
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase select-none transition-all duration-200',
        cfg.className,
        className,
      )}
    >
      <Icon className="h-3 w-3 shrink-0" />
      {cfg.label}
    </span>
  )
}
