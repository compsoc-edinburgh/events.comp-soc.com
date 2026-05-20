import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  CalendarPlus,
  ChevronDown,
  FileText,
  MenuIcon,
  MessageCircle,
  Search,
  Users,
  XIcon,
} from 'lucide-react'
import { SignOutButton, useAuth } from '@clerk/tanstack-react-start'
import type { ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'

const DateTimeDisplay = () => {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return <span>{date}</span>
}

const MobileDateTimeDisplay = () => {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="flex gap-3 text-sm font-medium text-neutral-500 tabular-nums px-4 py-2">
      <span>{date}</span>
    </div>
  )
}

const navItemClass =
  'text-sm text-neutral-300 hover:text-white transition-colors cursor-pointer'

interface PopoverItem {
  label: string
  href: string
  external?: boolean
  icon: ReactNode
}

const NavPopover = ({
  label,
  items,
}: {
  label: string
  items: Array<PopoverItem>
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`${navItemClass} flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5 data-[state=open]:bg-white/5`}
        >
          {label}
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-56 p-1.5 bg-popover border-card-border"
      >
        <div className="flex flex-col">
          {items.map((item) => {
            const content = (
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-sm text-neutral-200 hover:bg-card-hover transition-colors">
                <span className="shrink-0 text-neutral-400">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            )
            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content}
              </a>
            ) : (
              <Link key={item.href} to={item.href}>
                {content}
              </Link>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const NavTextLink = ({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: ReactNode
}) => {
  const className = `${navItemClass} px-3 py-1.5 rounded-md hover:bg-white/5`
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

const SignUpButton = () => (
  <Link to={'/sign-in/$'}>
    <button className="bg-red-900 rounded-sm p-0 cursor-pointer group mt-1">
      <span className="block px-2 py-1 rounded-sm text-sm bg-primary text-primary-foreground -translate-y-1 transition-transform group-active:-translate-y-0.5">
        Sign In
      </span>
    </button>
  </Link>
)

const MobileMenuToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => (
  <button
    className="md:hidden p-1.5 hover:bg-neutral-800 rounded transition-colors"
    onClick={onClick}
    aria-label="Toggle menu"
    aria-expanded={isOpen}
  >
    {isOpen ? (
      <XIcon className="w-5 h-5 text-neutral-400" />
    ) : (
      <MenuIcon className="w-5 h-5 text-neutral-400" />
    )}
  </button>
)

const committeeItems: Array<PopoverItem> = [
  {
    label: 'Create event',
    href: '/events/create',
    icon: <CalendarPlus className="w-4 h-4" />,
  },
  {
    label: 'Draft events',
    href: '/events/draft',
    icon: <FileText className="w-4 h-4" />,
  },
]

const moreItems: Array<PopoverItem> = [
  {
    label: 'Discord',
    href: 'https://discord.gg/fmp7p9Ca4y',
    external: true,
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    label: 'Committee site',
    href: 'https://comp-soc.com/team',
    external: true,
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: 'CompSoc news',
    href: 'https://comp-soc.com/news',
    external: true,
    icon: <FileText className="w-4 h-4" />,
  },
]

const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  if (!isOpen) return null

  const renderItem = (item: PopoverItem) => {
    const content = (
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-md text-base text-neutral-200 hover:bg-neutral-800"
        onClick={onClose}
      >
        <span className="text-neutral-400">{item.icon}</span>
        <span>{item.label}</span>
      </div>
    )
    return item.external ? (
      <a
        key={item.href}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    ) : (
      <Link key={item.href} to={item.href}>
        {content}
      </Link>
    )
  }

  return (
    <div className="md:hidden fixed inset-0 top-12 z-50 bg-surface/95 backdrop-blur-sm border-t border-neutral-800">
      <div className="flex flex-col p-4 gap-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-md text-base text-white font-medium hover:bg-neutral-800"
          onClick={onClose}
        >
          CompSoc Events
        </Link>
        <a
          href="https://comp-soc.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-md text-base text-neutral-300 hover:bg-neutral-800"
          onClick={onClose}
        >
          <Search className="w-4 h-4 text-neutral-400" />
          Search
        </a>

        <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wide text-neutral-500">
          Committee
        </div>
        {committeeItems.map(renderItem)}

        <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wide text-neutral-500">
          More
        </div>
        {moreItems.map(renderItem)}

        <div className="h-px bg-neutral-800 my-3" />

        <MobileDateTimeDisplay />
      </div>
    </div>
  )
}

function MainNavigation() {
  const { userId, isLoaded } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <nav className="sticky top-0 z-30 flex h-12 items-center justify-between px-6 sm:px-8 lg:px-10 bg-[#121212]/70 backdrop-blur-md backdrop-saturate-150 border-b border-[#2E2E2E]">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img
              src="/comp-soc-logo.svg"
              alt="Company Logo"
              className="w-6 h-6 hover:scale-105 duration-150"
            />
          </Link>

          <div className="md:flex hidden items-center gap-1">
            <NavTextLink href="https://comp-soc.com" external>
              Search
            </NavTextLink>
            <NavPopover label="Committee" items={committeeItems} />
            <NavTextLink href="https://comp-soc.com/news" external>
              Analytics
            </NavTextLink>
            <NavPopover label="More" items={moreItems} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex gap-3 text-xs font-medium text-neutral-500 tabular-nums">
            <DateTimeDisplay />
          </div>

          {isLoaded ? (
            !userId ? (
              <SignUpButton />
            ) : (
              <Button variant="outline" size="sm">
                <SignOutButton />
              </Button>
            )
          ) : (
            <Spinner className="text-neutral-700" />
          )}

          <MobileMenuToggle
            isOpen={mobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
    </>
  )
}

export default MainNavigation
