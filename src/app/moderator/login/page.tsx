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
      <div className="absolute inset-0 pointer-events-none opacity-[0.4] bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute -bottom-16 -right-16 w-60 h-60 rotate-12 bg-blue-400/10 border-2 border-blue-400/20 rounded-3xl pointer-events-none" />

      <div className="p-8 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] max-w-sm w-full relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 border-2 border-slate-900 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Alumni Committee Moderator
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
            Alumni Committee, IIITN administrative login.
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
          
          <button type="submit" disabled={loading} className="w-full min-h-[48px] flex items-center justify-center text-sm font-bold bg-slate-900 text-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_#0f172a] hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#0f172a] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 mt-4">
            {loading ? 'Authenticating...' : 'Sign In as Moderator'}
          </button>
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
