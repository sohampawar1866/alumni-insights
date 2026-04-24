'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/search', label: 'Search' },
    { href: '/dashboard/requests', label: 'Requests' },
    { href: '/announcements', label: 'Announcements' },
  ]

    <header className="sticky top-0 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-[3px] border-foreground bg-background px-4 py-4 sm:px-8">
      <div className="flex w-full sm:w-auto items-center justify-between gap-5 sm:gap-10">
        <Link href="/dashboard" className="font-heading text-2xl font-black uppercase tracking-tighter shrink-0">
          Alumni Insights
        </Link>
        {/* Mobile Toggle */}
        <div className="flex sm:hidden items-center gap-4">
          <NotificationBell />
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 border-2 border-foreground bg-white shadow-[2px_2px_0px_#000] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            )}
          </button>
        </div>
      </div>
      
      <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-4 mt-4 sm:mt-0`}>
        <nav className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 sm:px-4 py-2 border-2 border-transparent text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:border-foreground hover:bg-muted whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-secondary border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-foreground sm:-translate-y-1 sm:-translate-x-1'
                    : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        {/* Mobile Sign Out */}
        <div className="flex sm:hidden w-full pt-4 border-t-2 border-foreground mt-2">
          <form action="/api/auth/signout" method="POST" className="w-full">
            <Button variant="outline" type="submit" className="w-full font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000]">
              Sign Out
            </Button>
          </form>
        </div>
      </div>

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
