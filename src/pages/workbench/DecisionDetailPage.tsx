import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Bot,
  Clock,
  Tag,
  Shield,
  ChevronRight,
} from 'lucide-react'
import { Button, Card } from '@heroui/react'
import { useDecisionsStore } from '@/store/decisionsStore'
import { useAuthStore } from '@/store/authStore'
import { Header } from '@/components/common/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { PillarBadge } from '@/components/common/PillarBadge'
import { ConfidenceBar } from '@/components/common/ConfidenceBar'
import { toast } from '@/components/ui/use-toast'
import { formatDateTime, slaCountdown } from '@/lib/utils'
import { executeDecision } from '@/api/decisions'

type ActionType = 'reject' | 'escalate' | null

/** Shared label style for every field across the page's info cards. */
const SECTION_LABEL = 'text-[11px] font-semibold uppercase tracking-wide text-slate-400'

const TEXTAREA_CLS =
  'w-full resize-none rounded border hairline bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#c7cdf9] focus:ring-4 focus:ring-[#eef2ff]'

export function DecisionDetailPage() {
  const { decisionId } = useParams<{ decisionId: string }>()
  const navigate = useNavigate()
  const { decisions, load, approve, reject, escalate } = useDecisionsStore()
  const { user } = useAuthStore()
  const [actionDialog, setActionDialog] = useState<ActionType>(null)
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    load()
  }, [])

  const decision = decisions.find((d) => d.id === decisionId)

  if (!decision) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-8 py-24">
        <p className="text-sm text-slate-500">Decision not found.</p>
        <Button variant="tertiary" size="sm" onPress={() => navigate('/workbench')}>
          Back to Workbench
        </Button>
      </div>
    )
  }

  const isPending = decision.status === 'pending'
  const sla = slaCountdown(decision.slaDeadline)

  async function handleApprove() {
    if (!user || !isPending) return
    setSubmitting(true)
    await executeDecision(decision!.id, 'approve')
    approve(decision!.id, user.name)
    toast({ title: 'Decision Approved', description: `${decision!.id} approved by ${user.name}`, variant: 'success' })
    setSubmitting(false)
  }

  async function handleAction(type: ActionType) {
    if (!type || !user || !reason.trim()) return
    setSubmitting(true)
    await executeDecision(decision!.id, type === 'reject' ? 'reject' : 'escalate', reason)
    if (type === 'reject') {
      reject(decision!.id, user.name, reason)
      toast({ title: 'Decision Rejected', description: 'Override reason recorded.', variant: 'destructive' })
    } else {
      escalate(decision!.id, user.name, reason)
      toast({ title: 'Escalated', description: 'Sent to senior team for review.', variant: 'default' })
    }
    setSubmitting(false)
    setActionDialog(null)
    setReason('')
  }

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title={decision.id}
        subtitle={decision.title}
        actions={
          <Button variant="tertiary" size="sm" onPress={() => navigate('/workbench')} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column — record content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Overview card */}
          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{decision.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <PillarBadge pillar={decision.pillar} />
                  <StatusPill status={decision.status} />
                  {isPending && (
                    <span
                      className={`flex items-center gap-1 text-[12.5px] ${sla.urgent ? 'font-semibold text-rose-600' : 'text-slate-400'}`}
                    >
                      <Clock className="h-3 w-3" /> {sla.label}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={SECTION_LABEL}>Model</p>
                <p className="nums font-mono text-[12px] text-slate-500">{decision.modelVersion}</p>
              </div>
            </div>
            <p className="text-[13.5px] leading-relaxed text-slate-600">{decision.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {decision.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md border hairline bg-slate-50/60 px-2 py-0.5 text-[12px] text-slate-500"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </Card>

          {/* Entity details card */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Investor Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className={SECTION_LABEL}>Name</p>
                <p className="mt-0.5 text-[13px] font-medium text-slate-700">{decision.investorName}</p>
              </div>
              <div>
                <p className={SECTION_LABEL}>PAN</p>
                <p className="nums mt-0.5 font-mono text-[13px] text-slate-700">{decision.investorPAN}</p>
              </div>
              <div>
                <p className={SECTION_LABEL}>Investor ID</p>
                <p className="nums mt-0.5 font-mono text-[13px] text-slate-700">{decision.investorId}</p>
              </div>
              <div>
                <p className={SECTION_LABEL}>Created</p>
                <p className="nums mt-0.5 text-[13px] text-slate-600">{formatDateTime(decision.createdAt)}</p>
              </div>
              <div>
                <p className={SECTION_LABEL}>Assigned To</p>
                <p className="mt-0.5 text-[13px] text-slate-600">{decision.assignedTo}</p>
              </div>
              <div>
                <p className={SECTION_LABEL}>SLA Deadline</p>
                <p
                  className={`nums mt-0.5 text-[13px] ${sla.urgent ? 'font-semibold text-rose-600' : 'text-slate-600'}`}
                >
                  {formatDateTime(decision.slaDeadline)}
                </p>
              </div>
            </div>
          </Card>

          {/* AI Analysis — bespoke chrome, the page's focal card */}
          <Card className="p-0">
            <div className="flex items-center gap-2 border-b hairline px-6 py-4">
              <Bot className="h-4 w-4 text-[#6366f1]" />
              <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">AI Analysis & Proposal</h3>
              <span className="nums ml-auto font-mono text-[12px] text-slate-400">{decision.modelVersion}</span>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <p className={`${SECTION_LABEL} mb-1.5`}>Proposed Action</p>
                <div className="rounded-md border hairline bg-slate-50/60 p-3">
                  <p className="text-[13.5px] font-medium text-slate-800">{decision.aiProposal}</p>
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className={SECTION_LABEL}>AI Confidence</p>
                  <span className="nums text-[13px] font-semibold text-slate-900">
                    {Math.round(decision.confidence * 100)}%
                  </span>
                </div>
                <ConfidenceBar value={decision.confidence} showLabel={false} />
              </div>
              <div>
                <p className={`${SECTION_LABEL} mb-1.5`}>Rationale</p>
                <p className="text-[13.5px] leading-relaxed text-slate-600">{decision.rationale}</p>
              </div>
              <div>
                <p className={`${SECTION_LABEL} mb-2`}>Evidence</p>
                <div className="space-y-1.5">
                  {decision.evidence.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-[13px]">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span className="text-slate-600">{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Resolution record — conditional, only after the fact */}
          {!isPending && decision.resolvedBy && (
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-400" />
                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Resolution Record</h3>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-4">
                <div>
                  <p className={SECTION_LABEL}>Resolved By</p>
                  <p className="mt-0.5 text-[13px] font-medium text-slate-700">{decision.resolvedBy}</p>
                </div>
                <div>
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
            </Card>
          )}
        </div>

        {/* Right column — sticky action panel */}
        <div className="space-y-4">
          {isPending ? (
            <Card className="sticky top-20 p-6">
              <h3 className="mb-1 text-[15px] font-semibold tracking-tight text-slate-900">Review Decision</h3>
              <p className="mb-4 text-[12.5px] text-slate-400">
                AI has proposed an action. Review the analysis and approve, reject with reason, or escalate.
              </p>

              <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <p className="mb-1 text-[12px] font-semibold text-emerald-700">AI Recommends:</p>
                <p className="line-clamp-2 text-[13px] font-medium text-emerald-800">{decision.aiProposal}</p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="primary"
                  fullWidth
                  isDisabled={submitting}
                  onPress={handleApprove}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve AI Proposal
                </Button>
                <Button
                  variant="tertiary"
                  fullWidth
                  isDisabled={submitting}
                  onPress={() => {
                    setActionDialog('escalate')
                    setReason('')
                  }}
                  className="gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Escalate
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  isDisabled={submitting}
                  onPress={() => {
                    setActionDialog('reject')
                    setReason('')
                  }}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4 text-rose-500" />
                  Reject with Reason
                </Button>
              </div>

              <div className="mt-4 border-t hairline pt-4">
                <p className="text-[11.5px] text-slate-400">
                  All actions are logged to the Audit Console with your identity and timestamp.
                </p>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h3 className="mb-3 text-[15px] font-semibold tracking-tight text-slate-900">Decision Resolved</h3>
              <StatusPill status={decision.status} />
              <button
                onClick={() => navigate(`/audit/${decision.id}`)}
                className="mt-4 flex w-full items-center justify-between rounded-md border hairline bg-slate-50/60 px-3 py-2 text-[13px] text-slate-600 transition-colors hover:bg-slate-100"
              >
                View Audit Trail
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </Card>
          )}
        </div>
      </div>

      {/* Reject / Escalate confirmation modal */}
      {actionDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 p-4"
          onClick={() => setActionDialog(null)}
        >
          <Card className="w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
              {actionDialog === 'reject' ? 'Reject Decision' : 'Escalate Decision'}
            </h3>
            <p className="mt-1 text-[12.5px] text-slate-400">
              {actionDialog === 'reject'
                ? 'Provide a reason for rejecting this AI proposal. This will be recorded in the audit log.'
                : 'Provide context for escalation. The senior team will be notified.'}
            </p>

            <div className="mt-4">
              <label className={`${SECTION_LABEL} mb-1.5 block`}>
                {actionDialog === 'reject' ? 'Override Reason *' : 'Escalation Reason *'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder={
                  actionDialog === 'reject'
                    ? 'e.g. AI confidence too low for this investor segment…'
                    : 'e.g. Value exceeds ₹25L threshold, needs senior RM approval…'
                }
                className={TEXTAREA_CLS}
              />
              <p className="nums mt-1 text-[11.5px] text-slate-400">{reason.length}/500</p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="tertiary" onPress={() => setActionDialog(null)}>
                Cancel
              </Button>
              <Button
                variant={actionDialog === 'reject' ? 'secondary' : 'primary'}
                isDisabled={!reason.trim() || submitting}
                onPress={() => handleAction(actionDialog)}
              >
                {submitting ? 'Processing…' : actionDialog === 'reject' ? 'Confirm Reject' : 'Escalate'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
