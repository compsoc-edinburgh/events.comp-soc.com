import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

interface ErrorStateProps {
  title?: string
  message?: string
}

function ErrorState({
  title = 'Something went wrong',
  message = 'CompSocOS hit a snag loading this. Try again in a moment.',
}: ErrorStateProps) {
  const router = useRouter()

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.history.back()
    } else {
      void router.navigate({ to: '/' })
    }
  }

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center px-4">
      <img
        src="/page-images/wrench.webp"
        alt="Error"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="w-32 h-32 object-contain select-none [-webkit-user-drag:none] [-webkit-touch-callout:none]"
      />
      <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-neutral-100">
        {title}
      </h1>
      <p className="mt-2 text-sm sm:text-base text-neutral-500 text-center max-w-md">
        {message}
      </p>
      <Button onClick={handleGoBack} className="mt-6">
        <ArrowLeft className="w-4 h-4" />
        Go back
      </Button>
    </div>
  )
}

export default ErrorState
