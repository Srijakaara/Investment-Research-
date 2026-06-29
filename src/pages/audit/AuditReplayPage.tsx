import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bot, User, Tag, Shield, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Button, Card } from '@heroui/react'
import { useDecisionsStore } from '@/store/decisionsStore'
import { useAuditStore } from '@/store/auditStore'
import { Header } from '@/components/common/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { PillarBadge } from '@/components/common/PillarBadge'
import { ConfidenceBar } from '@/components/common/ConfidenceBar'
import { formatDateTime } from '@/lib/utils'

/** Shared label style — same constant family used on the live Decision Detail page. */
const SECTION_LABEL = 'text-[11px] font-semibold uppercase tracking-wide text-slate-400'

function StepBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#eef2ff] text-[11px] font-semibold text-[#6366f1]">
      {children}
    </span>
  )
}

export function AuditReplayPage() {
  const { decisionId } = useParams<{ decisionId: string }>()
  const navigate = useNavigate()
  const { decisions, load: loadDecisions } = useDecisionsStore()
  const { entries, load: loadAudit } = useAuditStore()

  useEffect(() => {
    loadDecisions()
    loadAudit()
  }, [])

  const decision = decisions.find((d) => d.id === decisionId)
  const auditEntry = entries.find((e) => e.decisionId === decisionId)

  if (!decision) {
    return (
      <div className="w-full space-y-7 px-8 py-6">
        <Header title="Audit Replay" subtitle="Full audit trail — read only" />
        {decisions.length === 0 ? (
          // Still loading — don't claim "not found" before the store has even fetched.
          <div className="mx-auto h-64 w-full max-w-2xl animate-pulse rounded-md bg-slate-100" />
        ) : (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p className="text-sm text-slate-500">
              Decision <strong className="nums text-slate-700">{decisionId}</strong> not found in current session.
            </p>
            <Button variant="secondary" size="sm" onPress={() => navigate('/audit')} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back to Audit Console
            </Button>
          </div>
        )}
      </div>
    )
  }

  const TIMELINE = [
    {
      step: 'Event Received',
      desc: `Domain event received — ${decision.pillar} pillar triggered`,
      time: decision.createdAt,
      icon: <div className="h-2 w-2 rounded-full bg-slate-400" />,
    },
    {
      step: 'AI Processing',
      desc: `Model ${decision.modelVersion} processed inputs and generated proposal`,
      time: decision.createdAt,
      icon: <Bot className="h-3.5 w-3.5 text-[#6366f1]" />,
    },
    {
      step: 'Proposal Generated',
      desc: `Confidence ${Math.round(decision.confidence * 100)}% — routed to human review queue`,
      time: decision.createdAt,
      icon: <div className="h-2 w-2 rounded-full bg-slate-400" />,
    },
    ...(decision.resolvedAt
      ? [
          {
            step: `Decision ${decision.status.charAt(0).toUpperCase() + decision.status.slice(1)}`,
            desc: decision.overrideReason
              ? `Human override — ${decision.overrideReason}`
              : `Approved by ${decision.resolvedBy}`,
            time: decision.resolvedAt,
            icon: decision.overrideReason ? (
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ),
          },
        ]
      : []),
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-8 py-6">
      <Header
        title={`Replay: ${decision.id}`}
        subtitle="Full audit trail — read only"
        actions={
          <Button variant="secondary" size="sm" onPress={() => navigate('/audit')} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      {/* Header / summary card — same grammar as Decision Detail's overview card */}
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-2 text-[15px] font-semibold tracking-tight text-slate-900">{decision.title}</h2>
            <div className="flex flex-wrap gap-2">
              <PillarBadge pillar={decision.pillar} />
              <StatusPill status={decision.status} />
              {decision.overrideReason && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[12px] font-semibold text-amber-700">
                  <AlertTriangle className="h-3 w-3" /> Human Override
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className={SECTION_LABEL}>Model</p>
            <p className="nums font-mono text-[12px] text-slate-500">{decision.modelVersion}</p>
            <p className="nums mt-0.5 text-[12px] text-slate-400">{formatDateTime(decision.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Numbered reconstruction grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* 1. Inputs to AI */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <StepBadge>1</StepBadge>
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Inputs to AI</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className={SECTION_LABEL}>Investor</p>
              <p className="mt-0.5 text-[13px] font-medium text-slate-700">{decision.investorName}</p>
              <p className="nums font-mono text-[12px] text-slate-400">
                {decision.investorPAN} · {decision.investorId}
              </p>
            </div>
            <div>
              <p className={SECTION_LABEL}>Event Description</p>
              <p className="mt-0.5 text-[13px] text-slate-600">{decision.description}</p>
            </div>
            <div>
              <p className={`${SECTION_LABEL} mb-1`}>Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {decision.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md border hairline bg-slate-50/60 px-1.5 py-0.5 text-[12px] text-slate-500"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 2. AI Output — same visual treatment as Decision Detail's AI Analysis card */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <StepBadge>2</StepBadge>
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">AI Output</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className={`${SECTION_LABEL} mb-1`}>Proposal</p>
              <div className="rounded-md border hairline bg-slate-50/60 p-3">
                <p className="text-[13.5px] font-medium text-slate-800">{decision.aiProposal}</p>
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className={SECTION_LABEL}>Confidence Score</p>
                <span className="nums text-[13px] font-semibold text-slate-900">
                  {Math.round(decision.confidence * 100)}%
                </span>
              </div>
              <ConfidenceBar value={decision.confidence} showLabel={false} />
            </div>
            <div>
              <p className={SECTION_LABEL}>Model Version</p>
              <p className="nums mt-0.5 font-mono text-[13px] text-slate-600">{decision.modelVersion}</p>
            </div>
          </div>
        </Card>

        {/* 3. Rationale & Evidence */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <StepBadge>3</StepBadge>
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Rationale & Evidence</h3>
          </div>
          <p className="mb-3 text-[13.5px] leading-relaxed text-slate-600">{decision.rationale}</p>
          <div className="space-y-1.5">
            {decision.evidence.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span className="text-slate-600">{e}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Human Action */}
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <StepBadge>
              <User className="h-3.5 w-3.5" />
            </StepBadge>
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Human Action</h3>
          </div>
          {decision.resolvedBy ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className={SECTION_LABEL}>Action</p>
                  <div className="mt-0.5">
                    <StatusPill status={decision.status} />
                  </div>
                </div>
                <div>
                  <p className={SECTION_LABEL}>By</p>
                  <p className="mt-0.5 text-[13px] font-medium text-slate-700">{decision.resolvedBy}</p>
                </div>
                <div className="col-span-2">
                  <p className={SECTION_LABEL}>Resolved At</p>
                  <p className="nums mt-0.5 text-[13px] text-slate-600">
                    {decision.resolvedAt ? formatDateTime(decision.resolvedAt) : '—'}
                  </p>
                </div>
              </div>
              {decision.overrideReason && (
                <div>
                  <p className={`${SECTION_LABEL} mb-1`}>Override Reason</p>
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                    <p className="text-[13px] text-amber-700">{decision.overrideReason}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 py-8 text-center text-slate-400">
              <Shield size={28} className="mb-1 text-slate-300" />
              <p className="text-[13px]">Decision still pending</p>
              <p className="text-[12px]">No human action recorded yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Decision timeline — the page's signature element */}
      <Card className="p-6">
        <h3 className="mb-4 text-[15px] font-semibold tracking-tight text-slate-900">Decision Timeline</h3>
        <div>
          {TIMELINE.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border hairline bg-slate-50">
                  {step.icon}
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-[#ececf1]" style={{ minHeight: '24px' }} />
                )}
              </div>
              <div className="pb-4">
                <p className="text-[13px] font-medium text-slate-800">{step.step}</p>
                <p className="mt-0.5 text-[12px] text-slate-600">{step.desc}</p>
                <p className="nums mt-0.5 text-[12px] text-slate-400">{formatDateTime(step.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Raw audit-entry metadata footer */}
      {auditEntry && (
        <Card className="p-4">
          <p className={`${SECTION_LABEL} mb-2`}>Audit Log Entry</p>
          <div className="grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-4">
            <div>
              <span className="text-slate-400">Audit ID:</span>{' '}
              <span className="nums font-mono text-slate-600">{auditEntry.id}</span>
            </div>
            <div>
              <span className="text-slate-400">Model:</span>{' '}
              <span className="nums font-mono text-slate-600">{auditEntry.modelVersion}</span>
            </div>
            <div>
              <span className="text-slate-400">Confidence:</span>{' '}
              <span className="nums text-slate-600">{Math.round(auditEntry.confidence * 100)}%</span>
            </div>
            <div>
              <span className="text-slate-400">Override:</span>{' '}
              <span className={auditEntry.overridden ? 'font-semibold text-amber-600' : 'text-slate-600'}>
                {auditEntry.overridden ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
