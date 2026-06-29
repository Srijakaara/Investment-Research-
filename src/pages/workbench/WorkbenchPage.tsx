import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Clock, ArrowRight } from 'lucide-react'
import { Card, ChipRoot, ChipLabel } from '@heroui/react'
import { useDecisionsStore } from '@/store/decisionsStore'
import { Header } from '@/components/common/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { PillarBadge } from '@/components/common/PillarBadge'
import { ConfidenceBar } from '@/components/common/ConfidenceBar'
import { EmptyState } from '@/components/common/EmptyState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { slaCountdown, timeAgo } from '@/lib/utils'
import type { Pillar, DecisionStatus, Priority } from '@/types/decision'

/** Shared visual contract for every filter control on this page — search input and all selects. */
const INPUT_CLASS =
  'h-9 rounded border hairline bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#c7cdf9] focus:ring-4 focus:ring-[#eef2ff]'

const PRIORITY_DOT: Record<Priority, string> = {
  high: 'bg-rose-500',
  medium: 'bg-amber-400',
  low: 'bg-slate-300',
}

const TH_CLASS = 'h-10 px-4 text-left align-middle text-[11px] font-medium uppercase tracking-wide text-slate-400'

const HIDDEN_MD = 'hidden md:table-cell'
const HIDDEN_LG = 'hidden lg:table-cell'
const HIDDEN_XL = 'hidden xl:table-cell'

export function WorkbenchPage() {
  const { decisions, loading, load, filters, setFilters } = useDecisionsStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return decisions.filter((d) => {
      if (filters.pillar && filters.pillar !== 'all' && d.pillar !== filters.pillar) return false
      if (filters.status && filters.status !== 'all' && d.status !== filters.status) return false
      if (filters.priority && filters.priority !== 'all' && d.priority !== filters.priority) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          d.title.toLowerCase().includes(q) ||
          d.investorName.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          d.investorPAN.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [decisions, filters, search])

  const pendingCount = decisions.filter((d) => d.status === 'pending').length

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title="Operational Workbench"
        subtitle="AI-proposed decisions awaiting your review"
        actions={
          pendingCount > 0 ? (
            <ChipRoot variant="soft" color="warning" size="sm">
              <ChipLabel className="nums text-[11px]">{pendingCount} pending</ChipLabel>
            </ChipRoot>
          ) : undefined
        }
      />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search by title, investor, PAN…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${INPUT_CLASS} w-full pl-9`}
          />
        </div>

        <select
          value={filters.pillar ?? 'all'}
          onChange={(e) => setFilters({ pillar: e.target.value as Pillar | 'all' })}
          className={`${INPUT_CLASS} w-36`}
        >
          <option value="all">All Pillars</option>
          <option value="onboarding">Onboarding</option>
          <option value="servicing">Servicing</option>
          <option value="regulatory">Regulatory</option>
          <option value="memory">Memory</option>
        </select>

        <select
          value={filters.status ?? 'all'}
          onChange={(e) => setFilters({ status: e.target.value as DecisionStatus | 'all' })}
          className={`${INPUT_CLASS} w-36`}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="escalated">Escalated</option>
        </select>

        <select
          value={filters.priority ?? 'all'}
          onChange={(e) => setFilters({ priority: e.target.value as Priority | 'all' })}
          className={`${INPUT_CLASS} w-36`}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <span className="nums ml-auto shrink-0 text-[12px] text-slate-400">
          {filtered.length} of {decisions.length}
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
          <EmptyState title="No decisions found" description="Try adjusting your search or filters." />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b hairline hover:bg-transparent">
                <TableHead className={`${TH_CLASS} w-10`} />
                <TableHead className={TH_CLASS}>Decision</TableHead>
                <TableHead className={`${TH_CLASS} ${HIDDEN_MD}`}>Pillar</TableHead>
                <TableHead className={`${TH_CLASS} ${HIDDEN_LG}`}>Investor</TableHead>
                <TableHead className={TH_CLASS}>AI Confidence</TableHead>
                <TableHead className={TH_CLASS}>Status</TableHead>
                <TableHead className={`${TH_CLASS} ${HIDDEN_XL}`}>SLA</TableHead>
                <TableHead className={`${TH_CLASS} ${HIDDEN_MD}`}>Updated</TableHead>
                <TableHead className={`${TH_CLASS} w-10`} />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => {
                const sla = slaCountdown(d.slaDeadline)
                return (
                  <TableRow
                    key={d.id}
                    onClick={() => navigate(`/workbench/${d.id}`)}
                    className="cursor-pointer border-t hairline hover:bg-slate-50/60"
                  >
                    <TableCell className="px-4 py-3 align-middle">
                      <span className={`block h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[d.priority]}`} />
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <p className="line-clamp-1 text-[13.5px] font-medium text-slate-800">{d.title}</p>
                      <p className="nums mt-0.5 text-[12px] text-slate-400">{d.id}</p>
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle ${HIDDEN_MD}`}>
                      <PillarBadge pillar={d.pillar} />
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle ${HIDDEN_LG}`}>
                      <p className="text-[13px] font-medium text-slate-700">{d.investorName}</p>
                      <p className="nums text-[12px] text-slate-400">{d.investorPAN}</p>
                    </TableCell>
                    <TableCell className="w-32 px-4 py-3 align-middle">
                      <ConfidenceBar value={d.confidence} size="sm" />
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <StatusPill status={d.status} />
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle ${HIDDEN_XL}`}>
                      {d.status === 'pending' && (
                        <div
                          className={`flex items-center gap-1 text-[12.5px] ${sla.urgent ? 'font-semibold text-rose-600' : 'text-slate-400'}`}
                        >
                          <Clock className="h-3 w-3" />
                          {sla.label}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className={`px-4 py-3 align-middle text-[12px] text-slate-400 ${HIDDEN_MD}`}>
                      {timeAgo(d.updatedAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 align-middle">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
