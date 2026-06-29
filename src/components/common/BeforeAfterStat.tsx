import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BeforeAfterStatProps {
  label: string
  before: string
  after: string
  delta?: string
  className?: string
}

/** Struck-through old value → bold new value, used for every "AI impact" stat. */
export function BeforeAfterStat({ label, before, after, delta, className }: BeforeAfterStatProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3 py-2', className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="nums text-xs text-muted-foreground line-through">{before}</span>
        <ArrowRight className="h-3 w-3 shrink-0 text-indigo-400" />
        <span className="nums text-sm font-semibold text-foreground">{after}</span>
        {delta && (
          <span className="nums rounded-sm bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
