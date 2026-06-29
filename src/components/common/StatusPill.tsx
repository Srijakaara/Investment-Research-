import { ChipRoot, ChipLabel } from '@heroui/react'
import { cn } from '@/lib/utils'
import { TONE_MAP, STATUS_TONE, STATUS_LABEL, type DecisionStatusKey } from '@/lib/colorMap'

interface StatusPillProps {
  status: DecisionStatusKey
  className?: string
}

/** The one status badge driven entirely by the shared color map — never inline colors here. */
export function StatusPill({ status, className }: StatusPillProps) {
  const tone = TONE_MAP[STATUS_TONE[status]]
  return (
    <ChipRoot
      variant="soft"
      size="sm"
      className={cn('gap-1.5 border font-semibold', tone.bg, tone.text, tone.border, className)}
    >
      <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', tone.dot)} />
      <ChipLabel className="text-[11px]">{STATUS_LABEL[status]}</ChipLabel>
    </ChipRoot>
  )
}
