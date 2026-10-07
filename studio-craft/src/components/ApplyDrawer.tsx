import { useRef, useState, type DragEvent } from 'react'
import { AlertCircle, Check, FileText, Trash2, UploadCloud } from 'lucide-react'
import type { Job } from '@/data/jobs'
import { Drawer } from '@/components/ui/Drawer'
import { Input, Textarea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const isProbablyUrl = (value: string) => {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return url.hostname.includes('.')
  } catch {
    return false
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

type Fields = {
  name: string
  email: string
  portfolio: string
  tools: string
  note: string
}

const EMPTY: Fields = { name: '', email: '', portfolio: '', tools: '', note: '' }

export function ApplyDrawer({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const { toast } = useToast()
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [resume, setResume] = useState<File | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | 'resume', string>>>({})
  const [dragging, setDragging] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const acceptFile = (file: File | undefined) => {
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      setErrors((c) => ({ ...c, resume: 'Use a PDF, DOC or DOCX file.' }))
      return
    }
    if (file.size > MAX_BYTES) {
      setErrors((c) => ({ ...c, resume: 'That file is over the 5 MB limit.' }))
      return
    }
    setErrors((c) => ({ ...c, resume: undefined }))
    setResume(file)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    acceptFile(event.dataTransfer.files?.[0])
  }

  const reset = () => {
    setFields(EMPTY)
    setResume(null)
    setErrors({})
    setDone(false)
    setSubmitting(false)
  }

  const validate = () => {
    const next: typeof errors = {}
    if (fields.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!EMAIL_RE.test(fields.email.trim())) next.email = 'Enter a valid email address.'
    if (!isProbablyUrl(fields.portfolio.trim())) next.portfolio = 'Enter a link to your portfolio.'
    if (fields.tools.trim() && !isProbablyUrl(fields.tools.trim()))
      next.tools = 'That does not look like a valid URL.'
    if (!resume) next.resume = 'Attach your resume.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validate()) {
      toast({ title: 'Check the highlighted fields', tone: 'error' })
      return
    }
    setSubmitting(true)
    // Stands in for the real submission endpoint.
    window.setTimeout(() => {
      setSubmitting(false)
      setDone(true)
      toast({
        title: 'Application sent',
        description: `We'll review your portfolio for ${job?.title} within 3 working days.`,
      })
    }, 1100)
  }

  const close = () => {
    onClose()
    window.setTimeout(reset, 350)
  }

  return (
    <Drawer
      open={job !== null}
      onClose={close}
      title={done ? 'Application received' : `Apply — ${job?.title ?? ''}`}
      description={
        done
          ? 'Thanks for applying. Here is what happens next.'
          : job
            ? `${job.contract} · ${job.location} · ${job.pay}`
            : undefined
      }
    >
      {done ? (
        <div className="grid gap-6">
          <div className="grid size-14 animate-check place-items-center rounded-full bg-brand-gradient text-white">
            <Check className="size-7" aria-hidden="true" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-ink">
              You're in the pipeline, {fields.name.split(' ')[0]}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Our design lead reviews every application personally. If your portfolio is a fit
              you'll get a calendar link for a 30-minute conversation — no take-home test.
            </p>
          </div>

          <ol className="grid gap-3 rounded-xl border border-line bg-obsidian p-4 text-sm">
            {[
              'Portfolio review — 3 working days',
              'Intro call with the design lead — 30 min',
              'Paid trial sprint — 1 week',
            ].map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-ink-muted">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-line bg-white/[0.04] text-xs font-semibold text-ink">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <Button variant="outline" onClick={close}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid gap-5">
          <Input
            label="Full name"
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={fields.name}
            onChange={(e) => set('name', e.target.value)}
            onBlur={() =>
              fields.name.trim().length < 2 &&
              setErrors((c) => ({ ...c, name: 'Please enter your full name.' }))
            }
            error={errors.name}
          />

          <Input
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="ada@studio.com"
            value={fields.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() =>
              !EMAIL_RE.test(fields.email.trim()) &&
              fields.email &&
              setErrors((c) => ({ ...c, email: 'Enter a valid email address.' }))
            }
            error={errors.email}
          />

          <Input
            label="Portfolio link"
            required
            type="url"
            inputMode="url"
            placeholder="https://yourportfolio.com"
            value={fields.portfolio}
            onChange={(e) => set('portfolio', e.target.value)}
            onBlur={() =>
              fields.portfolio &&
              !isProbablyUrl(fields.portfolio.trim()) &&
              setErrors((c) => ({ ...c, portfolio: 'Enter a link to your portfolio.' }))
            }
            error={errors.portfolio}
          />

          <Input
            label="Figma / GitHub URL"
            type="url"
            inputMode="url"
            placeholder="https://github.com/yourname"
            hint="Optional — share a file or repo you're proud of."
            value={fields.tools}
            onChange={(e) => set('tools', e.target.value)}
            error={errors.tools}
          />

          {/* Resume drop-zone */}
          <div className="grid gap-2">
            <span className="text-sm font-medium text-ink">
              Resume
              <span className="ml-1 text-violet-brand" aria-hidden="true">
                *
              </span>
            </span>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                'rounded-xl border-2 border-dashed p-5 text-center transition-colors duration-200',
                dragging
                  ? 'border-violet-brand bg-violet-brand/8'
                  : errors.resume
                    ? 'border-red-500/50 bg-red-500/[0.04]'
                    : 'border-line bg-obsidian hover:border-line-strong',
              )}
            >
              {resume ? (
                <div className="flex items-center gap-3 text-left">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-white/[0.04] text-violet-brand">
                    <FileText className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {resume.name}
                    </span>
                    <span className="text-xs text-ink-subtle">{formatBytes(resume.size)}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResume(null)
                      if (inputRef.current) inputRef.current.value = ''
                    }}
                    aria-label={`Remove ${resume.name}`}
                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-line text-ink-subtle transition-colors hover:border-red-500/50 hover:text-red-400"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <>
                  <UploadCloud
                    className={cn(
                      'mx-auto size-7 transition-colors',
                      dragging ? 'text-violet-brand' : 'text-ink-subtle',
                    )}
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm text-ink-muted">
                    Drag &amp; drop your resume, or{' '}
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="font-semibold text-violet-brand underline underline-offset-2 hover:text-ink"
                    >
                      browse files
                    </button>
                  </p>
                  <p className="mt-1 text-xs text-ink-subtle">PDF, DOC or DOCX · up to 5 MB</p>
                </>
              )}

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="sr-only"
                aria-label="Upload resume"
                aria-invalid={errors.resume ? true : undefined}
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
            </div>

            {errors.resume && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                {errors.resume}
              </p>
            )}
          </div>

          <Textarea
            label="Anything we should know?"
            placeholder="The work you want more of, the tools you love, your timezone…"
            value={fields.note}
            onChange={(e) => set('note', e.target.value)}
          />

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button type="submit" size="lg" disabled={submitting} className="flex-1">
              {submitting ? (
                <>
                  <span
                    className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : (
                'Submit application'
              )}
            </Button>
            <Button type="button" variant="subtle" size="lg" onClick={close}>
              Cancel
            </Button>
          </div>

          <p className="text-xs leading-relaxed text-ink-subtle">
            We read every application. Your details are used only for this role and are deleted
            after 6 months.
          </p>
        </form>
      )}
    </Drawer>
  )
}
