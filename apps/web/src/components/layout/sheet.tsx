import type { ReactNode } from 'react'

/** `full` = the default page width (capped at the global max). */
type SheetMaxWidth = 'full' | '3xl' | '4xl' | '5xl' | '6xl'

const maxWidthClass: Record<SheetMaxWidth, string> = {
  full: 'max-w-7xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
}

interface SheetProps {
  children: ReactNode
  maxWidth?: SheetMaxWidth
}

function Sheet({ children, maxWidth = 'full' }: SheetProps) {
  return (
    <div
      className={`w-full ${maxWidthClass[maxWidth]} mx-auto px-4 lg:px-6 py-6 sm:py-8`}
    >
      {children}
    </div>
  )
}

export default Sheet
