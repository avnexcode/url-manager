import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'
import { Footer, Header } from '../elements'

type PageContainerProps = {
  withHeader?: boolean
  withFooter?: boolean
}

export const PageContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & PageContainerProps
>(
  (
    { children, className, withHeader = false, withFooter = false, ...props },
    ref,
  ) => {
    return (
      <div className={cn('h-full w-full')}>
        {withHeader && <Header />}
        <main ref={ref} className={cn('flex flex-col', className)} {...props}>
          {children}
        </main>
        {withFooter && <Footer />}
      </div>
    )
  },
)

PageContainer.displayName = 'PageContainer'
