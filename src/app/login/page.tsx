'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          // Instructs Google to pre-filter accounts for this domain
          hd: 'iiitn.ac.in',
        },
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background border-t-[8px] border-primary">
      <div className="p-8 bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] max-w-sm w-full text-center relative">
        <div className="absolute -top-4 -left-4 bg-secondary border-2 border-foreground px-3 py-1 font-bold text-sm transform -rotate-2">
          Secure
        </div>
        <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter mt-4">Alumni Insights</h1>
        <p className="mb-8 font-bold text-muted-foreground uppercase text-sm tracking-wide">Sign in with your IIIT Nagpur student account to continue.</p>
        <Button onClick={handleLogin} className="w-full h-14 text-lg">
          Sign In with Google
        </Button>
      </div>
    </div>
  )
}
