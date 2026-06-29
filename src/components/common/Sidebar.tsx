import { NavLink } from 'react-router-dom'
import { Cpu, Home, LayoutDashboard, Inbox, Shield, Settings, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

const ICON_MAP = {
  Home,
  LayoutDashboard,
  Inbox,
  Shield,
  Settings,
}

const NAV = [
  { label: 'Home', path: '/', icon: 'Home', roles: ['executive', 'ops_agent', 'auditor', 'admin'] },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['executive', 'ops_agent', 'auditor', 'admin'],
  },
  { label: 'Workbench', path: '/workbench', icon: 'Inbox', roles: ['ops_agent', 'admin'] },
  { label: 'Audit Console', path: '/audit', icon: 'Shield', roles: ['auditor', 'admin', 'executive'] },
  { label: 'Admin', path: '/admin', icon: 'Settings', roles: ['admin'] },
] as const

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
  onNavigate?: () => void
}

export function Sidebar({ collapsed = false, onToggle, onNavigate }: SidebarProps) {
  const { user } = useAuthStore()

  const visibleItems = NAV.filter((item) => (user ? (item.roles as readonly string[]).includes(user.role) : false))

  return (
    <div
      className={cn(
        'flex h-full shrink-0 flex-col border-r hairline bg-white transition-[width] duration-200 ease-out',
        collapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      {/* Brand header */}
      <div className={cn('flex h-14 items-center gap-2.5 border-b hairline px-4', collapsed && 'justify-center px-0')}>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[#6366f1] text-white shadow-sm">
          <Cpu size={17} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">Ascend AI</div>
            <div className="-mt-0.5 text-[11px] text-slate-400">Investor Servicing Platform</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-400">Workspace</p>
        )}
        {visibleItems.map((item) => {
          const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onNavigate}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors',
                  collapsed && 'justify-center px-0',
                  isActive ? 'bg-[#eef2ff] text-[#4f46e5]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn('h-4.5 w-4.5 shrink-0', isActive ? 'text-[#6366f1]' : 'text-slate-400 group-hover:text-slate-600')}
                    size={18}
                  />
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      {onToggle && (
        <div className="border-t hairline p-3">
          <button
            onClick={onToggle}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50',
              collapsed && 'justify-center px-0',
            )}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      )}
    </div>
  )
}
