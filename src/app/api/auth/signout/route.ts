import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Determine which login page to redirect to based on the user's roles
  const { data: { user } } = await supabase.auth.getUser()
  let redirectPath = '/login' // default: student login

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('roles')
      .eq('id', user.id)
      .single()

    const roles: string[] = profile?.roles || []

    // Redirect to the login page matching their primary role
    if (roles.includes('admin')) redirectPath = '/admin/login'
    else if (roles.includes('moderator')) redirectPath = '/moderator/login'
    else if (roles.includes('alumni')) redirectPath = '/alumni/login'
  }

  await supabase.auth.signOut()

  const url = new URL(redirectPath, request.url)
  return NextResponse.redirect(url, { status: 302 })
}
