export interface NavTab {
  label: string
  path: string
  isClosedToCheck: boolean
  requireCommittee: boolean
  requireAuth: boolean
}

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export const docsNavTabs: Array<NavTab> = [
  {
    label: 'Create',
    path: '/events/create',
    isClosedToCheck: false,
    requireCommittee: true,
    requireAuth: true,
  },
  {
    label: 'Explore',
    path: '/',
    isClosedToCheck: false,
    requireCommittee: false,
    requireAuth: false,
  },
  {
    label: 'Details',
    path: '/events',
    isClosedToCheck: true,
    requireCommittee: false,
    requireAuth: true,
  },
  {
    label: 'Drafts',
    path: '/events/draft',
    isClosedToCheck: false,
    requireCommittee: true,
    requireAuth: true,
  },
  {
    label: 'My Events',
    path: '/me',
    isClosedToCheck: false,
    requireCommittee: false,
    requireAuth: true,
  },
]

export const mainNavLinks: Array<NavLink> = [
  { label: 'CompSoc', href: '/' },
  { label: 'About', href: 'https://comp-soc.com', external: true },
  { label: 'Team', href: 'https://comp-soc.com/team', external: true },
  { label: 'News', href: 'https://comp-soc.com/news', external: true },
  { label: 'Discord', href: 'https://discord.gg/fmp7p9Ca4y', external: true },
]
