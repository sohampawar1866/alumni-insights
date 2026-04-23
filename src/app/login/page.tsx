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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background border-t-8 border-foreground font-sans relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="p-10 bg-white border-8 border-foreground shadow-[16px_16px_0px_var(--color-foreground)] max-w-md w-full text-center relative z-10 transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[20px_20px_0px_var(--color-foreground)]">
        <div className="absolute -top-6 -left-6 bg-[#fdc800] border-4 border-foreground px-4 py-1 font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_var(--color-foreground)] -rotate-6">
          <span className="inline-block w-2 h-2 bg-foreground mr-2 animate-pulse" />
          STUDENT PORTAL
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black mb-6 uppercase tracking-tighter text-foreground leading-tight mt-6">
          ALUMNI<br />INSIGHTS
        </h1>
        
        <div className="mb-8 border-t-4 border-b-4 border-dashed border-foreground py-4 bg-muted">
          <p className="font-bold text-foreground uppercase text-xs tracking-wider">
            Access strictly restricted to <span className="bg-primary text-background px-1">@iiitn.ac.in</span> institutional accounts.
          </p>
        </div>
        
        <Button 
          onClick={handleLogin} 
          className="w-full h-16 text-lg font-black uppercase tracking-widest bg-primary text-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)]"
        >
          AUTH WITH GOOGLE
        </Button>
      </div>
    </div>
  )
}
