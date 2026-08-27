'use client'
import { Heading } from '@/components/heading'
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
import { OAuthSignIn } from '../components'
import type { LoginFormSchema } from '../types'
import { LoginFormInner } from './login-form-inner'

type LoginFormProps = {
  form: UseFormReturn<LoginFormSchema>
  onSubmit: (values: LoginFormSchema) => void
  isPending: boolean
}

export const LoginForm = ({ form, onSubmit, isPending }: LoginFormProps) => {
  return (
    <Card className="w-full max-w-2xl border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardHeader>
        <CardTitle>
          <Heading size={'h3'}>{m.page_auth_form_login_header_title()}</Heading>
        </CardTitle>
        <CardDescription>
          {m.page_auth_form_login_header_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OAuthSignIn />
        <div className="flex w-full items-center gap-2 pt-8 pb-5 text-xs text-nowrap">
          <div className="bg-foreground h-0.5 w-full" />
          {m.page_auth_form_login_content_optional_account()}
          <div className="bg-foreground h-0.5 w-full" />
        </div>
        <FormProvider {...form}>
          <LoginFormInner formId="login-form" onSubmit={onSubmit} />
        </FormProvider>
        <div className="text-muted-foreground w-full space-y-1 space-x-0_5 py-2 text-sm">
          <span>{m.page_auth_form_login_content_forgot_password()}</span>
          <Link
            to={'/{-$locale}'}
            className="font-medium text-blue-600/80 transition-colors hover:text-blue-600 hover:underline"
          >
            {m.page_auth_form_login_content_click_here()}
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex-col place-content-between gap-y-5 pt-5">
        <Button form="login-form" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              {m.page_auth_form_login_footer_submit_button_loading()} . . .
            </>
          ) : (
            m.page_auth_form_login_footer_submit_button()
          )}
        </Button>
        <span className="text-muted-foreground text-sm">
          {m.page_auth_form_login_footer_caption()}{' '}
          <Link
            to="/{-$locale}/register"
            className="font-medium text-blue-600/80 transition-colors hover:text-blue-600 hover:underline"
          >
            {m.page_auth_form_login_footer_caption_redirect()}
          </Link>
        </span>
      </CardFooter>
    </Card>
  )
}
