'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isInProgressResolution } from '@/lib/revcompass/claim-resolution'
import type { ClaimResolutionStatus, ClaimResolutionSummary, RecoveryPackage } from '@/lib/revcompass/types'

export const CLAIM_RESOLUTION_STORAGE_KEY = 'revcompass_claim_resolution'

type ProgressMap = Record<string, ClaimResolutionStatus>

function claimKey(packageId: string, claimId: string) {
  return `${packageId}:${claimId}`
}

function loadProgress(): ProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(CLAIM_RESOLUTION_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ProgressMap
  } catch {
    return {}
  }
}

function persistProgress(progress: ProgressMap) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CLAIM_RESOLUTION_STORAGE_KEY, JSON.stringify(progress))
  } catch {
    /* storage may be unavailable */
  }
}

function summarizeStatuses(statuses: ClaimResolutionStatus[]): ClaimResolutionSummary {
  if (statuses.length === 0) {
    return { total: 0, resolved: 0, inProgress: 0, notStarted: 0, percentResolved: 0 }
  }
  const resolved = statuses.filter((s) => s === 'resolved').length
  const inProgress = statuses.filter((s) => isInProgressResolution(s)).length
  const notStarted = statuses.filter((s) => s === 'not_started').length
  return {
    total: statuses.length,
    resolved,
    inProgress,
    notStarted,
    percentResolved: Math.round((resolved / statuses.length) * 100),
  }
}

type ClaimResolutionContextValue = {
  getClaimProgress: (packageId: string, claimId: string) => ClaimResolutionStatus
  setClaimProgress: (packageId: string, claimId: string, status: ClaimResolutionStatus) => void
  getSummaryForClaimIds: (packageId: string, claimIds: string[]) => ClaimResolutionSummary
  getGlobalAssignedSummary: (
    packages: RecoveryPackage[],
    getAssignedClaimIds: (pkg: RecoveryPackage) => string[],
  ) => ClaimResolutionSummary
}

const ClaimResolutionContext = createContext<ClaimResolutionContextValue | null>(null)

export function ClaimResolutionProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressMap>({})

  useEffect(() => {
    setProgress(loadProgress())
  }, [])

  const getClaimProgress = useCallback(
    (packageId: string, claimId: string): ClaimResolutionStatus => {
      return progress[claimKey(packageId, claimId)] ?? 'not_started'
    },
    [progress],
  )

  const setClaimProgress = useCallback(
    (packageId: string, claimId: string, status: ClaimResolutionStatus) => {
      setProgress((prev) => {
        const next = { ...prev, [claimKey(packageId, claimId)]: status }
        persistProgress(next)
        return next
      })
    },
    [],
  )

  const getSummaryForClaimIds = useCallback(
    (packageId: string, claimIds: string[]): ClaimResolutionSummary => {
      const statuses = claimIds.map((claimId) => getClaimProgress(packageId, claimId))
      return summarizeStatuses(statuses)
    },
    [getClaimProgress],
  )

  const getGlobalAssignedSummary = useCallback(
    (
      packages: RecoveryPackage[],
      getAssignedClaimIds: (pkg: RecoveryPackage) => string[],
    ): ClaimResolutionSummary => {
      const statuses: ClaimResolutionStatus[] = []
      for (const pkg of packages) {
        for (const claimId of getAssignedClaimIds(pkg)) {
          statuses.push(getClaimProgress(pkg.id, claimId))
        }
      }
      return summarizeStatuses(statuses)
    },
    [getClaimProgress],
  )

  const value = useMemo(
    () => ({
      getClaimProgress,
      setClaimProgress,
      getSummaryForClaimIds,
      getGlobalAssignedSummary,
    }),
    [getClaimProgress, setClaimProgress, getSummaryForClaimIds, getGlobalAssignedSummary],
  )

  return (
    <ClaimResolutionContext.Provider value={value}>{children}</ClaimResolutionContext.Provider>
  )
}

export function useClaimResolution() {
  const ctx = useContext(ClaimResolutionContext)
  if (!ctx) throw new Error('useClaimResolution must be used within ClaimResolutionProvider')
  return ctx
}
