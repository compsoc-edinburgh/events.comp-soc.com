export interface NavTab {
  label: string
  path: string
}

export interface NavLink {
  label: string
  href: string
  external?: boolean
}

export const docsNavTabs: Array<NavTab> = [
  { label: 'Create', path: '/events/create' },
  { label: 'Search', path: '/' },
  { label: 'Event', path: '/events' },
  { label: 'Drafts', path: '/events/draft' },
]

export const mainNavLinks: Array<NavLink> = [
  { label: 'CompSoc', href: '/' },
  { label: 'About', href: 'https://comp-soc.com/about', external: true },
  { label: 'Team', href: 'https://comp-soc.com/team', external: true },
  { label: 'News', href: 'https://comp-soc.com/news', external: true },
  { label: 'Discord', href: 'https://discord.comp-soc.com', external: true },
]
