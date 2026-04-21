'use client'

import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
      <div className="font-bold text-xl tracking-tight text-blue-900">Alumni Insights</div>
      <form action="/api/auth/signout" method="POST">
        <Button variant="outline" type="submit">
          Sign Out
        </Button>
      </form>
    </header>
  )
}
