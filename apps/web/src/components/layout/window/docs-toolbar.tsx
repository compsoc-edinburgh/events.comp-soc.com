import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Italic,
  IterationCcw,
  IterationCw,
  Settings,
} from 'lucide-react'
import type { ReactNode } from 'react'

interface DocsToolbarProps {
  children?: ReactNode
}

function DocsToolbar({ children }: DocsToolbarProps) {
  return (
    <nav className="hidden sticky md:flex top-9 z-30 h-12 items-center justify-between px-3 py-1 bg-subnavbar border-b border-neutral-800 w-full shadow-2xl">
      <div className="border-neutral-700 border p-1 w-full h-full rounded-sm items-center flex px-3">
        <div className="flex items-center">
          <div className="sm:flex hidden gap-3 items-center">
            <IterationCw className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
            <IterationCcw className="w-4 h-4 text-neutral-400 hover:text-white cursor-pointer transition-colors" />
          </div>

          <div className="w-px h-4 bg-neutral-700 mx-4 md:flex hidden" />

          <div className="md:flex hidden items-center justify-between bg-neutral-800/50 border border-neutral-700 px-2 py-1 rounded gap-2 cursor-not-allowed opacity-60 min-w-30">
            <span className="text-[11px] font-medium text-neutral-300 truncate">
              IBM Plex Mono
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </div>

          <div className="w-px h-4 bg-neutral-700 mx-4 md:flex hidden" />

          <div className="md:flex hidden gap-1 items-center ">
            <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
              <Bold className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
            <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
              <Italic className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
          </div>

          <div className="w-px h-4 bg-neutral-700 mx-4 md:flex hidden" />

          <div className="md:flex hidden gap-1 items-center">
            <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
              <AlignLeft className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
            <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
              <AlignCenter className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
            <button className="p-1 hover:bg-neutral-800 rounded transition-colors group">
              <AlignRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </button>
          </div>

          {children && (
            <>
              <div className="w-px h-4 bg-neutral-700 mx-4 md:flex hidden" />
              {children}
            </>
          )}
        </div>

        <div className="grow" />

        <div className="flex items-center">
          <div className="w-px h-4 bg-neutral-700 mx-4" />

          <button className="p-1.5 hover:bg-neutral-800 rounded transition-colors group">
            <Settings className="w-4 h-4 text-neutral-400 group-hover:text-white" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default DocsToolbar
