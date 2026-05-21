import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Analytics } from '@vercel/analytics/react'

import ClerkProvider from '../integrations/clerk/provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import type { ReactNode } from 'react'

import type { QueryClient } from '@tanstack/react-query'
import MainNavigation from '@/components/layout/main-navigation.tsx'
import { Toaster } from '@/components/ui/sooner.tsx'
import NotFound from '@/components/not-found.tsx'
import { PAGE_METADATA } from '@/config/meta.ts'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => PAGE_METADATA,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Compsoc Events</title>
        <HeadContent />
      </head>
      <body className="bg-[#1f1f1f]">
        <ClerkProvider>
          <Toaster />
          <MainNavigation />
          {children}
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ClerkProvider>
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}
