import { Link } from '@tanstack/react-router'
import { docsNavTabs } from '@/config/navigation.ts'
import { cn } from '@/lib/utils.ts'

interface DocsNavigationProps {
  activeTab?: string
}

function DocsNavigation({ activeTab }: DocsNavigationProps) {
  return (
    <div className="flex gap-2 sm:gap-5 text-sm w-full md:w-1/2 mb-px mt-2 justify-center px-3 md:px-0 scrollbar-hide">
      {docsNavTabs.map((tab) => {
        const isActive = activeTab === tab.path

        return isActive ? (
          <div
            key={tab.path}
            className="relative z-20 translate-y-px py-1 px-3 sm:px-4 bg-surface border border-neutral-800 border-b-surface rounded-t-md font-medium text-neutral-200 whitespace-nowrap shrink-0 text-xs sm:text-sm"
          >
            {tab.label}
          </div>
        ) : (
          <Link
            key={tab.path}
            to={tab.path}
            onClick={(e) => {
              if (tab.isClosedToCheck) {
                e.preventDefault()
              }
            }}
            className={cn(
              'py-1 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors',
              tab.isClosedToCheck
                ? 'text-neutral-700 cursor-auto'
                : 'text-neutral-500 hover:text-neutral-300 cursor-pointer',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

export default DocsNavigation
