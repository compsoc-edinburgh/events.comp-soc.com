import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { SignOutButton, useAuth } from '@clerk/clerk-react'
import { mainNavLinks } from '@/config/navigation.ts'
import { Spinner } from '@/components/ui/spinner.tsx'
import { Button } from '@/components/ui/button.tsx'

const DateTimeDisplay = () => {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const time = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <>
      <span>{date}</span>
      <span>{time}</span>
    </>
  )
}

const MobileDateTimeDisplay = () => {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const time = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="flex gap-3 text-sm font-medium text-neutral-500 tabular-nums px-4 py-2">
      <span>{date}</span>
      <span>•</span>
      <span>{time}</span>
    </div>
  )
}

interface NavLinkProps {
  link: {
    href: string
    label: string
    external?: boolean
  }
  isFirst: boolean
  isMobile?: boolean
  onClick?: () => void
}

const NavLink = ({
  link,
  isFirst,
  isMobile = false,
  onClick,
}: NavLinkProps) => {
  const baseClasses = isMobile
    ? 'text-base py-3 px-4 rounded-md cursor-pointer hover:bg-neutral-800 transition-colors'
    : 'text-sm cursor-pointer hover:text-white transition-colors'

  const colorClasses = isFirst
    ? isMobile
      ? 'text-white font-medium'
      : ''
    : isMobile
      ? 'text-neutral-400 hover:text-white'
      : 'text-neutral-400'

  const className = `${baseClasses} ${colorClasses}`

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {link.label}
      </a>
    )
  }

  return (
    <Link to={link.href} className={className} onClick={onClick}>
      {link.label}
    </Link>
  )
}

const SignUpButton = () => (
  <Link to={'/sign-in/$'}>
    <button className="bg-red-900 rounded-sm p-0 cursor-pointer group mt-1">
      <span className="block px-2 py-1 rounded-sm text-sm bg-primary text-primary-foreground -translate-y-1 transition-transform group-active:-translate-y-0.5">
        Sign Up
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

const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  if (!isOpen) return null

  return (
    <div className="md:hidden fixed inset-0 top-11 z-50 bg-surface/95 backdrop-blur-sm border-t border-neutral-800">
      <div className="flex flex-col p-4 gap-1">
        {mainNavLinks.map((link, index) => (
          <NavLink
            key={link.href}
            link={link}
            isFirst={index === 0}
            isMobile
            onClick={onClose}
          />
        ))}

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
      <nav className="flex h-11 items-center justify-between px-3 bg-surface border-b border-neutral-800">
        <div className="flex gap-5 justify-center items-center">
          <Link to="/">
            <img
              src="/comp-soc-logo.svg"
              alt="Company Logo"
              className="w-6 h-6 hover:scale-105 duration-150"
            />
          </Link>

          <div className="gap-5 md:flex hidden">
            {mainNavLinks.map((link, index) => (
              <NavLink key={link.href} link={link} isFirst={index === 0} />
            ))}
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
