import { createFileRoute } from '@tanstack/react-router'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'
import EmptyState from '@/components/layout/empty-state.tsx'

export const Route = createFileRoute('/analytics')({
  component: AnalyticsRoute,
})

function AnalyticsRoute() {
  return (
    <ProtectedRoute requireEventManager>
      <Window>
        <Sheet>
          <EmptyState
            image="/page-images/wrench.webp"
            imageAlt="Page under construction"
            title="Analytics is currently being built"
            description="Committee-only registration trends, funnel charts and per-event breakdowns will live here."
            className="min-h-[60vh]"
          />
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
