import { useEffect, useState } from 'react'
import { ArrowLeft, CheckCircle2, AlertTriangle, Bot, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, ChipRoot, ChipLabel } from '@heroui/react'
import { Header } from '@/components/common/Header'
import { PillarBadge } from '@/components/common/PillarBadge'
import { fetchModels } from '@/api/admin'
import { formatDate } from '@/lib/utils'
import type { Pillar } from '@/types/decision'

interface ModelCard {
  id: string
  pillar: Pillar
  name: string
  version: string
  status: 'production' | 'beta' | 'deprecated'
  deployedAt: string
  trainedOn: string
  accuracy: number
  avgConfidence: number
  totalDecisions: number
  autoResolvedRate: number
  overrideRate: number
  biasReport: {
    status: 'passed' | 'in_review' | 'failed'
    genderBias: string
    geographicBias: string
    lastChecked: string
  }
  description: string
  capabilities: string[]
}

const STATUS_CONFIG = {
  production: { label: 'Production', chipColor: 'success' as const },
  beta: { label: 'Beta', chipColor: 'accent' as const },
  deprecated: { label: 'Deprecated', chipColor: 'default' as const },
}

const BIAS_CONFIG = {
  passed: { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, label: 'Passed', cls: 'text-emerald-600' },
  in_review: {
    icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    label: 'In Review',
    cls: 'text-amber-600',
  },
  failed: { icon: <AlertTriangle className="h-4 w-4 text-rose-500" />, label: 'Failed', cls: 'text-rose-600' },
}

const OVERRIDE_RISK_THRESHOLD = 5

export function ModelsPage() {
  const navigate = useNavigate()
  const [models, setModels] = useState<ModelCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModels().then((data) => {
      setModels(data as ModelCard[])
      setLoading(false)
    })
  }, [])

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title="AI Model Registry"
        subtitle="Model cards, bias reports, and performance metrics"
        actions={
          <Button variant="tertiary" size="sm" onPress={() => navigate('/admin')} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded border hairline bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {models.map((model) => {
            const statusCfg = STATUS_CONFIG[model.status]
            const biasCfg = BIAS_CONFIG[model.biasReport.status]
            const overrideAtRisk = model.overrideRate > OVERRIDE_RISK_THRESHOLD

            const metrics = [
              { label: 'Accuracy', value: `${model.accuracy}%`, alert: false },
              { label: 'Avg Confidence', value: `${Math.round(model.avgConfidence * 100)}%`, alert: false },
              { label: 'Auto-Resolved', value: `${model.autoResolvedRate}%`, alert: false },
              { label: 'Override Rate', value: `${model.overrideRate}%`, alert: overrideAtRisk },
            ]

            return (
              <Card key={model.id} className="p-0">
                {/* Card header */}
                <div className="flex flex-wrap items-start justify-between gap-3 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-sm bg-[#eef2ff] text-[#6366f1]">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">{model.name}</h3>
                      <div className="mt-1 flex items-center gap-2">
                        <PillarBadge pillar={model.pillar} />
                        <span className="nums font-mono text-[12px] text-slate-400">{model.version}</span>
                      </div>
                    </div>
                  </div>
                  <ChipRoot variant="soft" color={statusCfg.chipColor} size="sm">
                    <ChipLabel className="text-[11px]">{statusCfg.label}</ChipLabel>
                  </ChipRoot>
                </div>

                <div className="border-t hairline p-6">
                  <p className="mb-4 text-[13px] leading-relaxed text-slate-600">{model.description}</p>

                  {/* Metrics grid */}
                  <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {metrics.map((m) => (
                      <div key={m.label} className="rounded border hairline bg-slate-50/60 p-3 text-center">
                        <p
                          className={`nums text-[24px] font-semibold ${m.alert ? 'text-amber-600' : 'text-slate-900'}`}
                        >
                          {m.value}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Training info */}
                    <div>
                      <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Training Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-400">Deployed</span>
                          <span className="nums text-slate-700">{formatDate(model.deployedAt)}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-slate-400">Decisions processed</span>
                          <span className="nums text-slate-700">{model.totalDecisions.toLocaleString()}</span>
                        </div>
                        <div className="text-[13px]">
                          <span className="text-slate-400">Training data:</span>
                          <p className="mt-0.5 text-slate-600">{model.trainedOn}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bias report — visually distinct, governance-critical */}
                    <div>
                      <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Bias Report
                      </h4>
                      <div className="space-y-2 rounded border hairline bg-slate-50/60 p-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] text-slate-500">Overall Status</span>
                          <div className="flex items-center gap-1.5">
                            {biasCfg.icon}
                            <span className={`text-[13px] font-semibold ${biasCfg.cls}`}>{biasCfg.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-slate-500">Gender Bias</span>
                          <span className="text-slate-700">{model.biasReport.genderBias}</span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-slate-500">Geographic Bias</span>
                          <span className="text-slate-700">{model.biasReport.geographicBias}</span>
                        </div>
                        <div className="flex items-center justify-between text-[13px]">
                          <span className="text-slate-500">Last checked</span>
                          <span className="nums text-slate-700">{model.biasReport.lastChecked}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-slate-400" />
                      <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                        Capabilities
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {model.capabilities.map((cap) => (
                        <ChipRoot key={cap} variant="soft" color="default" size="sm">
                          <ChipLabel className="text-[11.5px]">{cap}</ChipLabel>
                        </ChipRoot>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
