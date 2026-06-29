export type KPIStatus = 'on_track' | 'near_target' | 'at_risk'
export type KPITrend = 'up' | 'down' | 'flat'

export interface KPI {
  id: string
  label: string
  pillar: string
  unit: string
  baseline: number
  current: number
  target: number
  trend: KPITrend
  status: KPIStatus
  description: string
  weeklyData: { week: string; value: number }[]
}

export interface KPIState {
  kpis: KPI[]
  loading: boolean
  load: () => Promise<void>
}

export interface AuditEntry {
  id: string
  decisionId: string
  pillar: string
  action: 'approved' | 'rejected' | 'escalated' | 'auto_approved'
  actor: string
  actorRole: string
  timestamp: string
  confidence: number
  modelVersion: string
  overridden: boolean
  overrideReason?: string
  investorName: string
  investorPAN: string
  summary: string
}

export interface AuditState {
  entries: AuditEntry[]
  loading: boolean
  load: () => Promise<void>
}
