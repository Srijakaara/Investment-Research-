import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Cpu } from 'lucide-react'
import { Button, Card, ChipRoot, ChipLabel } from '@heroui/react'
import { useAuthStore } from '@/store/authStore'

const DEMO_ACCOUNTS = [
  { label: 'Executive', email: 'exec@ascend.com' },
  { label: 'Ops Agent', email: 'ops@ascend.com' },
  { label: 'Auditor', email: 'auditor@ascend.com' },
  { label: 'Admin', email: 'admin@ascend.com' },
]

const INPUT_CLASS =
  'h-10 w-full rounded border hairline bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#c7cdf9] focus:ring-4 focus:ring-[#eef2ff]'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 500))
    const ok = login(email, password)
    setLoading(false)
    if (ok) {
      navigate('/dashboard', { replace: true })
    } else {
      setError('Invalid email or password. Use demo credentials below.')
    }
  }

  function quickFill(demoEmail: string) {
    setEmail(demoEmail)
    setPassword('demo123')
    setError('')
  }

  return (
    <Card className="p-8">
      {/* Brand lockup — identical to the sidebar header */}
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#6366f1] text-white shadow-sm">
          <Cpu size={17} />
        </div>
        <div>
          <h1 className="text-[15px] font-semibold leading-none tracking-tight text-slate-900">Ascend AI</h1>
          <p className="mt-1 text-[12px] text-slate-400">Investor Servicing Platform</p>
        </div>
      </div>

      {/* Page heading */}
      <div className="mt-7">
        <h2 className="text-[20px] font-semibold tracking-tight text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-sm text-slate-500">Kaara — Internal Platform</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-slate-600">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ascend.com"
            required
            autoComplete="email"
            className={INPUT_CLASS}
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[13px] font-medium text-slate-600">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className={`${INPUT_CLASS} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error && (
          <ChipRoot variant="soft" color="danger" size="sm" className="w-full">
            <ChipLabel className="text-[12px]">{error}</ChipLabel>
          </ChipRoot>
        )}

        <Button type="submit" variant="primary" size="lg" fullWidth isDisabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {/* Demo accounts — secondary, hairline-separated, auto-fill only */}
      <div className="mt-7 border-t hairline pt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Quick Access — Demo Accounts (password: demo123)
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.map((a) => (
            <Button key={a.email} variant="secondary" size="sm" fullWidth onPress={() => quickFill(a.email)}>
              {a.label}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-400">Click a role to auto-fill credentials, then press Sign in.</p>
      </div>
    </Card>
  )
}
