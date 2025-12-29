import type { ReactNode } from 'react'

function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 -mt-px bg-surface flex flex-col w-1/2 border-neutral-800 border rounded-md mb-20">
      <div className="p-8 h-full">{children}</div>
    </div>
  )
}

export default Sheet
