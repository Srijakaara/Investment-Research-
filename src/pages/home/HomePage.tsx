import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingDown,
  Bot,
  UserCheck,
  Shield,
  Brain,
  Clock,
  Zap,
  BarChart3,
  ChevronDown,
  Star,
  Building2,
  Scale,
} from 'lucide-react'
import { Button, Card } from '@heroui/react'
import { useAuthStore } from '@/store/authStore'
import { Eyebrow } from '@/components/common/Eyebrow'
import { BeforeAfterStat } from '@/components/common/BeforeAfterStat'

/* ── KPI before/after card ── */
function ImpactCard({
  label,
  before,
  after,
  unit,
  icon: Icon,
}: {
  label: string
  before: string
  after: string
  unit: string
  icon: React.ElementType
}) {
  return (
    <Card className="surface-card group relative overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-sm bg-indigo-50 text-indigo-600">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex items-end gap-3">
        <div>
          <p className="mb-0.5 text-xs text-muted-foreground">Before AI</p>
          <p className="nums text-xl font-semibold text-muted-foreground line-through">
            {before}
            {unit}
          </p>
        </div>
        <ArrowRight className="mb-1.5 h-4 w-4 shrink-0 text-indigo-400" />
        <div>
          <p className="mb-0.5 text-xs font-semibold text-indigo-600">After AI</p>
          <p className="nums text-2xl font-bold tracking-tight text-foreground">
            {after}
            {unit}
          </p>
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
        <TrendingDown className="h-5 w-5 text-indigo-500" />
      </div>
    </Card>
  )
}

/* ── Pillar feature card ── */
function PillarCard({
  title,
  description,
  capabilities,
  icon: Icon,
  badge,
}: {
  title: string
  description: string
  capabilities: string[]
  icon: React.ElementType
  badge: string
}) {
  return (
    <Card className="surface-card group flex flex-col p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-sm border border-border bg-muted px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {badge}
        </span>
      </div>
      <h3 className="mb-2 text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <ul className="space-y-1.5">
        {capabilities.map((c) => (
          <li key={c} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            {c}
          </li>
        ))}
      </ul>
    </Card>
  )
}

/* ── How-it-works step ── */
function Step({ num, title, desc, icon: Icon }: { num: string; title: string; desc: string; icon: React.ElementType }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-indigo-200 bg-indigo-50 text-sm font-bold text-indigo-600">
          {num}
        </div>
        <div className="mt-2 w-px flex-1 bg-border" />
      </div>
      <div className="min-w-0 pt-1 pb-8">
        <div className="mb-1 flex items-center gap-2">
          <Icon className="h-4 w-4 text-indigo-500" />
          <h4 className="text-sm font-semibold tracking-tight text-foreground">{title}</h4>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════ */
export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  function handleCTA() {
    navigate(isAuthenticated ? '/dashboard' : '/login')
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ── TOP NAV ──────────────────────────────── */}
      <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="grid h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Cpu className="mx-auto h-6 w-6" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-foreground">Ascend AI</span>
            <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">Investor Servicing Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Features
          </Button>
          <Button variant="primary" size="sm" onClick={handleCTA} className="gap-1.5">
            {isAuthenticated ? 'Go to Dashboard' : 'Sign In'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────── */}
      <section className="bg-white">
        <div className="px-6 py-20 md:px-12 md:py-28 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: text */}
            <div>
              <Eyebrow icon={<Zap className="h-3 w-3" />} className="mb-5">
                Human-in-the-Loop AI
              </Eyebrow>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                AI-Driven
                <span className="block text-indigo-600">Investor Servicing</span>
                Platform
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                The first Human-in-the-Loop AI system built for Indian AMC operations. Automate onboarding, servicing,
                regulatory reporting — while keeping humans in control of every critical decision.
              </p>

              <div className="mb-10 flex flex-wrap gap-3">
                <Button variant="primary" size="lg" onClick={handleCTA} className="gap-2">
                  {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Platform'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Features
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Users, value: '3.8M', label: 'Investors' },
                  { icon: Building2, value: '₹42,800 Cr', label: 'AUM' },
                  { icon: Scale, value: 'SEBI', label: 'Regulated' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <s.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="nums text-sm font-semibold text-foreground">{s.value}</span>
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: live stats glass card */}
            <div className="hidden animate-fade-in-up lg:block">
              <Card className="surface-card space-y-1 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Live Platform Status
                  </span>
                </div>

                <BeforeAfterStat label="Onboarding Time" before="72h" after="8.4h" delta="−88%" />
                <BeforeAfterStat label="Query Resolution" before="54h" after="4.2h" delta="−92%" />
                <BeforeAfterStat label="Ops Cost / Investor" before="baseline" after="−21%" delta="saved" />
                <BeforeAfterStat label="Regulatory Cycle" before="baseline" after="−36%" delta="faster" />
                <BeforeAfterStat label="AI Auto-Resolution" before="0%" after="82.1%" delta="servicing" />

                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Bot className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-medium text-foreground">
                    8 decisions awaiting human review ·{' '}
                    <span className="nums font-semibold text-indigo-600">47 auto-resolved today</span>
                  </span>
                </div>
              </Card>

              {/* floating badges */}
              <div className="mt-4 flex gap-3">
                <Card className="surface-card flex-1 px-4 py-3 text-center">
                  <p className="nums text-xl font-bold tracking-tight text-foreground">94.2%</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">AI Confidence Avg</p>
                </Card>
                <Card className="surface-card flex-1 px-4 py-3 text-center">
                  <p className="nums text-xl font-bold tracking-tight text-foreground">4</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">AI Pillars Active</p>
                </Card>
                <Card className="surface-card flex-1 px-4 py-3 text-center">
                  <p className="nums text-xl font-bold tracking-tight text-indigo-600">24/7</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Live Monitoring</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────── */}
      <section className="border-y border-border bg-muted py-4">
        <div className="flex flex-wrap items-center justify-center gap-8 px-6 md:gap-12 md:px-12">
          {[
            { icon: Star, text: 'SEBI Compliant Architecture' },
            { icon: Shield, text: 'AMFI Reporting Ready' },
            { icon: CheckCircle2, text: 'PMLA / KRA Integrated' },
            { icon: Zap, text: 'Human-in-the-Loop by Design' },
            { icon: BarChart3, text: 'Full Audit Trail' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-4 w-4 shrink-0 text-indigo-500" />
              <span className="text-xs font-semibold whitespace-nowrap">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── KPI IMPACT ───────────────────────────── */}
      <section className="bg-background py-20 md:py-24" id="impact">
        <div className="px-6 md:px-12">
          <div className="mb-12 text-center">
            <Eyebrow icon={<TrendingDown className="h-3 w-3" />} className="mb-4">
              Measurable Impact
            </Eyebrow>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              From baseline to breakthrough
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground">
              Ascend AI delivers dramatic improvements across all key operational metrics — built for sustained,
              long-term performance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <ImpactCard label="Investor Onboarding" before="72" after="8.4" unit="h" icon={UserCheck} />
            <ImpactCard label="Query Resolution" before="54" after="4.2" unit="h" icon={Clock} />
            <ImpactCard label="Ops Cost Index" before="100" after="79" unit="%" icon={BarChart3} />
            <ImpactCard label="Regulatory Cycle" before="100" after="64" unit="%" icon={Scale} />
          </div>

          {/* Bottom callout */}
          <Card className="surface-card mt-10 p-6 text-center md:p-8">
            <p className="mb-2 text-sm text-muted-foreground">Business hypothesis, validated</p>
            <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              AMCs with AI investor servicing achieve{' '}
              <span className="text-indigo-600">30–40% lower operating costs</span> within 12 months.
            </p>
          </Card>
        </div>
      </section>

      {/* ── 4 PILLARS ────────────────────────────── */}
      <section className="bg-muted py-20 md:py-24" id="features">
        <div className="px-6 md:px-12">
          <div className="mb-12 text-center">
            <Eyebrow icon={<Cpu className="h-3 w-3" />} className="mb-4">
              4 Capability Pillars
            </Eyebrow>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              AI that serves every dimension
              <br />
              of your AMC operations
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
              Four integrated AI systems, each with its own model, each compounding value over time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <PillarCard
              title="Investor Onboarding"
              badge="Pillar 1"
              description="Automates KYC verification, AML screening, and investor risk profiling end-to-end — cutting 3-day onboarding to under 6 hours."
              icon={UserCheck}
              capabilities={[
                'PAN + Aadhaar verification',
                'AML FinScan screening',
                'CKYC registry lookup',
                'Risk profile generation',
                'NRI / FEMA compliance',
              ]}
            />
            <PillarCard
              title="Servicing AI Agent"
              badge="Pillar 2"
              description="Handles investor queries, SIP changes, redemptions, and account statements — auto-resolving 82% of cases without human touch."
              icon={Bot}
              capabilities={[
                'Conversational NLP engine',
                'SIP lifecycle management',
                'Redemption processing',
                'Statement generation',
                'Distress signal detection',
              ]}
            />
            <PillarCard
              title="Regulatory Drafting"
              badge="Pillar 3"
              description="Auto-drafts SEBI and AMFI reports, runs reconciliation checks, and validates format against current circulars — compliance officer signs off."
              icon={Scale}
              capabilities={[
                'SEBI report drafting',
                'AMFI data compilation',
                'Reconciliation engine',
                'Circular format validation',
                'SCORES complaint response',
              ]}
            />
            <PillarCard
              title="Servicing Memory"
              badge="Pillar 4"
              description="The compounding layer — captures every interaction, identifies patterns, and gets smarter each week, reducing cost per case continuously."
              icon={Brain}
              capabilities={[
                'Pattern extraction',
                'Knowledge indexing',
                'Confidence calibration',
                'Cross-pillar learning',
                'Anomaly detection',
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="bg-background py-20 md:py-24">
        <div className="px-6 md:px-12">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow icon={<Zap className="h-3 w-3" />} className="mb-4">
                Human-in-the-Loop
              </Eyebrow>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                AI proposes. Humans decide.
                <br />
                Every time.
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                Ascend AI is not an autopilot. It's an intelligent assistant that handles the analysis, evidence
                gathering, and proposal — so your team can make faster, better-informed decisions. AI generates,
                humans approve.
              </p>
              <div className="flex flex-wrap gap-4">
                <Card className="surface-card min-w-25 px-4 py-3 text-center">
                  <p className="nums text-xl font-bold text-emerald-600">82%</p>
                  <p className="text-xs text-muted-foreground">Auto-resolved</p>
                </Card>
                <Card className="surface-card min-w-25 px-4 py-3 text-center">
                  <p className="nums text-xl font-bold text-amber-600">18%</p>
                  <p className="text-xs text-muted-foreground">Human reviewed</p>
                </Card>
                <Card className="surface-card min-w-25 px-4 py-3 text-center">
                  <p className="nums text-xl font-bold text-indigo-600">100%</p>
                  <p className="text-xs text-muted-foreground">Audit logged</p>
                </Card>
              </div>
            </div>

            <div className="space-y-0">
              <Step
                num="1"
                icon={Bot}
                title="AI Processes the Event"
                desc="An investor action or system trigger arrives. The AI model for that pillar runs analysis — checking identity, intent, risk, compliance, confidence — in under 2 seconds."
              />
              <Step
                num="2"
                icon={BarChart3}
                title="Proposal + Evidence Generated"
                desc="The AI produces a clear proposal (Approve / Hold / Reject), explains its rationale, shows supporting evidence, and assigns a confidence score. High-confidence cases auto-resolve."
              />
              <Step
                num="3"
                icon={UserCheck}
                title="Human Reviews and Decides"
                desc="Low-confidence or high-value cases land in the Operational Workbench. The ops agent reviews the AI's work, approves or overrides with a reason, and every action is logged to the Audit Console."
              />
              <Step
                num="4"
                icon={Brain}
                title="Memory Compounds the Learning"
                desc="Every resolved decision — including human overrides — becomes a training signal. The platform gets faster, more accurate, and cheaper to operate every week."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 UI SURFACES ────────────────────────── */}
      <section className="bg-muted py-20 md:py-24">
        <div className="px-6 md:px-12">
          <div className="mb-12 text-center">
            <Eyebrow icon={<BarChart3 className="h-3 w-3" />} className="mb-4">
              4 UI Surfaces
            </Eyebrow>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              One platform, four perspectives
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
              Each persona gets the view they need — no clutter, no context-switching.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Executive Dashboard',
                icon: BarChart3,
                desc: 'Real-time KPI trends vs baseline. Mobile-ready for the CIO review meeting.',
                role: 'CIO / CEO',
              },
              {
                title: 'Operational Workbench',
                icon: Bot,
                desc: 'Daily work queue. AI proposals, one-click approve/reject, SLA countdown.',
                role: 'Ops Agent',
              },
              {
                title: 'Audit Console',
                icon: Shield,
                desc: 'Full decision replay. Every input, AI output, confidence score, and override — SEBI-defensible.',
                role: 'Compliance',
              },
              {
                title: 'Admin Console',
                icon: Scale,
                desc: 'Autonomy envelope, integration health, model cards, bias reports.',
                role: 'IT / Platform',
              },
            ].map((s) => (
              <Card key={s.title} className="surface-card p-5">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-sm bg-indigo-50 text-indigo-600">
                  <s.icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="mb-2 text-sm font-semibold tracking-tight text-foreground">{s.title}</h3>
                <span className="mb-3 inline-block rounded-sm border border-border bg-white px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                  {s.role}
                </span>
                <p className="text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="grid h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Cpu className="mx-auto h-9 w-9" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Ready to see it live?</h2>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-muted-foreground">
            Sign in as any of the 4 demo personas and explore the full platform — Executive, Ops Agent, Auditor, or
            Admin. All mock data, zero setup.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg" onClick={handleCTA} className="gap-2">
              {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Platform'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            {['exec@ascend.com', 'ops@ascend.com', 'auditor@ascend.com', 'admin@ascend.com'].map((e) => (
              <span key={e} className="font-mono">
                {e}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            All accounts use password: <span className="font-mono font-bold text-foreground">demo123</span>
          </p>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-border bg-white py-8">
        <div className="flex flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-12">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Cpu className="mx-auto h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">Ascend AI</span>
          </div>
          <p className="text-xs font-medium text-muted-foreground">AI-Driven Investor Servicing Platform</p>
        </div>
      </footer>
    </div>
  )
}
