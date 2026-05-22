import type { ReactNode } from 'react'
import { useCommitteeAuth, useEventManagerAuth } from '@/lib/auth.ts'
import Window from '@/components/layout/window.tsx'
import { EmptySheet } from '@/components/layout/sheet.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import NotFound from '@/components/not-found.tsx'

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

  // We intentionally don't distinguish "not signed in" from "not allowed" —
  // both render the generic 404 so the existence of protected pages isn't
  // leaked to unauthenticated or unauthorised users.
  if (!isAuthenticated || (requireEventManager && !canManageEvents)) {
    return <NotFound />
  }

  return <>{children}</>
}

export { ProtectedRoute }
