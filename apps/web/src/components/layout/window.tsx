import type { ReactNode } from 'react'

type WindowMaxWidth = 'full' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

const maxWidthClass: Record<WindowMaxWidth, string> = {
  full: 'max-w-7xl',
  '3xl': 'max-w-3xl ',
  '4xl': 'max-w-4xl ',
  '5xl': 'max-w-5xl ',
  '6xl': 'max-w-6xl ',
  '7xl': 'max-w-7xl ',
}

interface WindowProps {
  children: ReactNode
  activeTab?: string
  toolbarContent?: ReactNode
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
