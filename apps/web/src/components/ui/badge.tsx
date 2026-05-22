import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils.ts'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 font-semibold border whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-card border-card-border text-neutral-300',
        outline: 'bg-transparent border-card-border text-neutral-500',
        muted: 'bg-card-muted border-card-border text-neutral-400',
        accepted:
          'bg-status-accepted-bg border-status-accepted-border text-status-accepted',
        pending:
          'bg-status-pending-bg border-status-pending-border text-status-pending',
        waitlist:
          'bg-status-waitlist-bg border-status-waitlist-border text-status-waitlist',
        rejected:
          'bg-status-rejected-bg border-status-rejected-border text-status-rejected',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-sm',
        md: 'text-xs px-2.5 py-1 rounded-sm',
        lg: 'text-sm sm:text-base px-5 py-1.5 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

interface BadgeProps
  extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
export type { BadgeProps }
