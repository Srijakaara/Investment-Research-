export type Pillar = 'onboarding' | 'servicing' | 'regulatory' | 'memory'
export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'escalated'
export type Priority = 'high' | 'medium' | 'low'

export interface Decision {
  id: string
  pillar: Pillar
  status: DecisionStatus
  priority: Priority
  investorId: string
  investorName: string
  investorPAN: string
  title: string
  description: string
  aiProposal: string
  confidence: number
  rationale: string
  evidence: string[]
  modelVersion: string
  createdAt: string
  updatedAt: string
  assignedTo: string
  slaDeadline: string
  resolvedBy?: string
  resolvedAt?: string
  overrideReason?: string
  tags: string[]
}

export interface DecisionFilters {
  pillar?: Pillar | 'all'
  status?: DecisionStatus | 'all'
  priority?: Priority | 'all'
  search?: string
}

export interface DecisionsState {
  decisions: Decision[]
  loading: boolean
  error: string | null
  filters: DecisionFilters
  load: () => Promise<void>
  approve: (id: string, by: string) => void
  reject: (id: string, by: string, reason: string) => void
  escalate: (id: string, by: string, reason: string) => void
  setFilters: (f: Partial<DecisionFilters>) => void
}
