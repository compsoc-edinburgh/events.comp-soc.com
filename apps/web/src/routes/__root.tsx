import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import ClerkProvider from '../integrations/clerk/provider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import type { ReactNode } from 'react'

import type { QueryClient } from '@tanstack/react-query'
import { WindowBar } from '@/components/layout/window/window-bar.tsx'
import MainNavigation from '@/components/layout/main-navigation.tsx'
import { Toaster } from '@/components/ui/sooner.tsx'
import NotFoundLayout from '@/components/not-found-layout.tsx'
import { PAGE_METADATA } from '@/config/meta.ts'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => PAGE_METADATA,
  shellComponent: RootDocument,
  notFoundComponent: () => NotFoundLayout,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <title>CompSoc Events</title>
      </head>
      <body className="bg-background">
        <ClerkProvider>
          <Toaster />
          <MainNavigation />
          <WindowBar />
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
        <Scripts />
      </body>
    </html>
  )
}
