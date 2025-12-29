import type { ReactNode } from 'react'
import DocsNavigation from '@/components/module/layout/docs-navigation.tsx'
import DocsToolbar from '@/components/module/layout/docs-toolbar.tsx'

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
