import { useToast } from './use-toast'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            'flex items-start gap-3 border p-4 shadow-lg bg-white transition-all',
            t.variant === 'destructive' ? 'border-primary/20 bg-primary/5' : '',
            t.variant === 'success' ? 'border-black/10 bg-black/3' : '',
          ].join(' ')}
        >
          {t.variant === 'success' && <CheckCircle className="h-5 w-5 text-black mt-0.5 shrink-0" />}
          {t.variant === 'destructive' && <XCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />}
          {(!t.variant || t.variant === 'default') && <Info className="h-5 w-5 text-gray-500 mt-0.5 shrink-0" />}
          <div className="flex-1 min-w-0">
            {t.title && <p className="text-sm font-semibold text-neutral-900">{t.title}</p>}
            {t.description && <p className="text-xs text-gray-600 mt-0.5">{t.description}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
