'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'

export function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/search', label: 'Search' },
    { href: '/dashboard/requests', label: 'Requests' },
    { href: '/announcements', label: 'Announcements' },
  ]

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm border-b">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="font-bold text-xl tracking-tight text-blue-900">
          Alumni Insights
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <form action="/api/auth/signout" method="POST">
          <Button variant="outline" size="sm" type="submit">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}
