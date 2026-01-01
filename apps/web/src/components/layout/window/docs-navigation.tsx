import { Link } from '@tanstack/react-router'
import { useUser } from '@clerk/clerk-react'
import { Role } from '@events.comp-soc.com/shared'
import { docsNavTabs } from '@/config/navigation'
import { cn } from '@/lib/utils'

interface DocsNavigationProps {
  activeTab?: string
}

function DocsNavigation({ activeTab }: DocsNavigationProps) {
  const { user, isLoaded } = useUser()
  const isCommittee = isLoaded && user?.publicMetadata.role === Role.Committee

  return (
    <nav
      aria-label="Documentation navigation"
      className="flex gap-2 sm:gap-5 text-sm w-full md:w-1/2 mb-px mt-2 justify-center px-3 md:px-0"
    >
      {docsNavTabs.map((tab) => {
        const isActive = activeTab === tab.path
        const isDisabled =
          tab.isClosedToCheck ||
          (tab.requireCommittee && !isCommittee) ||
          (tab.requireAuth && !user)

        if (isActive) {
          return (
            <span
              key={tab.path}
              aria-current="page"
              className="relative z-20 translate-y-px py-1 px-3 sm:px-4 bg-surface border border-neutral-800 border-b-surface rounded-t-md font-medium text-neutral-200 whitespace-nowrap shrink-0 text-xs sm:text-sm"
            >
              {tab.label}
            </span>
          )
        }

        return (
          <Link
            key={tab.path}
            to={tab.path}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            onClick={(e) => {
              if (isDisabled) e.preventDefault()
            }}
            className={cn(
              'py-1 px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap shrink-0 transition-colors',
              isDisabled
                ? 'text-neutral-700 cursor-not-allowed'
                : 'text-neutral-500 hover:text-neutral-300',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default DocsNavigation
