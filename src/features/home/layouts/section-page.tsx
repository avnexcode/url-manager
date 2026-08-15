import { Heading } from '@/components'
import { cn } from '@/lib/utils'
import React, { forwardRef } from 'react'

type SectionPageProps = {
  sectionId?: string
  sectionClassName?: string
  title?: string
} & React.HTMLAttributes<HTMLElement>

export const SectionPage = forwardRef<HTMLElement, SectionPageProps>(
  (
    { children, sectionId, className, title, sectionClassName, ...props },
    ref,
  ) => {
    return (
      <section
        className={cn(
          'my-16 flex h-full w-full flex-col items-center justify-center gap-y-10 sm:my-20 md:my-36',
          sectionClassName,
        )}
      >
        {title ? (
          <div className="flex w-full items-center gap-5">
            <div className="h-1.5 w-24 rounded-sm bg-black sm:w-44 dark:bg-white" />
            <Heading size={'h2'}>{title}</Heading>
          </div>
        ) : null}
        <main
          id={sectionId}
          ref={ref}
          className={cn('relative flex h-full w-full flex-col', className)}
          {...props}
        >
          {children}
        </main>
      </section>
    )
  },
)

SectionPage.displayName = 'SectionLayout'
