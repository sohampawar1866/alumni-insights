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
    <header className="sticky top-0 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-[3px] border-foreground bg-background px-4 py-4 sm:px-8 gap-4 sm:gap-0">
      <div className="flex w-full sm:w-auto items-center justify-between gap-5 sm:gap-10">
        <Link href="/dashboard" className="font-heading text-2xl font-black uppercase tracking-tighter shrink-0">
          Alumni Insights
        </Link>
        {/* Mobile Actions */}
        <div className="flex sm:hidden items-center gap-4">
          <NotificationBell />
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" size="sm" type="submit" className="px-2 font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000]">
              Exit
            </Button>
          </form>
        </div>
      </div>
      
      <nav className="flex w-full sm:w-auto items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 sm:px-4 py-2 border-2 border-transparent text-xs sm:text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:border-foreground hover:bg-muted whitespace-nowrap shrink-0 ${
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

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-4 shrink-0 ml-4">
        <NotificationBell />
        <form action="/api/auth/signout" method="POST">
          <Button variant="outline" size="sm" type="submit" className="font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}
