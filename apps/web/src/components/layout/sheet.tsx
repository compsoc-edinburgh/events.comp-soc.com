import type { ReactNode } from 'react'

type SheetMaxWidth = 'full' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'

const maxWidthClass: Record<SheetMaxWidth, string> = {
  full: 'max-w-7xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
}

interface SheetProps {
  children: ReactNode
  maxWidth?: SheetMaxWidth
}

export function EmptySheet({
  children,
  maxWidth,
}: {
  children: ReactNode
  maxWidth?: SheetMaxWidth
}) {
  return (
    <Sheet maxWidth={maxWidth}>
      <div className="flex items-center justify-center min-h-[60vh]">
        {children}
      </div>
    </Sheet>
  )
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
