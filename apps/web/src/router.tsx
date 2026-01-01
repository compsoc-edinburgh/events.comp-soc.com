import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import * as TanstackQuery from './integrations/tanstack-query/root-provider'

import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: {
      ...rqContext,
    },
    scrollRestoration: true,
    notFoundMode: 'root',
    defaultPreloadStaleTime: 0,
    defaultPreload: 'intent',
  })

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient })

  return router
}
