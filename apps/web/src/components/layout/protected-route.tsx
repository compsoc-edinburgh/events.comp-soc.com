import type { ReactNode } from 'react'
import { useCommitteeAuth, useEventManagerAuth } from '@/lib/auth.ts'
import NotFound from '@/components/layout/not-found.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

interface ProtectedRouteProps {
  children: ReactNode
  requireEventManager?: boolean
}

function ProtectedRoute({
  children,
  requireEventManager = false,
}: ProtectedRouteProps) {
  const { isLoaded, isAuthenticated } = useCommitteeAuth()
  const { canManageEvents } = useEventManagerAuth()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[85vh] px-4">
        <Spinner strokeWidth={1.5} className="size-10 text-neutral-800" />
      </div>
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
