import { useEffect, useMemo } from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowUpRight, XCircle } from 'lucide-react'
import { useDecisionsStore } from '@/store/decisionsStore'
import { useKPIStore } from '@/store/kpiStore'
import { Header } from '@/components/common/Header'
import { StatCard } from '@/components/common/StatCard'
import { KPICard } from '@/components/common/KPICard'
import { StatusPill } from '@/components/common/StatusPill'
import { PillarBadge } from '@/components/common/PillarBadge'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Card, ChipRoot, ChipLabel } from '@heroui/react'
import { Skeleton } from '@/components/ui/skeleton'
import { timeAgo } from '@/lib/utils'
import { TONE_HEX, ORDERED_PALETTE } from '@/lib/colorMap'
import { useNavigate } from 'react-router-dom'
import type { KPI } from '@/types/kpi'
import type { Pillar } from '@/types/decision'

interface CustomTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  valueFormatter?: (val: any) => string
}

function CustomTooltip({ active, payload, label, valueFormatter }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-sm border border-border bg-white px-3 py-2.5 text-[11px] shadow-md select-none">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="min-w-[120px] space-y-1.5">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="font-medium text-slate-500">{entry.name}</span>
            </div>
            <span className="nums text-right font-semibold text-slate-900">
              {valueFormatter ? valueFormatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { decisions, loading: dLoading, load: loadDecisions, setFilters } = useDecisionsStore()
  const { kpis, loading: kLoading, load: loadKPIs } = useKPIStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadDecisions()
    loadKPIs()
  }, [])

  const stats = useMemo(() => {
    const total = decisions.length
    const pending = decisions.filter((d) => d.status === 'pending').length
    const approved = decisions.filter((d) => d.status === 'approved').length
    const rejected = decisions.filter((d) => d.status === 'rejected').length
    const escalated = decisions.filter((d) => d.status === 'escalated').length
    return { total, pending, approved, rejected, escalated }
  }, [decisions])

  const recent = useMemo(
    () => [...decisions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 6),
    [decisions],
  )

  const byPillarData = useMemo(() => {
    const pillars = ['onboarding', 'servicing', 'regulatory', 'memory']
    return pillars.map((p) => ({
      pillar: p.charAt(0).toUpperCase() + p.slice(1, 4),
      Pending: decisions.filter((d) => d.pillar === p && d.status === 'pending').length,
      Approved: decisions.filter((d) => d.pillar === p && d.status === 'approved').length,
      Rejected: decisions.filter((d) => d.pillar === p && d.status === 'rejected').length,
      Escalated: decisions.filter((d) => d.pillar === p && d.status === 'escalated').length,
    }))
  }, [decisions])

  const weeklyData = useMemo(() => {
    if (!kpis.length) return []
    const onboarding = kpis.find((k) => k.pillar === 'onboarding')
    const query = kpis.find((k) => k.id === 'kpi-02')
    if (!onboarding) return []
    return onboarding.weeklyData.map((w, i) => ({
      week: w.week,
      Onboarding: w.value,
      QueryResolution: query ? query.weeklyData[i]?.value : 0,
    }))
  }, [kpis])

  const criticalCount = useMemo(
    () =>
      decisions.filter(
        (d) =>
          d.status === 'pending' &&
          d.priority === 'high' &&
          d.slaDeadline &&
          new Date(d.slaDeadline).getTime() - Date.now() < 3600000 * 8,
      ).length,
    [decisions],
  )
  const highCount = useMemo(
    () => decisions.filter((d) => d.status === 'pending' && d.priority === 'high').length,
    [decisions],
  )
  const mediumCount = useMemo(
    () => decisions.filter((d) => d.status === 'pending' && d.priority === 'medium').length,
    [decisions],
  )
  const lowCount = useMemo(
    () => decisions.filter((d) => d.status === 'pending' && d.priority === 'low').length,
    [decisions],
  )
  const maxRiskCount = useMemo(
    () => Math.max(criticalCount, highCount, mediumCount, lowCount, 4),
    [criticalCount, highCount, mediumCount, lowCount],
  )

  const riskBands = useMemo(
    () => [
      { label: 'Critical', count: criticalCount, hex: ORDERED_PALETTE[0], pct: (criticalCount / maxRiskCount) * 100 },
      { label: 'High', count: highCount, hex: ORDERED_PALETTE[1], pct: (highCount / maxRiskCount) * 100 },
      { label: 'Medium', count: mediumCount, hex: ORDERED_PALETTE[2], pct: (mediumCount / maxRiskCount) * 100 },
      { label: 'Low', count: lowCount, hex: ORDERED_PALETTE[3], pct: (lowCount / maxRiskCount) * 100 },
    ],
    [criticalCount, highCount, mediumCount, lowCount, maxRiskCount],
  )

  function refresh() {
    window.location.reload()
  }

  const STAT_CARDS = [
    { label: 'Total Decisions', value: stats.total, icon: <TrendingUp className="h-3.5 w-3.5" />, tone: 'primary' as const, status: 'all' as const },
    { label: 'Pending Review', value: stats.pending, icon: <Clock className="h-3.5 w-3.5" />, tone: 'pending' as const, status: 'pending' as const },
    { label: 'Approved', value: stats.approved, icon: <CheckCircle2 className="h-3.5 w-3.5" />, tone: 'success' as const, status: 'approved' as const },
    { label: 'Rejected', value: stats.rejected, icon: <XCircle className="h-3.5 w-3.5" />, tone: 'critical' as const, status: 'rejected' as const },
    { label: 'Escalated', value: stats.escalated, icon: <AlertTriangle className="h-3.5 w-3.5" />, tone: 'escalated' as const, status: 'escalated' as const },
  ]

  function goToWorkbench(status: 'all' | 'pending' | 'approved' | 'rejected' | 'escalated') {
    setFilters({ status, pillar: 'all', priority: 'all' })
    navigate('/workbench')
  }

  function goToWorkbenchForKPI(kpi: KPI) {
    const pillar = (['onboarding', 'servicing', 'regulatory', 'memory'] as const).includes(kpi.pillar as any)
      ? (kpi.pillar as Pillar)
      : 'all'
    setFilters({ pillar, status: 'all', priority: 'all' })
    navigate('/workbench')
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header
        title="Executive Dashboard"
        subtitle="Kaara — AI Servicing Platform"
        onRefresh={refresh}
        actions={
          <ChipRoot variant="soft" color="success" size="sm" className="hidden gap-1.5 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <ChipLabel className="text-[11px]">Live · Hourly refresh</ChipLabel>
          </ChipRoot>
        }
      />

      <div className="w-full flex-1 space-y-7 px-8 py-6">
        {/* ── Stat cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map((s) =>
            dLoading ? (
              <Card key={s.label} className="h-[84px] p-4">
                <Skeleton className="mb-3 h-3 w-20" />
                <Skeleton className="h-7 w-12" />
              </Card>
            ) : (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                icon={s.icon}
                tone={s.tone}
                onClick={() => goToWorkbench(s.status)}
              />
            ),
          )}
        </div>

        {/* ── KPI cards ──────────────────────────────────────────────── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">
              Key Performance Indicators
            </h2>
            <span className="text-[11px] text-slate-400">Baseline → Current → Target</span>
          </div>
          {kLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="h-[100px] p-4">
                  <Skeleton className="h-full w-full" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {kpis.map((k) => (
                <KPICard key={k.id} kpi={k} onClick={goToWorkbenchForKPI} />
              ))}
            </div>
          )}
        </div>

        {/* ── First row: chart + risk band ─────────────────────────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Card className="p-6 lg:col-span-8">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Turnaround Reduction</h3>
            <p className="mt-0.5 mb-4 text-[12.5px] text-slate-400">Hours per case — W1 to W10</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOnboarding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ORDERED_PALETTE[0]} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={ORDERED_PALETTE[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorQuery" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ORDERED_PALETTE[1]} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={ORDERED_PALETTE[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} tickLine={false} axisLine={false} dy={8} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip valueFormatter={(v) => (typeof v === 'number' ? `${v.toFixed(1)}h` : String(v))} />} />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 11, fontWeight: 500, color: '#64748b', paddingTop: 15 }} />
                <Area
                  type="monotone"
                  dataKey="Onboarding"
                  stroke={ORDERED_PALETTE[0]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOnboarding)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: ORDERED_PALETTE[0] }}
                />
                <Area
                  type="monotone"
                  dataKey="QueryResolution"
                  name="Query Resolution"
                  stroke={ORDERED_PALETTE[1]}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorQuery)"
                  activeDot={{ r: 4, strokeWidth: 0, fill: ORDERED_PALETTE[1] }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="flex flex-col justify-between p-6 lg:col-span-4">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Risk band — open queue</h3>
              <p className="mt-0.5 mb-6 text-[12.5px] text-slate-400">Cases pending or open</p>

              <div className="space-y-4">
                {riskBands.map((band) => (
                  <div key={band.label} className="space-y-1.5">
                    <div className="flex justify-between text-[12.5px] font-medium">
                      <span className="text-slate-500">{band.label}</span>
                      <span className="nums font-semibold text-slate-900">{band.count}</span>
                    </div>
                    <ProgressBar value={band.pct} colorHex={band.hex} minWidth={4} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ── Second row: pillar bar chart + sentinel stream ───────────── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Card className="p-6 lg:col-span-8">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Decisions by Pillar</h3>
            <p className="mt-0.5 mb-4 text-[12.5px] text-slate-400">Pending · Approved · Rejected · Escalated</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={byPillarData} barSize={16} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="pillar" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} tickLine={false} axisLine={false} dy={8} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip valueFormatter={(v) => `${v} Case${v !== 1 ? 's' : ''}`} />} />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 11, fontWeight: 500, color: '#64748b', paddingTop: 15 }} />
                <Bar dataKey="Pending" fill={TONE_HEX.pending} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Approved" fill={TONE_HEX.success} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Rejected" fill={TONE_HEX.critical} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Escalated" fill={TONE_HEX.escalated} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="flex flex-col justify-between p-6 lg:col-span-4">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Sentinel stream</h3>
              <p className="mt-0.5 mb-4 text-[12.5px] text-slate-400">Real-time system state</p>

              <div className="mt-4 space-y-2.5">
                {[
                  { label: 'Cognitive Engine', value: 'Optimal' },
                  { label: 'Regulatory Memory', value: 'Synced' },
                  { label: 'Audit SLA Threshold', value: '98.5%' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2">
                    <span className="text-[12.5px] font-medium text-slate-600">{row.label}</span>
                    <ChipRoot variant="soft" color="success" size="sm">
                      <ChipLabel className="nums text-[10px]">{row.value}</ChipLabel>
                    </ChipRoot>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Sentinel · Live Connected
              </span>
            </div>
          </Card>
        </div>

        {/* ── Recent Activity ─────────────────────────────────────────── */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b hairline px-6 py-4">
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Recent Activity</h3>
            <button
              onClick={() => navigate('/workbench')}
              className="flex items-center gap-1 text-[12.5px] font-medium text-indigo-600"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {dLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : (
            <div>
              {recent.map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate(`/workbench/${d.id}`)}
                  className="flex cursor-pointer items-center gap-4 border-b hairline px-6 py-3.5 last:border-0 hover:bg-slate-50/60"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-slate-800">{d.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="nums text-[11.5px] text-slate-400">{d.id}</span>
                      <span className="text-slate-300">·</span>
                      <PillarBadge pillar={d.pillar} />
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <StatusPill status={d.status} />
                    <span className="nums text-[11px] text-slate-400">{timeAgo(d.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
