import { Heading } from '@/components/heading'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import * as m from '@/generated/paraglide/messages'
import { Loader2 } from 'lucide-react'
import { useVerifyEmail } from '../hooks'

type EmailVerificationFormProps = {
  withInput?: boolean
  email?: string
  autoCooldown?: boolean
}

export const EmailVerificationForm = ({
  withInput = false,
  email: propEmail = '',
  autoCooldown = false,
}: EmailVerificationFormProps) => {
  const {
    email,
    setEmail,
    isSending,
    isSendingSuccess,
    isOnCooldown,
    cooldownTime,
    sendVerification,
    formatTime,
  } = useVerifyEmail({ email: propEmail, autoCooldown })

  const getButtonText = () => {
    if (isSending)
      return (
        <>
          <Loader2 className="animate-spin" />
          {m.page_auth_form_verify_email_footer_submit_button_loading()}
        </>
      )
    if (isOnCooldown)
      return m.page_auth_form_verify_email_footer_resend_button({
        time: formatTime(cooldownTime),
      })

    if (isSendingSuccess)
      return m.success_message_verify({ field: m.model_auth_field_email() })

    return m.page_auth_form_verify_email_footer_submit_button()
  }

  return (
    <Card className="w-full max-w-2xl border-0 shadow-0 md:border-2 md:shadow-shadow">
      <CardHeader>
        <CardTitle>
          <Heading size={'h3'}>
            {m.page_auth_form_verify_email_header_title()}
          </Heading>
        </CardTitle>
        <CardDescription>
          {m.page_auth_form_verify_email_header_description()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">
          {m.page_auth_form_verify_email_content_caption()}
        </p>
        {!withInput ? (
          <Button
            variant="outline"
            type="button"
            onClick={() => sendVerification(propEmail)}
            className="w-full"
            disabled={isSending || isOnCooldown || !propEmail.trim()}
          >
            {getButtonText()}
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              className="my-1"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSending}
            />
            <Button
              type="button"
              onClick={() => sendVerification()}
              className="w-full sm:w-fit"
              disabled={isSending || isOnCooldown}
            >
              {getButtonText()}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
