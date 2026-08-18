import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const GoBackButton = () => {
  const router = useRouter()

  const handleGoBack = () => {
    router.history.back()
  }

  return (
    <Button
      variant="default"
      onClick={handleGoBack}
      className="flex cursor-pointer items-center gap-2"
    >
      <ArrowLeft size={16} />
      Back to Previous Page
    </Button>
  )
}
