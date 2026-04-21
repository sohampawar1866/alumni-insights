import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Default to the student dashboard as this callback is primarily for Google OAuth
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user && user.email) {
        // Enforce the @iiitn.ac.in domain for Google OAuth logins
        if (!user.email.endsWith('@iiitn.ac.in')) {
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/unauthorized`)
        }
        
        // Check if the user already has a row in the public.profiles table
        const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
        
        if (!profile) {
          // If not, automatically create a base profile row for them
          await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            role: 'student',
            full_name: user.user_metadata?.full_name || '',
          })
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redirect back to login with a generic error indicator if the code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
