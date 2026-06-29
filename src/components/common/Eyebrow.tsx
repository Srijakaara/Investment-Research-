import { ChipRoot, ChipLabel } from '@heroui/react'
import { cn } from '@/lib/utils'

interface EyebrowProps {
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/** Icon + soft chip label shown above a section heading. */
export function Eyebrow({ icon, children, className }: EyebrowProps) {
  return (
    <ChipRoot
      variant="soft"
      size="sm"
      className={cn('!bg-indigo-50 !text-indigo-600 border border-indigo-200 gap-1.5 font-semibold', className)}
    >
      {icon}
      <ChipLabel className="text-[11px] uppercase tracking-wider">{children}</ChipLabel>
    </ChipRoot>
  )
}
