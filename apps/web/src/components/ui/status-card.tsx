import type { ReactNode } from 'react'
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button.tsx'
import { WindowControls } from '@/components/layout/window/window-bar.tsx'

interface StatusCardProps {
  title: string
  message?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

function StatusCard({
  title,
  message,
  icon,
  action,
  className,
}: StatusCardProps) {
  return (
    <div
      className={cn(
        'max-w-md rounded-lg border border-neutral-800 bg-neutral-900/80 shadow-xl',
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800">
        <WindowControls />
      </div>
      <div className="p-6 text-center">
        {icon && (
          <div className="mb-4 flex justify-center text-neutral-500">
            {icon}
          </div>
        )}

        <h3 className="text-base font-semibold text-neutral-200 mb-2">
          {title}
        </h3>

        {message && (
          <p className="text-sm text-neutral-500 leading-relaxed">{message}</p>
        )}

        {action && (
          <Button size="sm" onClick={action.onClick} className="mt-5">
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

export { StatusCard }
export type { StatusCardProps }
