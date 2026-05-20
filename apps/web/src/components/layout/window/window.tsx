import type { ReactNode } from 'react'

interface WindowProps {
  children: ReactNode
  activeTab?: string
  toolbarContent?: ReactNode
}

function Window({ children }: WindowProps) {
  return (
    <div className="bg-[#141414] min-h-[80vh] my-5 mx-5 border-[#2E2E2E] border rounded-lg">
      {children}
    </div>
  )
}

export default Window
