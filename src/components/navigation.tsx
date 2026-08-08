'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'
import { LayoutDashboard, Search, GitPullRequest, Megaphone, Menu, X, LogOut, Info } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Search Alumni', icon: Search },
    { href: '/dashboard/requests', label: 'My Requests', icon: GitPullRequest },
    { href: '/announcements', label: 'Announcements', icon: Megaphone },
    { href: '/about', label: 'About', icon: Info },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-slate-900 bg-white/95 backdrop-blur-md px-3 py-2.5 sm:px-8 sm:py-3 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-8 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/images/iiitn.png"
                alt="IIIT Nagpur Logo"
                width={40}
                height={40}
                priority
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-sm sm:text-xl font-bold tracking-tight text-slate-900 leading-none truncate">
                <span className="sm:hidden">Alumni Insights</span>
                <span className="hidden sm:inline">Alumni Insights</span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold tracking-wider text-slate-500 uppercase mt-0.5 truncate">
                IIIT Nagpur
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-amber-400 border-slate-900 text-slate-900 shadow-[3px_3px_0px_#0f172a]'
                      : 'border-transparent text-slate-700 hover:border-slate-900 hover:bg-slate-100 hover:shadow-[3px_3px_0px_#0f172a]'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <NotificationBell />
          <div className="h-5 w-[2px] bg-slate-900/20 mx-1" />
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" size="sm" type="submit" className="gap-2">
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
              Sign Out
            </Button>
          </form>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <NotificationBell />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_#0f172a] hover:shadow-[4px_4px_0px_#0f172a] hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-all"
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X className="w-5 h-5" strokeWidth={2.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden pt-4 pb-3 border-t-2 border-slate-900 mt-3 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-xs font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-amber-400 border-slate-900 text-slate-900 shadow-[3px_3px_0px_#0f172a]'
                    : 'border-slate-900 bg-white text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2.5} />
                {link.label}
              </Link>
            )
          })}
          <div className="pt-3 mt-3 border-t-2 border-slate-900">
            <form action="/api/auth/signout" method="POST" className="w-full">
              <Button variant="outline" type="submit" className="w-full justify-center gap-2">
                <LogOut className="w-4 h-4" strokeWidth={2.5} />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
