'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

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
        router.refresh() // Trigger a server re-render to reflect the completed profile
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-background border-4 border-foreground shadow-[8px_8px_0px_var(--color-foreground)] w-full max-w-md space-y-6 p-8 relative mt-6">
      <div className="absolute -top-5 -left-4 bg-primary border-2 border-foreground px-3 py-1 font-black text-sm uppercase transform -rotate-3">
        Action Required
      </div>
      
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Complete Profile</h2>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">Provide your branch and graduation year to continue exploring.</p>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase tracking-wide text-foreground">Branch</label>
        <Input 
          required 
          placeholder="e.g., Computer Science Engineering" 
          value={branch} 
          onChange={(e) => setBranch(e.target.value)} 
          className="text-lg font-mono focus-visible:bg-secondary"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-black uppercase tracking-wide text-foreground">Graduation Year</label>
        <Input 
          required 
          type="number" 
          placeholder="e.g., 2026" 
          value={graduationYear} 
          onChange={(e) => setGraduationYear(e.target.value)} 
          min={2000}
          max={2100}
          className="text-lg font-mono focus-visible:bg-secondary"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full h-14 text-lg mt-4 shadow-[8px_8px_0px_var(--color-foreground)] hover:shadow-[4px_4px_0px_var(--color-foreground)]">
        {loading ? 'SAVING...' : 'SAVE & CONTINUE'}
      </Button>
    </form>
  )
}
