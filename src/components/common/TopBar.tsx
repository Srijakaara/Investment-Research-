import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Bell, RefreshCw, Menu, Search, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useDecisionsStore } from '@/store/decisionsStore'
import { ROLE_LABELS } from '@/lib/constants'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from '@/components/common/Sidebar'
import { StatusPill } from '@/components/common/StatusPill'
import { PillarBadge } from '@/components/common/PillarBadge'

const MAX_RESULTS = 8

export function TopBar() {
  const { user, logout } = useAuthStore()
  const { decisions, load } = useDecisionsStore()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null)

  useEffect(() => {
    load()
  }, [])

  // Anchor the results dropdown to the input's real screen position, immune to any
  // ancestor stacking context (transformed/scrolling cards) that broke the old
  // absolute-inside-header positioning and caused it to render behind page content.
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return
    function updateRect() {
      const r = containerRef.current!.getBoundingClientRect()
      setDropdownRect({ top: r.bottom + 6, left: r.left, width: r.width })
    }
    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [isOpen])

  // ⌘K / Ctrl+K focuses the search box from anywhere on the page
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Close the results dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return decisions
      .filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.investorName.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.investorPAN.toLowerCase().includes(q),
      )
      .slice(0, MAX_RESULTS)
  }, [decisions, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  function goToDecision(id: string) {
    navigate(`/workbench/${id}`)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      goToDecision(results[activeIndex].id)
    }
  }

  const refreshData = () => {
    window.location.reload()
  }

  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b hairline bg-white/80 px-5 backdrop-blur-md">
      {/* Mobile nav trigger — full sidebar in a sheet below lg */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="grid h-9 w-9 shrink-0 place-items-center rounded text-slate-500 hover:bg-slate-50 lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Global search */}
      <div ref={containerRef} className="relative w-full max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={onSearchKeyDown}
          placeholder="Search…"
          className="h-9 w-full rounded border hairline bg-slate-50/70 pl-9 pr-16 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#c7cdf9] focus:bg-white focus:ring-4 focus:ring-[#eef2ff]"
        />
        {query ? (
          <button
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            title="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-[3px] border hairline bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
            ⌘K
          </kbd>
        )}

        {isOpen && query && dropdownRect && (
          createPortal(
            <div
              style={{
                position: 'fixed',
                top: dropdownRect.top,
                left: dropdownRect.left,
                width: Math.max(dropdownRect.width, 420),
              }}
              className="z-999 max-w-[90vw] overflow-hidden rounded-sm border hairline bg-white shadow-lg"
            >
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-slate-400">No decisions match "{query}"</p>
              ) : (
                <ul>
                  {results.map((d, i) => (
                    <li key={d.id}>
                      <button
                        onClick={() => goToDecision(d.id)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={cn(
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors',
                          i === activeIndex ? 'bg-indigo-50' : 'hover:bg-slate-50',
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-slate-800">{d.title}</p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <span className="nums text-[11px] text-slate-400">{d.id}</span>
                            <span className="text-slate-300">·</span>
                            <span className="truncate text-[11px] text-slate-400">{d.investorName}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <StatusPill status={d.status} />
                          <PillarBadge pillar={d.pillar} />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>,
            document.body,
          )
        )}
      </div>

      {/* Right action cluster */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={refreshData}
          title="Refresh page data"
          className="grid h-9 w-9 place-items-center rounded text-slate-500 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button title="Notifications" className="relative grid h-9 w-9 place-items-center rounded text-slate-500 hover:bg-slate-50">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#f43f5e] ring-2 ring-white" />
        </button>

        {user && (
          <>
            <div className="mx-1 h-6 w-px bg-[#ececf1]" />

            <div className="flex items-center gap-2.5 pl-0.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b8ff7] text-[12px] font-semibold text-white">
                {initials}
              </div>
              <div className="hidden leading-tight sm:block">
                <div className="text-[13px] font-semibold text-slate-800">{user.name}</div>
                <div className="-mt-0.5 text-[11px] text-slate-400">{ROLE_LABELS[user.role]}</div>
              </div>
              <button
                onClick={logout}
                title="Sign out of account"
                className="grid h-9 w-9 place-items-center rounded text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-500"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
