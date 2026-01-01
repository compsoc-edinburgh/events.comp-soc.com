export interface NavTab {
  label: string
  path: string
  isClosedToCheck: boolean
  requireCommittee: boolean
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
  },
  {
    label: 'Search',
    path: '/',
    isClosedToCheck: false,
    requireCommittee: false,
  },
  {
    label: 'Event',
    path: '/events',
    isClosedToCheck: true,
    requireCommittee: false,
  },
  {
    label: 'Drafts',
    path: '/events/draft',
    isClosedToCheck: false,
    requireCommittee: true,
  },
]

export const mainNavLinks: Array<NavLink> = [
  { label: 'CompSoc', href: '/' },
  { label: 'About', href: 'https://comp-soc.com/about', external: true },
  { label: 'Team', href: 'https://comp-soc.com/team', external: true },
  { label: 'News', href: 'https://comp-soc.com/news', external: true },
  { label: 'Discord', href: 'https://discord.comp-soc.com', external: true },
]
