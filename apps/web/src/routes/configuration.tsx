import { createFileRoute } from '@tanstack/react-router'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import EmptyState from '@/components/layout/empty-state.tsx'

export const Route = createFileRoute('/configuration')({
  component: ConfigurationRoute,
})

function ConfigurationRoute() {
  return (
    <ProtectedRoute requireEventManager>
      <Window>
        <Sheet>
          <EmptyState
            image="/page-images/wrench.webp"
            imageAlt="Page under construction"
            title="Configuration is currently being built"
            description="Manage who has access to specific roles and which Sigs they can run events for."
            className="min-h-[60vh]"
          />
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
