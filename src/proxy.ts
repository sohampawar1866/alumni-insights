import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Ignore static assets and Next.js internals
  if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('.')) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname;

  // Paths that don't require auth
  if (!user) {
    if (path === '/' || path.includes('/login') || path.includes('/api/auth') || path === '/unauthorized') {
      return response;
    }
    
    // Redirect unauthenticated users
    if (path.startsWith('/admin')) return NextResponse.redirect(new URL('/admin/login', request.url))
    if (path.startsWith('/moderator')) return NextResponse.redirect(new URL('/moderator/login', request.url))
    if (path.startsWith('/alumni')) return NextResponse.redirect(new URL('/alumni/login', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Fetch the role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const role = profile?.role || 'student'

  // Redirect authenticated users away from login pages
  if (path === '/' || path.includes('/login')) {
    if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    if (role === 'moderator') return NextResponse.redirect(new URL('/moderator/dashboard', request.url))
    if (role === 'alumni') return NextResponse.redirect(new URL('/alumni/dashboard', request.url))
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Enforce role-based access for dashboard paths
  if (path.startsWith('/admin/dashboard') && role !== 'admin') return NextResponse.redirect(new URL('/unauthorized', request.url))
  if (path.startsWith('/moderator/dashboard') && role !== 'moderator') return NextResponse.redirect(new URL('/unauthorized', request.url))
  if (path.startsWith('/alumni/dashboard') && role !== 'alumni') return NextResponse.redirect(new URL('/unauthorized', request.url))
  if (path.startsWith('/dashboard') && role !== 'student') return NextResponse.redirect(new URL('/unauthorized', request.url))

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
