import { RefreshCw } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onRefresh?: () => void
}

/** Reused identically at the top of every internal page — title/subtitle left, status/actions right. */
export function Header({ title, subtitle, actions, onRefresh }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card/60 px-8 backdrop-blur-sm">
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[17px] font-semibold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 truncate text-[12.5px] text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        {onRefresh && (
          <button
            onClick={onRefresh}
            title="Refresh page data"
            className="grid h-9 w-9 place-items-center rounded text-slate-500 transition-colors hover:bg-slate-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  )
}
