import { ChevronDown, Minimize2, MinusIcon, XIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export const WindowControls = () => (
  <div className="hidden sm:flex gap-2 items-center w-20 h-full">
    <XIcon className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300 transition-colors" />
    <MinusIcon className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300 transition-colors" />
    <Minimize2 className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-300 transition-colors" />
  </div>
)

interface WindowBarProps {
  title?: string
  isSticky?: boolean
  controls?: ReactNode
}

export function WindowBar({
  title = 'Events - Compsoc',
  isSticky = true,
  controls = <WindowControls />,
}: WindowBarProps) {
  return (
    <nav
      className={`
        ${isSticky ? 'sticky top-0 z-30' : 'relative'} 
        flex h-8 items-center justify-between px-2 sm:px-3 rounded-t-sm
        bg-window border-b border-neutral-800 w-full
      `}
    >
      {controls}

      <div className="flex gap-1 items-center text-xs font-bold text-neutral-200 flex-1 sm:flex-none justify-center">
        <span className="truncate">{title}</span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500 shrink-0" />
      </div>

      <div className="hidden sm:block w-20" />
    </nav>
  )
}
