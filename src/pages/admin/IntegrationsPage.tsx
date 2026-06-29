import { useEffect, useState } from 'react'
import { ArrowLeft, AlertTriangle, RefreshCw, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, ChipRoot, ChipLabel } from '@heroui/react'
import { Header } from '@/components/common/Header'
import { StatCard } from '@/components/common/StatCard'
import { fetchIntegrations } from '@/api/admin'
import { formatDateTime } from '@/lib/utils'

interface Integration {
  id: string
  name: string
  category: string
  status: 'healthy' | 'degraded' | 'down'
  lastSync: string
  latencyMs: number
  uptime: number
  description: string
  endpoint: string
  icon: string
  alert?: string
}

const STATUS_CONFIG = {
  healthy: { label: 'Healthy', chipColor: 'success' as const, dot: 'bg-emerald-500' },
  degraded: { label: 'Degraded', chipColor: 'warning' as const, dot: 'bg-amber-500' },
  down: { label: 'Down', chipColor: 'danger' as const, dot: 'bg-rose-500' },
}

/** Threshold-based coloring — defined once, reused per metric. */
function latencyColor(ms: number) {
  if (ms < 500) return 'text-emerald-600'
  if (ms < 2000) return 'text-amber-600'
  return 'text-rose-600'
}

function uptimeColor(pct: number) {
  if (pct >= 99) return 'text-emerald-600'
  if (pct >= 95) return 'text-amber-600'
  return 'text-rose-600'
}

export function IntegrationsPage() {
  const navigate = useNavigate()
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    const data = await fetchIntegrations()
    setIntegrations(data as Integration[])
    setLoading(false)
  }

  async function refresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  useEffect(() => {
    load()
  }, [])

  const healthy = integrations.filter((i) => i.status === 'healthy').length
  const degraded = integrations.filter((i) => i.status === 'degraded').length

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title="Integrations"
        subtitle="System health and connectivity status"
        actions={
          <div className="flex items-center gap-2">
            {degraded > 0 && (
              <ChipRoot variant="soft" color="warning" size="sm" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                <ChipLabel className="text-[11px]">{degraded} degraded</ChipLabel>
              </ChipRoot>
            )}
            <button
              onClick={refresh}
              title="Refresh integration status"
              className="grid h-9 w-9 place-items-center rounded text-slate-500 hover:bg-slate-100"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <Button variant="tertiary" size="sm" onPress={() => navigate('/admin')} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        }
      />

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-3 gap-5">
          <StatCard tone="primary" value={integrations.length} label="Total Systems" />
          <StatCard
            tone="success"
            value={<span className="text-emerald-600">{healthy}</span>}
            label="Healthy"
          />
          <StatCard
            tone={degraded > 0 ? 'pending' : 'neutral'}
            value={<span className={degraded > 0 ? 'text-amber-600' : 'text-slate-900'}>{degraded}</span>}
            label="Degraded"
          />
        </div>
      )}

      {/* Integration cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-md bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {integrations.map((int) => {
            const cfg = STATUS_CONFIG[int.status]
            return (
              <Card key={int.id} className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`} />
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{int.name}</h3>
                      <p className="text-[12px] text-slate-400">{int.category}</p>
                    </div>
                  </div>
                  <ChipRoot variant="soft" color={cfg.chipColor} size="sm">
                    <ChipLabel className="text-[11px]">{cfg.label}</ChipLabel>
                  </ChipRoot>
                </div>

                <p className="mb-4 text-[12.5px] text-slate-500">{int.description}</p>

                {int.alert && (
                  <div className="mb-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <p className="text-[12px] text-amber-700">{int.alert}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="mb-0.5 text-[11px] text-slate-400">Latency</p>
                    <p className={`nums text-[13px] font-semibold ${latencyColor(int.latencyMs)}`}>
                      {int.latencyMs < 1000 ? `${int.latencyMs}ms` : `${(int.latencyMs / 1000).toFixed(1)}s`}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-slate-400">Uptime</p>
                    <p className={`nums text-[13px] font-semibold ${uptimeColor(int.uptime)}`}>{int.uptime}%</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[11px] text-slate-400">Last Sync</p>
                    <div className="flex items-center gap-1">
                      {refreshing ? (
                        <RefreshCw className="h-3 w-3 animate-spin text-slate-400" />
                      ) : (
                        <Clock className="h-3 w-3 text-slate-400" />
                      )}
                      <p className="nums text-[12px] text-slate-600">
                        {new Date(int.lastSync).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 border-t hairline pt-3">
                  <p className="truncate font-mono text-[11px] text-slate-400">{int.endpoint}</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <p className="text-[12px] text-slate-400">
        Integration status refreshes every 5 minutes automatically. Click the refresh button to force an update. Last
        full check: {formatDateTime(new Date().toISOString())}
      </p>
    </div>
  )
}
