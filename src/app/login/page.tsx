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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-2">Alumni Insights</h1>
        <p className="mb-6 text-sm text-gray-600">Sign in with your IIIT Nagpur student account to continue.</p>
        <Button onClick={handleLogin} className="w-full">
          Sign In with Google
        </Button>
      </div>
    </div>
  )
}
