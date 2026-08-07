'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, UserCheck } from 'lucide-react'

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
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('roles')
          .eq('id', user.id)
          .single()
        
        if (!profile?.roles?.includes('alumni')) {
          await supabase.auth.signOut()
          setError('ACCESS DENIED: This portal is for verified alumni only. If you are a student, please use the Student Login instead.')
          setLoading(false)
          return
        }
      }
      router.push('/alumni/dashboard')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-4 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="p-8 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] max-w-sm w-full relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400 border-2 border-slate-900 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
            <UserCheck className="w-3.5 h-3.5" /> Alumni Portal
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
            Alumni Sign In
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Sign in with the login credentials provided by the Placement Cell.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="email">Email Address</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="alumni@example.com"
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
            <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 text-xs font-bold text-red-900 shadow-[2px_2px_0px_#0f172a] space-y-2">
              <p>{error}</p>
              {error.includes('student') && (
                <a href="/login" className="underline text-red-800 hover:text-red-950 block">Go to Student Login &rarr;</a>
              )}
            </div>
          )}
          
          <Button type="submit" className="w-full h-11 text-sm font-bold shadow-[4px_4px_0px_#0f172a] mt-4" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In to Alumni Portal'}
          </Button>
        </form>

        <div className="pt-2 space-y-2 text-center">
          <p className="text-xs text-slate-500">
            Are you a student?{" "}
            <Link href="/login" className="font-bold text-slate-900 underline hover:text-slate-700 transition-colors">
              Go to Student Login
            </Link>
          </p>
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  )
}
