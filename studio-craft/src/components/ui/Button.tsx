import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'subtle'
export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap ' +
  'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-brand ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-[0_8px_30px_-10px_rgb(139_92_246_/_0.7)] ' +
    'hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-12px_rgb(139_92_246_/_0.85)]',
  outline:
    'border border-line-strong text-ink hover:border-violet-brand/60 hover:bg-white/[0.04] hover:-translate-y-0.5',
  ghost: 'text-ink-muted hover:text-ink hover:bg-white/[0.05]',
  subtle:
    'border border-line bg-obsidian-card text-ink hover:border-line-strong hover:bg-obsidian-raised',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[0.8125rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-[0.95rem]',
}

export function buttonClasses(
  opts: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {},
) {
  const { variant = 'primary', size = 'md', className } = opts
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
}

export function Button({ variant, size, className, children, ...rest }: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...rest}>
      {children}
    </button>
  )
}
