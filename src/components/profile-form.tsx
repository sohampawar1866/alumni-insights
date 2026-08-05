'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { UserCheck } from 'lucide-react'

export function ProfileForm({ initialData }: { initialData?: Record<string, unknown> | null }) {
  const [branch, setBranch] = useState<string>((initialData?.branch as string) || '')
  const [graduationYear, setGraduationYear] = useState<string | number>((initialData?.graduation_year as string | number) || '')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          branch,
          graduation_year: parseInt(String(graduationYear)),
        })
        .eq('id', user.id)

      if (!error) {
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-900 rounded-2xl shadow-[6px_6px_0px_#0f172a] w-full max-w-md space-y-5 p-6 sm:p-8 relative mt-4 font-sans">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 border-2 border-slate-900 text-xs font-bold text-slate-900 shadow-[2px_2px_0px_#0f172a]">
        <UserCheck className="w-3.5 h-3.5" /> Action Required
      </div>
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 font-heading">Complete Student Profile</h2>
        <p className="text-xs text-slate-600 font-medium">Provide your branch and graduation year to finish account setup.</p>
      </div>
      
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Branch</label>
        <Input 
          required 
          placeholder="e.g., Computer Science Engineering" 
          value={branch} 
          onChange={(e) => setBranch(e.target.value)} 
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Graduation Year</label>
        <Input 
          required 
          type="number" 
          placeholder="e.g., 2026" 
          value={graduationYear} 
          onChange={(e) => setGraduationYear(e.target.value)} 
          min={2000}
          max={2100}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? 'Saving Profile...' : 'Save & Continue'}
      </Button>
    </form>
  )
}
