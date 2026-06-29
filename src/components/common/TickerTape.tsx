import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Cpu, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface TickerItem {
  id: string
  label: string
  value: string
  change?: string
  isPositive?: boolean
  type: 'market' | 'ai' | 'system'
}

const INITIAL_ITEMS: TickerItem[] = [
  { id: '1', label: 'ASCEND ALPHA FUND', value: 'NAV 142.45', change: '+1.82%', isPositive: true, type: 'market' },
  { id: '2', label: 'NIFTY 50', value: '24,105.65', change: '+0.45%', isPositive: true, type: 'market' },
  { id: '3', label: 'S&P 500', value: '5,420.30', change: '+0.68%', isPositive: true, type: 'market' },
  { id: '4', label: 'NASDAQ', value: '19,120.45', change: '+1.12%', isPositive: true, type: 'market' },
  { id: '5', label: 'BTC/USD', value: '$67,450.00', change: '-0.85%', isPositive: false, type: 'market' },
  { id: '6', label: 'AI RESOLUTION RATE', value: '94.2%', change: 'Target 95%', isPositive: true, type: 'ai' },
  { id: '7', label: 'ACTIVE COGNITIVE AGENTS', value: '8 / 8 Online', isPositive: true, type: 'ai' },
  { id: '8', label: 'DECISION SLA COMPLIANCE', value: '100%', isPositive: true, type: 'system' },
  { id: '9', label: 'AVG TURNAROUND TIME', value: '1.8 hrs', change: '-12%', isPositive: true, type: 'system' },
  { id: '10', label: 'PENDING ESCALATIONS', value: '2 Cases', isPositive: false, type: 'system' },
]

export function TickerTape() {
  const [items, setItems] = useState<TickerItem[]>(INITIAL_ITEMS)

  // Simulate small price fluctuations to look 'live'
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.type !== 'market') return item
          const valNum = parseFloat(item.value.replace(/[^0-9.-]/g, ''))
          const changePercent = (Math.random() - 0.5) * 0.05 // +/- 0.025%
          const newVal = valNum * (1 + changePercent)
          const newChange = (parseFloat(item.change || '0') + changePercent * 100).toFixed(2)

          let formattedValue = item.value
          if (item.value.startsWith('$')) {
            formattedValue = `$${newVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          } else if (item.value.startsWith('NAV')) {
            formattedValue = `NAV ${newVal.toFixed(2)}`
          } else {
            formattedValue = newVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          }

          return {
            ...item,
            value: formattedValue,
            change: `${parseFloat(newChange) >= 0 ? '+' : ''}${newChange}%`,
            isPositive: parseFloat(newChange) >= 0,
          }
        }),
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-white text-gray-600 text-[11px] border-b border-border select-none overflow-hidden h-6 flex items-center z-50">
      <div className="flex items-center shrink-0 bg-primary text-white font-bold h-full px-2.5 gap-1 shadow-md z-10 text-[9px] uppercase tracking-wider">
        <span className="h-1 w-1 bg-white animate-pulse" />
        Live Feed
      </div>

      <div className="relative flex flex-1 overflow-hidden h-full items-center">
        {/* Scrolling container: lists items twice for seamless loop */}
        <div className="flex gap-12 items-center whitespace-nowrap animate-ticker hover:[animation-play-state:paused] cursor-pointer">
          {/* First loop */}
          {items.map((item) => (
            <TickerItemRenderer key={`l1-${item.id}`} item={item} />
          ))}
          {/* Second loop (identical) */}
          {items.map((item) => (
            <TickerItemRenderer key={`l2-${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TickerItemRenderer({ item }: { item: TickerItem }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-bold text-gray-500 tracking-wide uppercase flex items-center gap-1">
        {item.type === 'ai' && <Cpu className="h-2.5 w-2.5 text-gray-500" />}
        {item.type === 'system' && item.isPositive && <CheckCircle2 className="h-2.5 w-2.5 text-gray-500" />}
        {item.type === 'system' && !item.isPositive && <AlertTriangle className="h-2.5 w-2.5 text-primary" />}
        {item.label}
      </span>
      <span className="text-[11px] font-semibold text-black">{item.value}</span>
      {item.change && (
        <span
          className={`flex items-center text-[9px] font-bold ${item.isPositive ? 'text-gray-600' : 'text-primary'}`}
        >
          {item.isPositive ? (
            <TrendingUp className="h-2.5 w-2.5 mr-0.5 shrink-0" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 mr-0.5 shrink-0" />
          )}
          {item.change}
        </span>
      )}
    </div>
  )
}
