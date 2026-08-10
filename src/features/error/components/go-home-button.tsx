import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

export const GoHomeButton = () => {
  return (
    <Button variant="default" asChild className="cursor-pointer">
      <Link to="/{-$locale}">Back to Home</Link>
    </Button>
  )
}
