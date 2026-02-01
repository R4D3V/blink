'use client'

import { useEffect, useState } from 'react'
import LoginScreen from '@/components/LoginScreen'
import ChatScreen from '@/components/ChatScreen'
import { useAuthStore } from '@/lib/store'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { user, loadUser } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    loadUser()
  }, [loadUser])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {user ? <ChatScreen /> : <LoginScreen />}
    </main>
  )
}
