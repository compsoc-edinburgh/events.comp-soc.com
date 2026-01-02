import type { ReactNode } from 'react'
import { WindowControls } from '@/components/layout/window/window-bar.tsx'

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
            <WindowControls />
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
