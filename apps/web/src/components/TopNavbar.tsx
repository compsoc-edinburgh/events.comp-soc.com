export function TopNavbar() {
  return (
    <nav className="flex h-11 items-center justify-between px-3 bg-surface border-b border-neutral-800">
      <div className="flex gap-5 justify-center items-center">
        <img src="/comp-soc-logo.svg" alt="My Logo" className="w-6 h-6" />
        <div className="text-sm cursor-pointer hover:text-white transition-colors">
          CompSoc
        </div>
        <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
          About
        </div>
        <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
          Team
        </div>
        <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
          News
        </div>
        <div className="text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer">
          Discord
        </div>
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
