'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notification-bell'
import { LayoutDashboard, Search, GitPullRequest, Megaphone, Menu, X, LogOut, GraduationCap } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/search', label: 'Search Alumni', icon: Search },
    { href: '/dashboard/requests', label: 'My Requests', icon: GitPullRequest },
    { href: '/announcements', label: 'Announcements', icon: Megaphone },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-slate-800 transition-colors">
              <GraduationCap className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900 leading-none">
                Alumni Insights
              </span>
              <span className="text-[10px] font-medium tracking-wider text-slate-500 uppercase mt-0.5">
                IIIT Nagpur
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <NotificationBell />
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" size="sm" type="submit" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5">
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Sign Out
            </Button>
          </form>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <NotificationBell />
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <X className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-200 mt-3 space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={2} />
                {link.label}
              </Link>
            )
          })}
          <div className="pt-2 mt-2 border-t border-slate-200">
            <form action="/api/auth/signout" method="POST" className="w-full">
              <Button variant="outline" type="submit" className="w-full justify-center gap-2 text-slate-700">
                <LogOut className="w-4 h-4" strokeWidth={2} />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
