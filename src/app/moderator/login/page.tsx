'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ModeratorLoginPage() {
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
      // Verify the user actually has the moderator role
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', user.id)
          .single()
        
        if (!profile?.roles?.includes('moderator')) {
          await supabase.auth.signOut()
          setError('This account does not have moderator access.')
          setLoading(false)
          return
        }
      }
      router.push('/moderator/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="p-8 bg-white border-4 border-foreground shadow-[8px_8px_0px_#000] max-w-sm w-full">
        <h1 className="text-2xl font-black mb-2 text-center uppercase tracking-tight">Moderator Portal</h1>
        <p className="mb-6 text-sm font-bold text-muted-foreground text-center uppercase tracking-wider">Placement Access</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider" htmlFor="email">Email</label>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider" htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] focus-visible:ring-0 focus-visible:border-primary"
              required 
            />
          </div>
          
          {error && <p className="text-destructive font-bold text-sm text-center uppercase tracking-tight bg-destructive/10 border-2 border-destructive p-2">{error}</p>}
          
          <Button type="submit" className="w-full font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all" size="lg" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:underline transition-all">
            <ArrowLeft className="w-4 h-4 inline-block mr-1" strokeWidth={2.5} /> Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  )
}
