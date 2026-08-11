'use client'
import { Heading } from '@/components'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import * as m from '@/generated/paraglide/messages'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import type { RegisterFormSchema } from '../types'
import { RegisterFormInner } from './register-form-inner'

type RegisterFormProps = {
  form: UseFormReturn<RegisterFormSchema>
  onSubmit: (values: RegisterFormSchema) => void
  isPending: boolean
}

export const RegisterForm = ({
  form,
  onSubmit,
  isPending,
}: RegisterFormProps) => {
  return (
    <Card className="sm:bg-card w-full max-w-2xl border-0 bg-transparent shadow-none sm:rounded-xl sm:border sm:shadow-sm">
      <CardHeader>
        <CardTitle>
          <Heading size={'h3'}>
            {m.page_auth_form_register_header_title()}
          </Heading>
        </CardTitle>
        <CardDescription>
          {m.page_auth_form_register_header_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <RegisterFormInner formId="register-form" onSubmit={onSubmit} />
        </FormProvider>
      </CardContent>
      <CardFooter className="flex-col place-content-between gap-y-5 pt-5">
        <Button form="register-form" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {m.page_auth_form_register_footer_submit_button_loading()} . . .
            </>
          ) : (
            m.page_auth_form_register_footer_submit_button()
          )}
        </Button>
        <span className="text-muted-foreground text-sm">
          {m.page_auth_form_register_footer_caption()}{' '}
          <Link
            to="/{-$locale}"
            className="font-medium text-blue-600/80 transition-colors hover:text-blue-600 hover:underline"
          >
            {m.page_auth_form_register_footer_caption_redirect()}
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
