import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import type { ReactNode } from 'react'
import { WindowBar } from '@/components/module/layout/window/window-bar.tsx'
import MainNavigation from '@/components/module/layout/main-navigation.tsx'
import { Toaster } from '@/components/ui/sooner.tsx'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Compsoc events',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center">
        <div className="max-w-105 rounded-lg border border-neutral-800 bg-neutral-900/80 shadow-xl">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
            <span className="text-sm text-neutral-300">System Message</span>
            <div className="flex gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
              <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-neutral-400">
              CompSocOS isn’t ready to display this page yet.
            </p>
          </div>
        </div>
      </div>
    )
  },
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <title>CompSoc Events</title>
      </head>
      <body className="bg-background">
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
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
