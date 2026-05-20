import type { ReactNode } from 'react'

export function EmptySheet({ children }: { children: ReactNode }) {
  return (
    <Sheet>
      <div className="flex items-center justify-center min-h-[60vh]">
        {children}
      </div>
    </Sheet>
  )
}

function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-8">
      {children}
    </div>
  )
}

export default Sheet
