import type { MockUser } from '@/types/auth'

export const MOCK_USERS: MockUser[] = [
  {
    id: 'usr-001',
    email: 'exec@ascend.com',
    password: 'demo123',
    name: 'Rahul Sharma',
    role: 'executive',
    title: 'Chief Investment Officer',
  },
  {
    id: 'usr-002',
    email: 'ops@ascend.com',
    password: 'demo123',
    name: 'Priya Mehta',
    role: 'ops_agent',
    title: 'Senior Ops Agent',
  },
  {
    id: 'usr-003',
    email: 'auditor@ascend.com',
    password: 'demo123',
    name: 'Vikram Nair',
    role: 'auditor',
    title: 'Compliance Officer',
  },
  {
    id: 'usr-004',
    email: 'admin@ascend.com',
    password: 'demo123',
    name: 'Anjali Patel',
    role: 'admin',
    title: 'Platform Administrator',
  },
]

export const PILLAR_LABELS = {
  onboarding: 'Onboarding',
  servicing: 'Servicing',
  regulatory: 'Regulatory',
  memory: 'Memory',
} as const

export const PILLAR_COLORS = {
  onboarding: 'bg-black/5 text-black',
  servicing: 'bg-black/5 text-slate-700',
  regulatory: 'bg-black/5 text-slate-600',
  memory: 'bg-black/5 text-slate-500',
} as const

export const STATUS_COLORS = {
  pending: 'bg-slate-100 text-slate-600 border-slate-200',
  approved: 'bg-black/5 text-black border-black/10',
  rejected: 'bg-primary/10 text-primary border-primary/20',
  escalated: 'bg-primary/15 text-primary border-primary/25',
} as const

export const PRIORITY_COLORS = {
  high: 'bg-primary/10 text-primary',
  medium: 'bg-black/5 text-black',
  low: 'bg-slate-100 text-slate-600',
} as const

export const ROLE_LABELS = {
  executive: 'Executive',
  ops_agent: 'Ops Agent',
  auditor: 'Auditor',
  admin: 'Administrator',
} as const

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', roles: ['executive', 'ops_agent', 'auditor', 'admin'] },
  { label: 'Workbench', path: '/workbench', icon: 'Inbox', roles: ['ops_agent', 'admin'] },
  { label: 'Audit Console', path: '/audit', icon: 'Shield', roles: ['auditor', 'admin', 'executive'] },
  { label: 'Admin', path: '/admin', icon: 'Settings', roles: ['admin'] },
] as const
