import type { ReactNode } from 'react'
import DocsNavigation from '@/components/layout/window/docs-navigation.tsx'
import DocsToolbar from '@/components/layout/window/docs-toolbar.tsx'

interface WindowProps {
  children: ReactNode
  activeTab?: string
  toolbarContent?: ReactNode
}

function Window({ children, activeTab, toolbarContent }: WindowProps) {
  return (
    <>
      <div className="md:block hidden">
        <DocsToolbar>{toolbarContent}</DocsToolbar>
      </div>
      <div className="bg-background min-h-screen flex items-center flex-col">
        <DocsNavigation activeTab={activeTab} />
        {children}
      </div>
    </>
  )
}

export default Window
