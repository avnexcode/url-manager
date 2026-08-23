import { Card, CardContent, CardFooter } from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Button } from '../ui/button'

type FormSkeletonProps = {
  children: React.ReactNode
}

export const FormSkeleton = ({ children }: FormSkeletonProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="space-y-5">{children}</div>
      </CardContent>
      <CardFooter className="flex-col-reverse place-content-end gap-4 pt-5 xl:flex-row">
        <Button variant={'neutral'} className="w-full px-20 xl:w-fit" disabled>
          {m.page_shared_form_footer_cancel_button()}
        </Button>
        <Button className="w-full px-20 xl:w-fit" disabled>
          {m.page_shared_form_footer_update_button()}
        </Button>
      </CardFooter>
    </Card>
  )
}
