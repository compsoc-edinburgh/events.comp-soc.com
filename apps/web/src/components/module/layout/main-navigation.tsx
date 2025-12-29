import { Link } from '@tanstack/react-router'
import { mainNavLinks } from '@/config/navigation'

function MainNavigation() {
  return (
    <nav className="flex h-11 items-center justify-between px-3 bg-surface border-b border-neutral-800">
      <div className="flex gap-5 justify-center items-center">
        <img src="/comp-soc-logo.svg" alt="My Logo" className="w-6 h-6" />
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
      <div className="flex items-center gap-4">
        <div className="flex gap-3 text-xs font-medium text-neutral-500 tabular-nums">
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
          <span className="block px-2 py-1 rounded-sm text-sm bg-red-600 text-white -translate-y-1 transition-transform group-active:-translate-y-0.5">
            Sign Up
          </span>
        </button>
      </div>
    </nav>
  )
}

export default MainNavigation
