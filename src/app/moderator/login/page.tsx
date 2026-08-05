'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield } from 'lucide-react'

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-4 relative overflow-hidden">
      <div className="p-8 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] max-w-sm w-full relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border-2 border-slate-900 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Placement Cell Moderator
          </div>
          <div className="relative w-16 h-16 mx-auto">
            <Image
              src="/images/iiitn.png"
              alt="IIIT Nagpur Logo"
              width={64}
              height={64}
              className="w-16 h-16 object-contain rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Moderator Sign In
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            IIIT Nagpur Placement Cell administrative login.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="email">Email</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="moderator@iiitn.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0px_#0f172a]">
              {error}
            </div>
          )}
          
          <Button type="submit" className="w-full h-11 text-sm font-bold shadow-[4px_4px_0px_#0f172a] mt-4" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In as Moderator'}
          </Button>
        </form>
        <div className="pt-2 text-center">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  )
}
