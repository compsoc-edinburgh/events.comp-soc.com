import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  CalendarPlus,
  ChevronDown,
  FileText,
  MenuIcon,
  MessageCircle,
  Search,
  Settings,
  Users,
} from 'lucide-react'
import { SignOutButton, useAuth } from '@clerk/tanstack-react-start'
import type { ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useEventManagerAuth } from '@/lib/auth.ts'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.tsx'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'

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
  'text-sm font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer'

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
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => cancelClose(), [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => {
            cancelClose()
            setOpen(true)
          }}
          onMouseLeave={scheduleClose}
          className={`${navItemClass} inline-flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5 data-[state=open]:bg-white/5`}
        >
          {label}
          <ChevronDown
            className="w-3.5 h-3.5 text-neutral-500"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-48 p-1.5 bg-neutral-900 border-card-border"
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

const committeeItems: Array<PopoverItem> = [
  {
    label: 'Create event',
    href: '/events/create',
    icon: <CalendarPlus className="w-4 h-4" />,
  },
  {
    label: 'Configuration',
    href: '/configuration',
    icon: <Settings className="w-4 h-4" />,
  },
]

const moreItems: Array<PopoverItem> = [
  {
    label: 'Discord',
    href: 'https://discord.gg/fmp7p9Ca4y',
    external: true,
    icon: <MessageCircle className="w-3.5 h-3.5" />,
  },
  {
    label: 'Committee site',
    href: 'https://comp-soc.com/team',
    external: true,
    icon: <Users className="w-3.5 h-3.5" />,
  },
  {
    label: 'CompSoc news',
    href: 'https://comp-soc.com/news',
    external: true,
    icon: <FileText className="w-3.5 h-3.5" />,
  },
]

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <div className="px-3 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
    {children}
  </div>
)

const MobileMenu = ({
  isSignedIn,
  isAuthLoaded,
  canManageEvents,
  onNavigate,
}: {
  isSignedIn: boolean
  isAuthLoaded: boolean
  canManageEvents: boolean
  onNavigate: () => void
}) => {
  const itemClass =
    'flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] text-neutral-200 hover:bg-card-hover active:bg-card-hover transition-colors'
  const iconClass = '[&_svg]:!w-4 [&_svg]:!h-4 text-neutral-400'

  const renderItem = (item: PopoverItem) => {
    const inner = (
      <div className={itemClass} onClick={onNavigate}>
        <span className={iconClass}>{item.icon}</span>
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
        {inner}
      </a>
    ) : (
      <Link key={item.href} to={item.href}>
        {inner}
      </Link>
    )
  }

  return (
    <>
      <SheetHeader className="sr-only">
        <SheetTitle>Navigation menu</SheetTitle>
        <SheetDescription>
          Jump to a page or open an external resource.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto p-3">
        <Link to="/" className={itemClass} onClick={onNavigate}>
          <Search className="w-4 h-4 text-neutral-400" />
          Search
        </Link>

        {isSignedIn && (
          <Link to="/me" className={itemClass} onClick={onNavigate}>
            <CalendarPlus className="w-4 h-4 text-neutral-400" />
            My events
          </Link>
        )}

        {canManageEvents && (
          <>
            <SectionHeading>Committee</SectionHeading>
            {committeeItems.map(renderItem)}
            <Link to="/analytics" className={itemClass} onClick={onNavigate}>
              <FileText className="w-4 h-4 text-neutral-400" />
              Analytics
            </Link>
          </>
        )}

        <SectionHeading>More</SectionHeading>
        {moreItems.map(renderItem)}
      </div>

      <div className="border-t border-card-border px-3 py-3 flex items-center justify-between gap-3">
        <MobileDateTimeDisplay />
        {isAuthLoaded ? (
          isSignedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onNavigate}
              className="shrink-0"
            >
              <SignOutButton />
            </Button>
          ) : (
            <Link
              to="/sign-in/$"
              params={{ _splat: '' }}
              onClick={onNavigate}
              className="shrink-0"
            >
              <button className="bg-red-900 rounded-sm p-0 cursor-pointer group mt-1">
                <span className="block px-3 py-1 rounded-sm text-sm bg-primary text-primary-foreground -translate-y-1 transition-transform group-active:-translate-y-0.5">
                  Sign In
                </span>
              </button>
            </Link>
          )
        ) : (
          <Spinner className="text-neutral-700 shrink-0" />
        )}
      </div>
    </>
  )
}

function MainNavigation() {
  const { userId, isLoaded } = useAuth()
  const { canManageEvents } = useEventManagerAuth()
  const isSignedIn = !!userId
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <nav className="sticky top-0 z-30 flex h-12 items-center justify-between px-6 sm:px-8 lg:px-10 bg-navigation/70 backdrop-blur-md backdrop-saturate-150 border-b border-card-border">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <img
              src="/comp-soc-logo.svg"
              alt="Company Logo"
              className="w-6 h-6 hover:scale-105 duration-150"
            />
          </Link>

          <div className="md:flex hidden items-center gap-1">
            <NavTextLink href="/">Search</NavTextLink>
            {canManageEvents && (
              <NavPopover label="Committee" items={committeeItems} />
            )}
            {canManageEvents && (
              <NavTextLink href="/analytics">Analytics</NavTextLink>
            )}
            {isSignedIn && <NavTextLink href="/me">My events</NavTextLink>}
            <NavPopover label="More" items={moreItems} />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex gap-3 text-xs font-medium text-neutral-500 tabular-nums">
            <DateTimeDisplay />
          </div>

          <div className="hidden md:flex items-center">
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
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-1.5 hover:bg-card-hover rounded transition-colors"
                aria-label="Open menu"
              >
                <MenuIcon className="w-5 h-5 text-neutral-400" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="md:hidden bg-navigation border-card-border w-[85vw] sm:max-w-sm flex flex-col p-0 gap-0"
            >
              <MobileMenu
                isSignedIn={isSignedIn}
                isAuthLoaded={isLoaded}
                canManageEvents={canManageEvents}
                onNavigate={closeMobileMenu}
              />
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  )
}

export default MainNavigation
