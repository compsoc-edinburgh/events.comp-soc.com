import { LogIn, ShieldX } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCommitteeAuth } from '@/lib/auth.ts'
import { StatusCard } from '@/components/ui/status-card.tsx'
import Window from '@/components/layout/window/window.tsx'
import { EmptySheet } from '@/components/layout/sheet.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

interface ProtectedRouteProps {
  children: ReactNode
  activeTab?: string
}

function ProtectedRoute({ children, activeTab }: ProtectedRouteProps) {
  const { isLoaded, isAuthenticated, isCommittee } = useCommitteeAuth()

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
            message="You need to sign in to access this page. Committee members only!"
            icon={<LogIn className="w-10 h-10" strokeWidth={1.5} />}
          />
        </EmptySheet>
      </Window>
    )
  }

  if (!isCommittee) {
    return (
      <Window activeTab={activeTab}>
        <EmptySheet>
          <StatusCard
            title="Access denied"
            message="This area is restricted to committee members. Nice try though!"
            icon={<ShieldX className="w-10 h-10" strokeWidth={1.5} />}
          />
        </EmptySheet>
      </Window>
    )
  }

  return <>{children}</>
}

export { ProtectedRoute }
