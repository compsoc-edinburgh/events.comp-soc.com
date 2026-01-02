import type { ReactNode } from 'react'

function Sheet({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 -mt-px bg-surface flex flex-col mx-2 sm:mx-3 md:mx-0 md:w-3/4 lg:w-1/2 border-neutral-800 border rounded-md mb-5 w-[calc(100%-1rem)] sm:w-[calc(100%-1.5rem)]">
      <div className="p-4 sm:p-6 md:p-8 h-full">{children}</div>
    </div>
  )
}

export default Sheet
