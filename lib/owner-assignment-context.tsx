'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getManagerById } from '@/lib/revcompass/managers'
import { RECOVERY_PACKAGES } from '@/lib/revcompass/packages'
import type { PackageManager, RecoveryPackage } from '@/lib/revcompass/types'

export const OWNER_ASSIGNMENTS_STORAGE_KEY = 'revcompass_owner_assignments_v2'

type OwnerAssignmentContextValue = {
  assignOwner: (packageId: string, managerId: string) => void
  getAssignedOwner: (pkg: RecoveryPackage) => PackageManager
  getAssignedManagerId: (pkg: RecoveryPackage) => string
  isPackageOwnedByManager: (pkg: RecoveryPackage, managerId: string) => boolean
}

const OwnerAssignmentContext = createContext<OwnerAssignmentContextValue | null>(null)

function buildDefaultAssignments(): Record<string, string> {
  return Object.fromEntries(
    RECOVERY_PACKAGES.map((pkg) => [pkg.id, pkg.recommendedOwner.id]),
  )
}

function loadStoredAssignments(): Record<string, string> {
  const defaults = buildDefaultAssignments()
  if (typeof window === 'undefined') return defaults
  try {
    const raw = window.localStorage.getItem(OWNER_ASSIGNMENTS_STORAGE_KEY)
    if (!raw) return defaults
    return { ...defaults, ...JSON.parse(raw) } as Record<string, string>
  } catch {
    return defaults
  }
}

function persistAssignments(assignments: Record<string, string>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(OWNER_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments))
  } catch {
    /* storage may be unavailable */
  }
}

export function OwnerAssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Record<string, string>>(buildDefaultAssignments)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setAssignments(loadStoredAssignments())
    setHydrated(true)
  }, [])

  const assignOwner = useCallback((packageId: string, managerId: string) => {
    setAssignments((prev) => {
      const next = { ...prev, [packageId]: managerId }
      persistAssignments(next)
      return next
    })
  }, [])

  const getAssignedManagerId = useCallback(
    (pkg: RecoveryPackage): string => {
      if (!hydrated) return pkg.recommendedOwner.id
      return assignments[pkg.id] ?? pkg.recommendedOwner.id
    },
    [assignments, hydrated],
  )

  const getAssignedOwner = useCallback(
    (pkg: RecoveryPackage): PackageManager => {
      const managerId = getAssignedManagerId(pkg)
      return getManagerById(managerId) ?? pkg.recommendedOwner
    },
    [getAssignedManagerId],
  )

  const isPackageOwnedByManager = useCallback(
    (pkg: RecoveryPackage, managerId: string) => getAssignedManagerId(pkg) === managerId,
    [getAssignedManagerId],
  )

  const value = useMemo(
    () => ({ assignOwner, getAssignedOwner, getAssignedManagerId, isPackageOwnedByManager }),
    [assignOwner, getAssignedOwner, getAssignedManagerId, isPackageOwnedByManager],
  )

  return (
    <OwnerAssignmentContext.Provider value={value}>
      {children}
    </OwnerAssignmentContext.Provider>
  )
}

export function useOwnerAssignment() {
  const ctx = useContext(OwnerAssignmentContext)
  if (!ctx) throw new Error('useOwnerAssignment must be used within OwnerAssignmentProvider')
  return ctx
}
