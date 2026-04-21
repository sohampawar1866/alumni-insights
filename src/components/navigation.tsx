'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
      <div className="font-bold text-xl tracking-tight text-blue-900">Alumni Insights</div>
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </header>
  )
}
