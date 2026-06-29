import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, AlertTriangle, FileText, Cpu, UserCheck } from 'lucide-react'
import { Card, ChipRoot, ChipLabel } from '@heroui/react'
import { useAuditStore } from '@/store/auditStore'
import { Header } from '@/components/common/Header'
import { StatCard } from '@/components/common/StatCard'
import { PillarBadge } from '@/components/common/PillarBadge'
import { ConfidenceBar } from '@/components/common/ConfidenceBar'
import { StatusPill } from '@/components/common/StatusPill'
import { EmptyState } from '@/components/common/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'
import type { Pillar } from '@/types/decision'
import type { AuditEntry } from '@/types/kpi'

/** Same visual contract as the Workbench filter bar — search input and every select share this. */
const SELECT_CLS =
  'h-9 rounded border hairline bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#c7cdf9] focus:ring-4 focus:ring-[#eef2ff]'

const TH_CLASS = 'h-10 px-4 text-left align-middle text-[11px] font-medium uppercase tracking-wide text-slate-400'

const HIDDEN_MD = 'hidden md:table-cell'
const HIDDEN_LG = 'hidden lg:table-cell'
const HIDDEN_XL = 'hidden xl:table-cell'

export function AuditPage() {
  const { entries, loading, load } = useAuditStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [pillarFilter, setPillarFilter] = useState<Pillar | 'all'>('all')
  const [actionFilter, setActionFilter] = useState<AuditEntry['action'] | 'all'>('all')
  const [overrideFilter, setOverrideFilter] = useState<'all' | 'overridden'>('all')
  const [quickFilter, setQuickFilter] = useState<'all' | 'auto_approved' | 'human_reviewed' | 'overridden'>('all')

  useEffect(() => {
    load()
  }, [])

  function toggleQuickFilter(value: 'all' | 'auto_approved' | 'human_reviewed' | 'overridden') {
    setQuickFilter((current) => (current === value ? 'all' : value))
  }

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (quickFilter === 'auto_approved' && e.action !== 'auto_approved') return false
      if (quickFilter === 'human_reviewed' && e.action === 'auto_approved') return false
      if (quickFilter === 'overridden' && !e.overridden) return false
      if (pillarFilter !== 'all' && e.pillar !== pillarFilter) return false
      if (actionFilter !== 'all' && e.action !== actionFilter) return false
      if (overrideFilter === 'overridden' && !e.overridden) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          e.investorName.toLowerCase().includes(q) ||
          e.investorPAN.toLowerCase().includes(q) ||
          e.decisionId.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [entries, search, pillarFilter, actionFilter, overrideFilter, quickFilter])

  const overrideCount = entries.filter((e) => e.overridden).length
  const autoApprovedCount = entries.filter((e) => e.action === 'auto_approved').length
  const humanReviewedCount = entries.filter((e) => e.action !== 'auto_approved').length

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title="Audit Console"
        subtitle="Full replay of every AI decision — SEBI/AMFI defensible"
        actions={
          overrideCount > 0 ? (
            <ChipRoot variant="soft" color="warning" size="sm" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              <ChipLabel className="nums text-[11px]">{overrideCount} overrides</ChipLabel>
            </ChipRoot>
          ) : undefined
        }
      />

      {/* Compliance posture stat tiles — click to filter the records below */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <StatCard
          icon={<FileText className="h-3.5 w-3.5" />}
          tone="primary"
          value={entries.length}
          label="Total Logged"
          onClick={() => setQuickFilter('all')}
          className={quickFilter === 'all' ? 'ring-2 ring-indigo-200' : undefined}
        />
        <StatCard
          icon={<Cpu className="h-3.5 w-3.5" />}
          tone="escalated"
          value={autoApprovedCount}
          label="Auto-Approved"
          onClick={() => toggleQuickFilter('auto_approved')}
          className={quickFilter === 'auto_approved' ? 'ring-2 ring-indigo-200' : undefined}
        />
        <StatCard
          icon={<UserCheck className="h-3.5 w-3.5" />}
          tone="success"
          value={humanReviewedCount}
          label="Human Reviewed"
          onClick={() => toggleQuickFilter('human_reviewed')}
          className={quickFilter === 'human_reviewed' ? 'ring-2 ring-indigo-200' : undefined}
        />
        <StatCard
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          tone="pending"
          value={overrideCount}
          label="Overridden"
          onClick={() => toggleQuickFilter('overridden')}
          className={quickFilter === 'overridden' ? 'ring-2 ring-indigo-200' : undefined}
        />
      </div>

      {/* Filter bar — identical contract to Workbench */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search investor, PAN, decision ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${SELECT_CLS} w-full pl-9`}
          />
        </div>

        <select
          value={pillarFilter}
          onChange={(e) => setPillarFilter(e.target.value as Pillar | 'all')}
          className={`${SELECT_CLS} w-36`}
        >
          <option value="all">All Pillars</option>
          <option value="onboarding">Onboarding</option>
          <option value="servicing">Servicing</option>
          <option value="regulatory">Regulatory</option>
          <option value="memory">Memory</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value as AuditEntry['action'] | 'all')}
          className={`${SELECT_CLS} w-40`}
        >
          <option value="all">All Actions</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="escalated">Escalated</option>
          <option value="auto_approved">Auto-Approved</option>
        </select>

        <select
          value={overrideFilter}
          onChange={(e) => setOverrideFilter(e.target.value as 'all' | 'overridden')}
          className={`${SELECT_CLS} w-40`}
        >
          <option value="all">All Records</option>
          <option value="overridden">Overrides Only</option>
        </select>

        <span className="nums ml-auto shrink-0 text-[12px] text-slate-400">
          {filtered.length} of {entries.length}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <Card className="p-6">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState title="No audit records found" description="Try adjusting your filters." />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-b hairline hover:bg-transparent">
                  <TableHead className={TH_CLASS}>Decision ID</TableHead>
                  <TableHead className={`${TH_CLASS} ${HIDDEN_MD}`}>Investor</TableHead>
                  <TableHead className={TH_CLASS}>Pillar</TableHead>
                  <TableHead className={TH_CLASS}>Action</TableHead>
                  <TableHead className={`${TH_CLASS} ${HIDDEN_LG}`}>Actor</TableHead>
                  <TableHead className={`${TH_CLASS} ${HIDDEN_XL}`}>AI Confidence</TableHead>
                  <TableHead className={`${TH_CLASS} ${HIDDEN_LG}`}>Override</TableHead>
                  <TableHead className={`${TH_CLASS} ${HIDDEN_MD}`}>Timestamp</TableHead>
                  <TableHead className={`${TH_CLASS} w-10`} />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow
                    key={entry.id}
                    onClick={() => navigate(`/audit/${entry.decisionId}`)}
                    className="cursor-pointer border-t hairline hover:bg-slate-50/60"
                  >
                    <TableCell className="px-4 py-3 align-middle">
                      <p className="nums text-[13.5px] font-semibold text-slate-800">{entry.decisionId}</p>
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-400">{entry.summary}</p>
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle ${HIDDEN_MD}`}>
                      <p className="text-[13px] font-medium text-slate-700">{entry.investorName}</p>
                      <p className="nums text-[12px] text-slate-400">{entry.investorPAN}</p>
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <PillarBadge pillar={entry.pillar as Pillar} />
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <StatusPill status={entry.action} />
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle ${HIDDEN_LG}`}>
                      <p className="text-[13px] font-medium text-slate-700">{entry.actor}</p>
                      <p className="text-[12px] text-slate-400 capitalize">{entry.actorRole}</p>
                    </TableCell>
                    <TableCell className={`w-28 px-4 py-3 align-middle ${HIDDEN_XL}`}>
                      <ConfidenceBar value={entry.confidence} size="sm" />
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle ${HIDDEN_LG}`}>
                      {entry.overridden ? (
                        <span className="flex items-center gap-1 text-[12px] font-medium text-amber-600">
                          <AlertTriangle size={13} /> Override
                        </span>
                      ) : (
                        <span className="text-[12px] text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle text-[12px] whitespace-nowrap text-slate-400 ${HIDDEN_MD}`}>
                      {formatDateTime(entry.timestamp)}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  )
}
