import { useNavigate } from 'react-router-dom'
import { Shield, Cpu, Plug, ArrowRight, Settings, Users } from 'lucide-react'
import { Card, ChipRoot, ChipLabel } from '@heroui/react'
import { Header } from '@/components/common/Header'
import { StatCard } from '@/components/common/StatCard'
import { SectionLabel } from '@/components/common/SectionLabel'

const ADMIN_SECTIONS = [
  {
    title: 'Autonomy Envelope',
    description:
      'Configure which decisions AI can take autonomously vs. requiring human approval. Set value bands and confidence thresholds per case type.',
    icon: Shield,
    path: '/admin/autonomy',
    summary: '6 rules configured',
  },
  {
    title: 'Integrations',
    description:
      'Monitor integration health with SS&C Geneva, KRA, SEBI SCORES, Investor Portal, and AMFI. View latency, uptime, and alerts.',
    icon: Plug,
    path: '/admin/integrations',
    summary: '1 degraded · 4 healthy',
    warn: true,
  },
  {
    title: 'AI Model Registry',
    description:
      'View model cards, bias reports, accuracy metrics, and deployment status for all 4 AI models across the platform.',
    icon: Cpu,
    path: '/admin/models',
    summary: '3 production · 1 beta',
  },
] as const

export function AdminPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title="Admin Console"
        subtitle="Platform configuration, integrations, and model governance"
        actions={
          <ChipRoot variant="soft" color="default" size="sm" className="gap-1.5">
            <Settings className="h-3 w-3" />
            <ChipLabel className="text-[11px]">Admin only</ChipLabel>
          </ChipRoot>
        }
      />

      {/* Platform stats */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <StatCard icon={<Users className="h-3.5 w-3.5" />} tone="primary" value="4" label="Active Users" />
        <StatCard icon={<Cpu className="h-3.5 w-3.5" />} tone="primary" value="4" label="AI Models" />
        <StatCard icon={<Plug className="h-3.5 w-3.5" />} tone="pending" value="5" label="Integrations" />
        <StatCard icon={<Shield className="h-3.5 w-3.5" />} tone="primary" value="6" label="Autonomy Rules" />
      </div>

      {/* Configuration zones */}
      <div>
        <SectionLabel hint="Click a tile to configure">Configuration</SectionLabel>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => {
            const Icon = section.icon
            return (
              <Card
                key={section.path}
                role="button"
                tabIndex={0}
                onClick={() => navigate(section.path)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navigate(section.path)
                }}
                className="flex flex-col p-5 text-left transition-colors hover:bg-slate-50/60"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-sm bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-slate-900">{section.title}</h3>
                <p className="mb-4 flex-1 text-[13px] leading-relaxed text-slate-500">{section.description}</p>
                <div className="flex items-center justify-between border-t hairline pt-3">
                  <span className={section.warn ? 'text-[12px] font-medium text-amber-600' : 'text-[12px] text-slate-400'}>
                    {section.summary}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
