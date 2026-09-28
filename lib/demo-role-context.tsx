'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { PublicUser } from '@/lib/auth/config'
import type { DemoRole } from '@/lib/revcompass/types'

type DemoRoleContextValue = {
  user: PublicUser | null
  role: DemoRole
  loading: boolean
}

const DemoRoleContext = createContext<DemoRoleContextValue | null>(null)

export function DemoRoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) return
        const data = (await response.json()) as { user?: PublicUser }
        if (!cancelled && data.user) setUser(data.user)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadSession()
    return () => {
      cancelled = true
    }
  }, [])

  const role = user?.role ?? 'analyst'

  return (
    <DemoRoleContext.Provider value={{ user, role, loading }}>
      {children}
    </DemoRoleContext.Provider>
  )
}

export function useDemoRole() {
  const ctx = useContext(DemoRoleContext)
  if (!ctx) throw new Error('useDemoRole must be used within DemoRoleProvider')
  return ctx
}
