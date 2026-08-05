'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, GraduationCap, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        queryParams: {
          hd: 'iiitn.ac.in',
        },
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-4 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="p-8 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] max-w-md w-full text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 border-2 border-slate-900 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Student Sign In Portal
        </div>
        
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-900 text-white mx-auto flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
            <GraduationCap className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
            Alumni Insights
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            IIIT Nagpur Alumni Discovery & Mentorship Network
          </p>
        </div>
        
        <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-4 text-xs font-medium text-slate-700">
          Access is strictly restricted to verified <strong className="text-slate-900 bg-amber-200 px-1 rounded font-bold">@iiitn.ac.in</strong> institutional accounts.
        </div>
        
        <Button 
          onClick={handleLogin} 
          className="w-full h-12 text-sm font-bold bg-slate-900 text-white shadow-[4px_4px_0px_#0f172a] hover:bg-slate-800 gap-2"
        >
          Sign In with Google (@iiitn.ac.in)
        </Button>

        <div className="pt-2">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  )
}
