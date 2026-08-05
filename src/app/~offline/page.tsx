import { WifiOff, RotateCw } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-4 relative overflow-hidden">
      <div className="p-8 bg-white border-2 border-slate-900 rounded-2xl shadow-[8px_8px_0px_#0f172a] max-w-sm w-full text-center relative z-10 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-slate-900 text-slate-900 mx-auto flex items-center justify-center shadow-[3px_3px_0px_#0f172a]">
          <WifiOff className="w-8 h-8" strokeWidth={2} />
        </div>
        
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
            You are Offline
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Please check your network connection and try again.
          </p>
        </div>
        
        <Link 
          href="/"
          className="inline-flex w-full h-11 items-center justify-center bg-slate-900 text-white rounded-xl border-2 border-slate-900 text-xs font-bold shadow-[3px_3px_0px_#0f172a] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0f172a] transition-all gap-2"
        >
          <RotateCw className="w-4 h-4" /> Try Again
        </Link>
      </div>
    </div>
  )
}
