interface Tab {
  label: string
  isActive?: boolean
}

interface TabNavigationProps {
  tabs?: Array<Tab>
}

const defaultTabs: Array<Tab> = [
  { label: 'Create' },
  { label: 'Search', isActive: true },
  { label: 'Event' },
  { label: 'Drafts' },
]

export function TabNavigation({ tabs = defaultTabs }: TabNavigationProps) {
  return (
    <div className="flex gap-5 text-sm w-1/2 mb-px mt-5 justify-center">
      {tabs.map((tab) =>
        tab.isActive ? (
          <div
            key={tab.label}
            className="relative z-20 translate-y-px py-1 px-4 bg-surface border border-neutral-800 border-b-surface rounded-t-md font-medium text-neutral-200"
          >
            {tab.label}
          </div>
        ) : (
          <div
            key={tab.label}
            className="py-1 px-3 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
          >
            {tab.label}
          </div>
        ),
      )}
    </div>
  )
}
