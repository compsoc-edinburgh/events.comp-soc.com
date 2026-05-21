import type { ReactNode } from 'react'

type WindowMaxWidth = 'full' | '3xl' | '4xl' | '5xl' | '6xl'

const maxWidthClass: Record<WindowMaxWidth, string> = {
  full: 'mx-5',
  '3xl': 'max-w-3xl mx-auto',
  '4xl': 'max-w-4xl mx-auto',
  '5xl': 'max-w-5xl mx-auto',
  '6xl': 'max-w-6xl mx-auto',
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
      className={`bg-[#141414] min-h-[80vh] my-5 border-[#2E2E2E] border rounded-lg ${maxWidthClass[maxWidth]}`}
    >
      {children}
    </div>
  )
}

export default Window
