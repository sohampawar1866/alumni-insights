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
    <header className="sticky top-0 z-40 flex items-center justify-between border-b-[3px] border-foreground bg-background px-4 py-4 sm:px-8">
      <div className="flex items-center gap-5 sm:gap-10">
        <Link href="/dashboard" className="font-heading text-2xl font-black uppercase tracking-tighter">
          Alumni Insights
        </Link>
        <nav className="hidden items-center gap-2 sm:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 border-2 border-transparent text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:border-foreground hover:bg-muted ${
                  isActive
                    ? 'bg-secondary border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-foreground -translate-y-1 -translate-x-1'
                    : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
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
