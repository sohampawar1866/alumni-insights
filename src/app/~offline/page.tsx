import { WifiOff } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background border-t-8 border-foreground font-sans relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="p-10 bg-white border-8 border-foreground shadow-[16px_16px_0px_var(--color-foreground)] max-w-md w-full text-center relative z-10">
        <div className="flex justify-center mb-6 text-destructive">
          <WifiOff size={64} strokeWidth={2.5} />
        </div>
        
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter text-foreground">
          You are offline
        </h1>
        
        <p className="mb-8 font-bold text-muted-foreground uppercase text-sm tracking-wider">
          Please check your internet connection and try again.
        </p>
        
        <Link 
          href="/"
          className="inline-flex w-full h-14 items-center justify-center bg-primary border-4 border-foreground px-8 text-sm font-black uppercase tracking-widest text-background shadow-[8px_8px_0px_var(--color-foreground)] transition-all hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_var(--color-foreground)]"
        >
          Try Again
        </Link>
      </div>
    </div>
  )
}
