import { LogIn, ShieldX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCommitteeAuth, useEventManagerAuth } from '@/lib/auth.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'
import Window from '@/components/layout/window/window.tsx'
import { EmptySheet } from '@/components/layout/sheet.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

interface ProtectedRouteProps {
  children: ReactNode
  activeTab?: string
  requireEventManager?: boolean
}

function ProtectedRoute({
  children,
  activeTab,
  requireEventManager = false,
}: ProtectedRouteProps) {
  const { isLoaded, isAuthenticated } = useCommitteeAuth()
  const { canManageEvents } = useEventManagerAuth()

  if (!isLoaded) {
    return (
      <Window activeTab={activeTab}>
        <EmptySheet>
          <Spinner className="w-8 h-8 text-neutral-600" />
        </EmptySheet>
      </Window>
    )
  }

  if (!isAuthenticated) {
    return (
      <Window activeTab={activeTab}>
        <EmptySheet>
          <StatusCard
            title="Authentication required"
            message="You need to sign in to access this page."
            icon={<LogIn className="w-10 h-10" strokeWidth={1.5} />}
          />
        </EmptySheet>
      </Window>
    )
  }

  if (requireEventManager && !canManageEvents) {
    return (
      <Window activeTab={activeTab}>
        <EmptySheet>
          <StatusCard
            title="Access denied"
            message="This area is restricted to event managers. You need to be a committee member or SIG executive."
            icon={<ShieldX className="w-10 h-10" strokeWidth={1.5} />}
          />
        </EmptySheet>
      </Window>
    )
  }

  return <>{children}</>
}

export { ProtectedRoute }
