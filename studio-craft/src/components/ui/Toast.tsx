import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastTone = 'success' | 'error' | 'info'

type Toast = {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

type ToastContextValue = {
  toast: (t: { title: string; description?: string; tone?: ToastTone }) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
} as const

const TONE_STYLES: Record<ToastTone, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-cyan-brand',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback<ToastContextValue['toast']>(
    ({ title, description, tone = 'success' }) => {
      const id = nextId.current++
      setToasts((current) => [...current.slice(-2), { id, title, description, tone }])
      window.setTimeout(() => dismiss(id), 4200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className="pointer-events-none fixed inset-x-4 bottom-4 z-200 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
          role="region"
          aria-label="Notifications"
        >
          {toasts.map((t) => {
            const Icon = ICONS[t.tone]
            return (
              <div
                key={t.id}
                role="status"
                aria-live="polite"
                className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl border border-line bg-obsidian-card/95 p-3.5 shadow-lift backdrop-blur-xl"
              >
                <Icon
                  className={cn('mt-0.5 size-5 shrink-0', TONE_STYLES[t.tone])}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-sm leading-snug text-ink-muted">{t.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  aria-label={`Dismiss notification: ${t.title}`}
                  className="grid size-6 shrink-0 place-items-center rounded-md text-ink-subtle transition-colors hover:bg-white/5 hover:text-ink"
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
