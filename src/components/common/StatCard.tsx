import { Card } from '@heroui/react'
import { cn } from '@/lib/utils'
import { TONE_MAP, type SemanticTone } from '@/lib/colorMap'

interface StatCardProps {
  icon?: React.ReactNode
  label: string
  value: React.ReactNode
  /** Tint applied to the icon swatch — resolves through the shared TONE_MAP, never an ad-hoc color. */
  tone?: SemanticTone
  height?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

/** Fixed-height metric card so dashboard/grid rows always align. */
export function StatCard({ icon, label, value, tone = 'primary', height = 'sm', onClick, className }: StatCardProps) {
  const t = TONE_MAP[tone]
  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick()
            }
          : undefined
      }
      className={cn(
        'flex flex-col justify-between gap-1 overflow-hidden p-3.5',
        height === 'sm' ? 'h-[84px]' : 'h-[100px]',
        onClick && 'cursor-pointer transition-colors hover:bg-slate-50/60',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[11px] text-slate-500">{label}</p>
        {icon && (
          <span className={cn('grid h-5 w-5 shrink-0 place-items-center rounded-sm', t.bg, t.text)}>{icon}</span>
        )}
      </div>
      <p className="nums truncate text-[22px] font-semibold tracking-tight text-slate-900">{value}</p>
    </Card>
  )
}
