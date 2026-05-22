import type { ReactNode } from 'react'

/** `full` = the default page width (capped at the global max). */
type WindowMaxWidth = 'full' | '3xl' | '4xl' | '5xl' | '6xl'

const maxWidthClass: Record<WindowMaxWidth, string> = {
  full: 'max-w-7xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
}

interface WindowProps {
  children: ReactNode
  maxWidth?: WindowMaxWidth
}

function Window({ children, maxWidth = 'full' }: WindowProps) {
  return (
    <div
      className={`bg-surface min-h-[80vh] my-2 mx-2 md:mx-auto lg:my-5 border-card-border border rounded-lg ${maxWidthClass[maxWidth]}`}
    >
      {children}
    </div>
  )
}

export default Window
