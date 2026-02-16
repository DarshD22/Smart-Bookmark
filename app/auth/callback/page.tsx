'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session
        await supabase.auth.getSession()

        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          // Redirect to dashboard on successful auth
          router.push('/dashboard')
        } else {
          // If no session, redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-600">Processing authentication...</div>
    </div>
  )
}
