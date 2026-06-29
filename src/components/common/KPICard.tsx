import { Card, ChipRoot, ChipLabel } from '@heroui/react'
import { cn } from '@/lib/utils'
import { KPI_STATUS, type KPIStatusKey } from '@/lib/colorMap'
import { ProgressBar } from '@/components/common/ProgressBar'
import type { KPI } from '@/types/kpi'

interface KPICardProps {
  kpi: KPI
  onClick?: (kpi: KPI) => void
}

function formatValue(kpi: KPI): string {
  if (kpi.unit === 'hours') return `${kpi.current.toFixed(1)}h`
  if (kpi.unit === 'percent_reduction') return `${100 - kpi.current}% reduction`
  return String(kpi.current)
}

function getProgress(kpi: KPI): number {
  if (kpi.unit === 'hours' || kpi.unit === 'percent_reduction') {
    const totalReduction = kpi.baseline - kpi.target
    const achieved = kpi.baseline - kpi.current
    return Math.min(100, Math.max(0, (achieved / totalReduction) * 100))
  }
  return 0
}

export function KPICard({ kpi, onClick }: KPICardProps) {
  const statusKey = (kpi.status in KPI_STATUS ? kpi.status : 'on_track') as KPIStatusKey
  const status = KPI_STATUS[statusKey]
  const progress = getProgress(kpi)

  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick ? () => onClick(kpi) : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick(kpi)
            }
          : undefined
      }
      title={onClick ? `View ${kpi.label} decisions in the Workbench` : undefined}
      className={cn(
        'flex h-[100px] flex-col justify-between gap-1.5 overflow-hidden p-3.5',
        onClick && 'cursor-pointer hover:bg-slate-50/60',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate text-[11px] text-slate-500">{kpi.label}</p>
        <ChipRoot variant="soft" size="sm" color={status.chipColor} className="shrink-0 !px-1.5 !py-0">
          <ChipLabel className="text-[9px] whitespace-nowrap">{status.label}</ChipLabel>
        </ChipRoot>
      </div>
      <p className="nums truncate text-[18px] font-semibold tracking-tight text-slate-900">{formatValue(kpi)}</p>
      <ProgressBar value={progress} />
    </Card>
  )
}
