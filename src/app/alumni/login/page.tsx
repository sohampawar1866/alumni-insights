'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function AlumniLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/alumni/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-secondary border-b-4 border-foreground" />
      <div className="p-8 bg-background border-4 border-foreground shadow-[12px_12px_0px_var(--color-foreground)] max-w-sm w-full relative z-10 mt-4">
        
        <div className="absolute -top-6 right-4 rotate-3 bg-primary border-2 border-foreground px-4 py-1 font-black text-xs uppercase">
          ALUMNI ACCESS ONLY
        </div>

        <h1 className="text-3xl font-black mb-2 text-center uppercase tracking-tighter mt-2">Alumni Portal</h1>
        <p className="mb-6 text-sm font-bold text-muted-foreground uppercase text-center">Sign in with the credentials provided by the moderator.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black uppercase tracking-wide" htmlFor="email">Email Address</label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="text-lg font-mono focus-visible:bg-secondary"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-black uppercase tracking-wide" htmlFor="password">Passcode</label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="text-lg font-mono focus-visible:bg-secondary"
            />
          </div>
          
          {error && <div className="bg-destructive text-white p-3 border-2 border-foreground font-bold text-center uppercase tracking-wide text-xs">{error}</div>}
          
          <Button type="submit" className="w-full h-14 text-lg mt-8 shadow-[8px_8px_0px_var(--color-foreground)] hover:shadow-[4px_4px_0px_var(--color-foreground)]" disabled={loading}>
            {loading ? 'Authenticating...' : 'Enter Platform'}
          </Button>
        </form>
      </div>
    </div>
  )
}
