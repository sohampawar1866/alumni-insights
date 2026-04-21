'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function ProfileForm({ initialData }: { initialData?: Record<string, unknown> | null }) {
  const [branch, setBranch] = useState(initialData?.branch || '')
  const [graduationYear, setGraduationYear] = useState(initialData?.graduation_year || '')
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
          graduation_year: parseInt(graduationYear),
        })
        .eq('id', user.id)

      if (!error) {
        router.refresh() // Trigger a server re-render to reflect the completed profile
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm p-6 bg-white shadow-sm rounded-lg border">
      <h2 className="text-xl font-semibold">Complete your profile</h2>
      <p className="text-sm text-gray-600 mb-4">Please provide your branch and graduation year to continue exploring Alumni Insights.</p>
      
      <div>
        <label className="block text-sm font-medium mb-1">Branch</label>
        <Input 
          required 
          placeholder="e.g., Computer Science Engineering" 
          value={branch} 
          onChange={(e) => setBranch(e.target.value)} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Graduation Year</label>
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Profile'}
      </Button>
    </form>
  )
}
