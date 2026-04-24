'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'
import { LayoutDashboard, Search, GitPullRequest, Megaphone, Menu, X, LogOut } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/dashboard/requests', label: 'Requests', icon: GitPullRequest },
    { href: '/announcements', label: 'Announcements', icon: Megaphone },
  ]

  return (
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
              <X className="w-5 h-5" strokeWidth={3} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
      
      <div className={`${isOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row w-full sm:w-auto items-start sm:items-center gap-4 mt-4 sm:mt-0`}>
        <nav className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-transparent text-sm font-bold uppercase tracking-wide transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_var(--color-foreground)] hover:border-foreground hover:bg-muted whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-secondary border-foreground shadow-[4px_4px_0px_var(--color-foreground)] text-foreground sm:-translate-y-1 sm:-translate-x-1'
                    : 'text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        {/* Mobile Sign Out */}
        <div className="flex sm:hidden w-full pt-4 border-t-2 border-foreground mt-2">
          <form action="/api/auth/signout" method="POST" className="w-full">
            <Button variant="outline" type="submit" className="w-full font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
              Sign Out
            </Button>
          </form>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-4 shrink-0 ml-4">
        <NotificationBell />
        <form action="/api/auth/signout" method="POST">
          <Button variant="outline" size="sm" type="submit" className="font-black uppercase tracking-wider border-2 border-foreground rounded-none shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-2">
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            Sign Out
          </Button>
        </form>
      </div>
    </header>
  )
}
