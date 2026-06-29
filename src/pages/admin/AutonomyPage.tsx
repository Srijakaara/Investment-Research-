import { useState } from 'react'
import { ArrowLeft, Info, Save, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, ChipRoot, ChipLabel } from '@heroui/react'
import { Header } from '@/components/common/Header'
import { toast } from '@/components/ui/use-toast'
import { updateAutonomyConfig } from '@/api/admin'

interface AutonomyRule {
  id: string
  pillar: string
  casetype: string
  valueBand: string
  autoApprove: boolean
  threshold: number
  description: string
}

const INITIAL_RULES: AutonomyRule[] = [
  {
    id: 'aut-01',
    pillar: 'Onboarding',
    casetype: 'KYC Verification',
    valueBand: 'All',
    autoApprove: true,
    threshold: 0.92,
    description: 'Auto-approve KYC when AI confidence ≥ 92% and AML score < 0.3',
  },
  {
    id: 'aut-02',
    pillar: 'Onboarding',
    casetype: 'AML Check',
    valueBand: 'All',
    autoApprove: false,
    threshold: 0.97,
    description: 'AML cases always require human review regardless of confidence',
  },
  {
    id: 'aut-03',
    pillar: 'Servicing',
    casetype: 'Account Statement',
    valueBand: 'All',
    autoApprove: true,
    threshold: 0.85,
    description: 'Auto-dispatch statements when confidence ≥ 85%',
  },
  {
    id: 'aut-04',
    pillar: 'Servicing',
    casetype: 'Redemption',
    valueBand: '≤ ₹25 L',
    autoApprove: true,
    threshold: 0.9,
    description: 'Auto-process redemptions below ₹25L with ≥ 90% confidence',
  },
  {
    id: 'aut-05',
    pillar: 'Servicing',
    casetype: 'Redemption',
    valueBand: '> ₹25 L',
    autoApprove: false,
    threshold: 1.0,
    description: 'Large redemptions (> ₹25L) always require human approval',
  },
  {
    id: 'aut-06',
    pillar: 'Regulatory',
    casetype: 'Report Filing',
    valueBand: 'All',
    autoApprove: false,
    threshold: 1.0,
    description: 'All regulatory filings require Compliance Officer sign-off',
  },
]

/** Accessible toggle switch — build once, reuse for any boolean setting. */
function Toggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`relative h-5 w-9 shrink-0 overflow-hidden rounded-full transition-colors ${checked ? 'bg-[#6366f1]' : 'bg-slate-200'}`}
    >
      <span
        className="absolute top-0.5 left-0 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

export function AutonomyPage() {
  const navigate = useNavigate()
  const [rules, setRules] = useState<AutonomyRule[]>(INITIAL_RULES)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(id: string) {
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, autoApprove: !rule.autoApprove } : rule)))
    setDirty(true)
    setSaved(false)
  }

  function updateThreshold(id: string, value: number) {
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, threshold: value } : rule)))
    setDirty(true)
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    await updateAutonomyConfig({ rules })
    setSaving(false)
    setDirty(false)
    setSaved(true)
    toast({ title: 'Autonomy configuration saved', variant: 'success' })
  }

  return (
    <div className="w-full space-y-7 px-8 py-6">
      <Header
        title="Autonomy Envelope"
        subtitle="Configure AI autonomy boundaries — which decisions require human approval"
        actions={
          <Button variant="tertiary" size="sm" onPress={() => navigate('/admin')} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      {/* Info banner */}
      <Card className="flex items-start gap-3 bg-[#eef2ff] p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#6366f1]" />
        <div>
          <p className="font-medium text-slate-800">What is the Autonomy Envelope?</p>
          <p className="mt-0.5 text-[12.5px] text-slate-500">
            The autonomy envelope defines the boundary of decisions AI can take without human approval. Toggle
            auto-approve ON for routine, low-risk decisions. All AI actions are still logged to the Audit Console.
            Higher-risk or high-value decisions should always require human sign-off.
          </p>
        </div>
      </Card>

      {/* Rules list */}
      <Card className="p-0">
        <div className="flex items-center justify-between px-6 py-5">
          <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">Autonomy Rules</h3>
          {dirty ? (
            <Button variant="primary" size="sm" isDisabled={saving} onPress={save} className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          ) : saved ? (
            <ChipRoot variant="soft" color="success" size="sm" className="gap-1">
              <Check className="h-3 w-3" />
              <ChipLabel className="text-[11px]">Saved</ChipLabel>
            </ChipRoot>
          ) : null}
        </div>
        <div className="border-t hairline">
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-col gap-3 border-b hairline px-6 py-4 last:border-0">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#eef2ff] px-2 py-0.5 text-[12px] font-medium text-[#4f46e5]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
                    {rule.pillar}
                  </span>
                  <span className="text-[13px] font-medium text-slate-700">{rule.casetype}</span>
                  <span className="rounded-md border hairline px-1.5 py-0.5 text-[11px] text-slate-400">
                    {rule.valueBand}
                  </span>
                </div>
                <p className="text-[12.5px] text-slate-500">{rule.description}</p>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-md bg-slate-50/60 px-3 py-2.5">
                <div className="flex flex-1 items-center gap-3">
                  <p className="shrink-0 text-[12px] font-medium text-[#4f46e5]">Confidence Threshold</p>
                  <input
                    type="range"
                    min={0.5}
                    max={1}
                    step={0.01}
                    value={rule.threshold}
                    onChange={(e) => updateThreshold(rule.id, parseFloat(e.target.value))}
                    disabled={!rule.autoApprove}
                    className="flex-1 accent-[#6366f1] disabled:opacity-40"
                  />
                  <span className="nums w-10 shrink-0 text-right font-mono text-[12px] text-slate-500">
                    {Math.round(rule.threshold * 100)}%
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 shrink-0">
                  <Toggle checked={rule.autoApprove} onToggle={() => toggle(rule.id)} />
                  <span
                    className={`text-[11px] font-semibold ${rule.autoApprove ? 'text-[#4f46e5]' : 'text-slate-400'}`}
                  >
                    {rule.autoApprove ? 'Auto' : 'Manual'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-[12px] text-slate-400">
        Changes to the autonomy envelope take effect on the next AI decision batch. All configuration changes are
        logged to the audit trail with your identity and timestamp.
      </p>
    </div>
  )
}
