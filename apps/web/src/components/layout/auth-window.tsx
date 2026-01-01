import { Minimize2, MinusIcon, XIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface AuthWindowProps {
  children: ReactNode
  title: string
}

export function AuthWindow({ children, title }: AuthWindowProps) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] m-2">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-window border border-neutral-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center h-10 px-3 bg-window border-b border-neutral-800 relative">
            <div className="flex gap-2 items-center">
              <XIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
              <MinusIcon className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
              <Minimize2 className="w-4 h-4 text-neutral-500 hover:text-neutral-300 transition-colors" />
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-bold text-neutral-400 tracking-wide">
              {title}
            </div>
          </div>
          <div className="bg-surface flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
