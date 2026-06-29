import { cn } from '@/lib/utils'
import { TONE_MAP, type SemanticTone } from '@/lib/colorMap'

interface ProgressBarProps {
  value: number
  tone?: SemanticTone
  /** Raw hex fill — takes precedence over `tone`. Use for ranked/ordered breakdowns (e.g. risk bands). */
  colorHex?: string
  /** Floor applied to the rendered width so zero-count rows still show a visible sliver. */
  minWidth?: number
  className?: string
}

/** Thin confidence/progress indicator — h-1.5 track with a colored fill. */
export function ProgressBar({ value, tone = 'primary', colorHex, minWidth = 0, className }: ProgressBarProps) {
  const pct = Math.max(minWidth, Math.min(100, value))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-slate-100', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-300', !colorHex && TONE_MAP[tone].fill)}
        style={{ width: `${pct}%`, backgroundColor: colorHex }}
      />
    </div>
  )
}
