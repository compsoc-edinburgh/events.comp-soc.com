import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { MenuIcon, XIcon } from 'lucide-react'
import { mainNavLinks } from '@/config/navigation.ts'

function MainNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="flex h-11 items-center justify-between px-3 bg-surface border-b border-neutral-800">
        <div className="flex gap-5 justify-center items-center">
          <img src="/comp-soc-logo.svg" alt="My Logo" className="w-6 h-6" />
          <div className="gap-5 md:flex hidden">
            {mainNavLinks.map((link, index) => {
              const isFirst = index === 0
              const baseClasses =
                'text-sm cursor-pointer hover:text-white transition-colors'
              const colorClasses = isFirst ? '' : 'text-neutral-400'

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClasses} ${colorClasses}`}
                  >
                    {link.label}
                  </a>
                )
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`${baseClasses} ${colorClasses}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex gap-3 text-xs font-medium text-neutral-500 tabular-nums">
            <span>
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </span>
            <span>
              {new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              })}
            </span>
          </div>

          <button className="bg-red-900 rounded-sm p-0 cursor-pointer group mt-1">
            <span className="block px-2 py-1 rounded-sm text-sm bg-primary text-primary-foreground -translate-y-1 transition-transform group-active:-translate-y-0.5">
              Sign Up
            </span>
          </button>

          <button
            className="md:hidden p-1.5 hover:bg-neutral-800 rounded transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-5 h-5 text-neutral-400" />
            ) : (
              <MenuIcon className="w-5 h-5 text-neutral-400" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-11 z-50 bg-surface/95 backdrop-blur-sm border-t border-neutral-800">
          <div className="flex flex-col p-4 gap-1">
            {mainNavLinks.map((link, index) => {
              const isFirst = index === 0
              const baseClasses =
                'text-base py-3 px-4 rounded-md cursor-pointer hover:bg-neutral-800 transition-colors'
              const colorClasses = isFirst
                ? 'text-white font-medium'
                : 'text-neutral-400 hover:text-white'

              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${baseClasses} ${colorClasses}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              }

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`${baseClasses} ${colorClasses}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="h-px bg-neutral-800 my-3" />

            <div className="flex gap-3 text-sm font-medium text-neutral-500 tabular-nums px-4 py-2">
              <span>
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
              <span>•</span>
              <span>
                {new Date().toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MainNavigation
