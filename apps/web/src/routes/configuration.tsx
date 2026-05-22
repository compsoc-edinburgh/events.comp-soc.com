import { createFileRoute } from '@tanstack/react-router'
import Window from '@/components/layout/window.tsx'
import Sheet from '@/components/layout/sheet.tsx'
import { ProtectedRoute } from '@/components/layout/protected-route.tsx'

export const Route = createFileRoute('/configuration')({
  component: ConfigurationRoute,
})

function ConfigurationRoute() {
  return (
    <ProtectedRoute requireEventManager>
      <Window>
        <Sheet>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Configuration
          </h1>
          <p className="text-sm text-neutral-500">
            Page for managing who has access for specific roles. Coming soon.
          </p>
        </Sheet>
      </Window>
    </ProtectedRoute>
  )
}
