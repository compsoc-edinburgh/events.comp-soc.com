import { FileQuestion } from 'lucide-react'
import { StatusCard } from '@/components/ui/status-card.tsx'

function NotFound() {
  return (
    <div className="w-full h-[85vh] flex items-center justify-center">
      <StatusCard
        title="Page not found"
        message="CompSocOS isn't ready to display this page yet."
        icon={<FileQuestion className="w-10 h-10" strokeWidth={1.5} />}
      />
    </div>
  )
}

export default NotFound
