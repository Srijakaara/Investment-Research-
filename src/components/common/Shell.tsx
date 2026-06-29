import { useState } from 'react'
import { Sidebar } from '@/components/common/Sidebar'
import { TopBar } from '@/components/common/TopBar'
import { TickerTape } from '@/components/common/TickerTape'

const COLLAPSE_KEY = 'ascend-sidebar-collapsed'

interface ShellProps {
  children: React.ReactNode
}

/** Persistent app frame — collapsible sidebar + topbar + scrollable content. Only <main> scrolls. */
export function Shell({ children }: ShellProps) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1')

  function toggleCollapsed() {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1')
      return !c
    })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fafafb]">
      <TickerTape />
      <div className="flex min-h-0 flex-1">
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
