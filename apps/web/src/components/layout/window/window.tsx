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
      <DocsToolbar>{toolbarContent}</DocsToolbar>
      <div className="bg-background min-h-screen flex items-center flex-col">
        <DocsNavigation activeTab={activeTab} />
        {children}
      </div>
    </>
  )
}

export default Window
