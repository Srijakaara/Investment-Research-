import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ConfidenceBarProps {
  value: number
  showLabel?: boolean
  className?: string
  size?: 'sm' | 'md'
}

function getColor(v: number) {
  if (v >= 0.85) return 'bg-gradient-to-r from-gray-700 to-gray-500 shadow-[0_1px_4px_rgba(0,0,0,0.15)]'
  if (v >= 0.7) return 'bg-gradient-to-r from-black to-gray-700 shadow-[0_1px_4px_rgba(0,0,0,0.20)]'
  return 'bg-gradient-to-r from-primary to-[#ff5a5f] shadow-[0_1px_4px_rgba(229,30,37,0.25)]'
}

function getTextColor(v: number) {
  if (v >= 0.85) return 'text-approved font-bold'
  if (v >= 0.7) return 'text-pending font-bold'
  return 'text-rejected font-bold'
}

export function ConfidenceBar({ value, showLabel = true, className, size = 'md' }: ConfidenceBarProps) {
  const pct = Math.round(value * 100)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      <div
        className={cn(
          'flex-1 rounded-full bg-gray-100 border border-border overflow-hidden',
          size === 'sm' ? 'h-1.5' : 'h-2',
        )}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', getColor(value))}
          style={{ width: animate ? `${pct}%` : '0%' }}
        />
      </div>
      {showLabel && <span className={cn('text-xs tabular-nums w-10 text-right', getTextColor(value))}>{pct}%</span>}
    </div>
  )
}
