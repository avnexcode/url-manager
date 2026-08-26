import { Button } from '@/components/ui/button'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'

export const GoHomeButton = () => {
  return (
    <Button variant="default" asChild className="cursor-pointer">
      <Link to="/{-$locale}">{m.component_button_go_home()}</Link>
    </Button>
  )
}
