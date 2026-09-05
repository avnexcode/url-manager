import { GoogleIcon } from '@/components/elements/icons'
import { Button } from '@/components/ui/button'
import * as m from '@/generated/paraglide/messages'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type OAuthSignInProps = {
  className?: string
}

export const OAuthSignIn = ({ className }: OAuthSignInProps) => {
  const handleGoogleLogin = async () => {
    const redirectTo = `${window.location.origin}/oauth/callback`

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })

      if (error) {
        const { code, status, message } = error

        throw new Error(JSON.stringify({ code, status, message }))
      }
    } catch (error) {
      toast.error(m.error_message_supabase_auth_default())
    }
  }

  return (
    <div className={cn('flex w-full items-center justify-center', className)}>
      <Button variant="default" className="w-full" onClick={handleGoogleLogin}>
        <GoogleIcon width={25} height={25} />
        Google
      </Button>
    </div>
  )
}
