import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  return createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    notFoundMode: 'root',
    defaultPreloadStaleTime: 0,
  })
}
