import { ChevronDown, Minimize2, MinusIcon, XIcon } from 'lucide-react'

export function WindowBar() {
  return (
    <nav className="sticky top-0 z-30 flex h-8 sm:h-9 items-center justify-between px-2 sm:px-3 bg-window border-b border-neutral-800 w-full">
      <div className="hidden sm:flex gap-2 items-center w-20 h-full">
        <XIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
        <MinusIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
        <Minimize2 className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
      </div>
      <div className="flex gap-1 items-center text-xs sm:text-sm font-bold text-neutral-200 flex-1 sm:flex-none justify-center">
        <span className="truncate">Events - Compsoc</span>
        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-neutral-500 shrink-0" />
      </div>
      <div className="hidden sm:block w-20" />
    </nav>
  )
}
