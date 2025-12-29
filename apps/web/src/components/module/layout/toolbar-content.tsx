import { ChevronDown, Filter } from 'lucide-react'

export function SearchToolbarContent() {
  return (
    <>
      <div className="flex items-center justify-between bg-neutral-800 border border-neutral-600 px-2 py-1 rounded gap-2 cursor-pointer hover:border-neutral-500 transition-colors min-w-27.5">
        <span className="text-[11px] font-medium text-neutral-200">
          Find event
        </span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </div>

      <div className="ml-2 flex items-center gap-2 px-2 py-1 hover:bg-neutral-800 rounded cursor-pointer transition-colors group">
        <Filter className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-200" />
        <span className="text-[11px] font-medium text-neutral-400 group-hover:text-neutral-200">
          Filter by SIG
        </span>
      </div>
    </>
  )
}
