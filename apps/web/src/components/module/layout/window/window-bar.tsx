import { ChevronDown, Minimize2, MinusIcon, XIcon } from 'lucide-react'

export function WindowBar() {
  return (
    <nav className="sticky top-0 z-30 flex h-9 items-center justify-between px-3 bg-window border-b border-neutral-800 w-full">
      <div className="flex gap-2 items-center w-20 h-full">
        <XIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
        <MinusIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
        <Minimize2 className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
      </div>
      <div className="flex gap-1 items-center text-sm font-bold text-neutral-200">
        Events - Compsoc <ChevronDown className="w-4 h-4 text-neutral-500" />
      </div>
      <div className="w-20" />
    </nav>
  )
}
