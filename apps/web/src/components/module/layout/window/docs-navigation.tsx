import { Link } from '@tanstack/react-router'
import { docsNavTabs } from '@/config/navigation.ts'

interface DocsNavigationProps {
  activeTab?: string
}

function DocsNavigation({ activeTab }: DocsNavigationProps) {
  return (
    <div className="flex gap-5 text-sm w-1/2 mb-px mt-5 justify-center">
      {docsNavTabs.map((tab) => {
        const isActive = activeTab === tab.path

        return isActive ? (
          <div
            key={tab.path}
            className="relative z-20 translate-y-px py-1 px-4 bg-surface border border-neutral-800 border-b-surface rounded-t-md font-medium text-neutral-200"
          >
            {tab.label}
          </div>
        ) : (
          <Link
            key={tab.path}
            to={tab.path}
            className="py-1 px-3 text-neutral-500 hover:text-neutral-300 cursor-pointer transition-colors"
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

export default DocsNavigation
