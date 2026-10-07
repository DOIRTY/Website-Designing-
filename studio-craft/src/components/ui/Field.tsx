import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

const CONTROL =
  'w-full rounded-xl border bg-obsidian px-3.5 text-sm text-ink placeholder:text-ink-subtle ' +
  'transition-all duration-200 outline-none ' +
  'focus:border-violet-brand/60 focus:ring-4 focus:ring-violet-brand/12 ' +
  'disabled:cursor-not-allowed disabled:opacity-45'

type BaseProps = {
  label: string
  /** Visually hides the label but keeps it for assistive tech. */
  labelHidden?: boolean
  error?: string
  hint?: string
  required?: boolean
}

/* ------------------------------------------------------------------- Input */
type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement>

export function Input({
  label,
  labelHidden,
  error,
  hint,
  required,
  className,
  id: idProp,
  ...rest
}: InputProps) {
  const generated = useId()
  const id = idProp ?? generated
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className={cn('text-sm font-medium text-ink', labelHidden && 'sr-only')}>
        {label}
        {required && (
          <span className="ml-1 text-violet-brand" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && !error && hintId) || undefined}
        className={cn(
          CONTROL,
          'h-11',
          error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/12' : 'border-line',
          className,
        )}
        {...rest}
      />

      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/* ---------------------------------------------------------------- Textarea */
type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({
  label,
  labelHidden,
  error,
  hint,
  required,
  className,
  id: idProp,
  ...rest
}: TextareaProps) {
  const generated = useId()
  const id = idProp ?? generated
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className={cn('text-sm font-medium text-ink', labelHidden && 'sr-only')}>
        {label}
        {required && (
          <span className="ml-1 text-violet-brand" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && !error && hintId) || undefined}
        className={cn(
          CONTROL,
          'min-h-24 resize-y py-3 leading-relaxed',
          error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/12' : 'border-line',
          className,
        )}
        {...rest}
      />

      {error ? (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------- Checkbox */
type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: React.ReactNode
  error?: string
}

export function Checkbox({ checked, onChange, label, error }: CheckboxProps) {
  const id = useId()
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-ink-muted transition-colors hover:text-ink"
      >
        <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={error ? true : undefined}
            className="peer absolute size-5 cursor-pointer appearance-none rounded-md border border-line-strong bg-obsidian transition-all checked:border-violet-brand checked:bg-brand-gradient focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-brand"
          />
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none relative size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            fill="none"
            stroke="currentColor"
            strokeWidth={3.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <span>{label}</span>
      </label>
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  )
}
