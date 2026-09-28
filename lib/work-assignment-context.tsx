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
import { getAnalystById } from '@/lib/revcompass/analysts'
import { RECOVERY_PACKAGES } from '@/lib/revcompass/packages'
import type { ClaimRangeAssignment, ClusterClaim, RecoveryPackage } from '@/lib/revcompass/types'

export const WORK_ASSIGNMENTS_STORAGE_KEY = 'revcompass_work_assignments_v3'

function buildSeedAssignments(): ClaimRangeAssignment[] {
  return []
}

function buildDefaultAssignments(): ClaimRangeAssignment[] {
  return buildSeedAssignments()
}

function loadStoredAssignments(): ClaimRangeAssignment[] {
  const defaults = buildDefaultAssignments()
  if (typeof window === 'undefined') return defaults
  try {
    const raw = window.localStorage.getItem(WORK_ASSIGNMENTS_STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as ClaimRangeAssignment[]
    return Array.isArray(parsed) ? parsed : defaults
  } catch {
    return defaults
  }
}

function persistAssignments(assignments: ClaimRangeAssignment[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(WORK_ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments))
  } catch {
    /* storage may be unavailable */
  }
}

export function validateRanges(
  ranges: ClaimRangeAssignment[],
  claimCount: number,
): string | null {
  for (const range of ranges) {
    if (!range.analystId) return 'Each range must have an analyst assigned.'
    if (range.startClaim < 1 || range.endClaim > claimCount) {
      return `Claim range must be between 1 and ${claimCount}.`
    }
    if (range.startClaim > range.endClaim) {
      return 'Start claim must be less than or equal to end claim.'
    }
  }

  const sorted = [...ranges].sort((a, b) => a.startClaim - b.startClaim)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].startClaim <= sorted[i - 1].endClaim) {
      return 'Claim ranges cannot overlap.'
    }
  }

  return null
}

function findAnalystForClaimIndex(
  ranges: ClaimRangeAssignment[],
  packageId: string,
  claimIndex: number,
): string | null {
  const match = ranges.find(
    (range) =>
      range.packageId === packageId &&
      claimIndex >= range.startClaim &&
      claimIndex <= range.endClaim,
  )
  return match?.analystId ?? null
}

type WorkAssignmentContextValue = {
  hydrated: boolean
  getRangesForPackage: (packageId: string) => ClaimRangeAssignment[]
  setRangesForPackage: (packageId: string, ranges: ClaimRangeAssignment[], claimCount: number) => string | null
  getAnalystCohorts: (analystId: string) => RecoveryPackage[]
  getAnalystClaims: (pkg: RecoveryPackage, analystId: string) => ClusterClaim[]
  getClaimAnalystId: (packageId: string, claimIndex: number) => string | null
  getAssignedClaimCount: (packageId: string) => number
  packageHasAssignmentsForAnalyst: (packageId: string, analystId: string) => boolean
  getAllAssignedClaimIds: (pkg: RecoveryPackage) => string[]
}

const WorkAssignmentContext = createContext<WorkAssignmentContextValue | null>(null)

export function WorkAssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<ClaimRangeAssignment[]>(buildDefaultAssignments)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setAssignments(loadStoredAssignments())
    setHydrated(true)
  }, [])

  const getRangesForPackage = useCallback(
    (packageId: string) => assignments.filter((range) => range.packageId === packageId),
    [assignments],
  )

  const setRangesForPackage = useCallback(
    (packageId: string, ranges: ClaimRangeAssignment[], claimCount: number): string | null => {
      const error = validateRanges(ranges, claimCount)
      if (error) return error

      setAssignments((prev) => {
        const other = prev.filter((range) => range.packageId !== packageId)
        const next = [...other, ...ranges]
        persistAssignments(next)
        return next
      })
      return null
    },
    [],
  )

  const getClaimAnalystId = useCallback(
    (packageId: string, claimIndex: number) => findAnalystForClaimIndex(assignments, packageId, claimIndex),
    [assignments],
  )

  const getAnalystClaims = useCallback(
    (pkg: RecoveryPackage, analystId: string) =>
      pkg.claims.filter((_, index) => {
        const claimIndex = index + 1
        return findAnalystForClaimIndex(assignments, pkg.id, claimIndex) === analystId
      }),
    [assignments],
  )

  const packageHasAssignmentsForAnalyst = useCallback(
    (packageId: string, analystId: string) =>
      assignments.some((range) => range.packageId === packageId && range.analystId === analystId),
    [assignments],
  )

  const getAnalystCohorts = useCallback(
    (analystId: string) =>
      RECOVERY_PACKAGES.filter((pkg) => packageHasAssignmentsForAnalyst(pkg.id, analystId)),
    [packageHasAssignmentsForAnalyst],
  )

  const getAssignedClaimCount = useCallback(
    (packageId: string) =>
      getRangesForPackage(packageId).reduce(
        (sum, range) => sum + (range.endClaim - range.startClaim + 1),
        0,
      ),
    [getRangesForPackage],
  )

  const getAllAssignedClaimIds = useCallback(
    (pkg: RecoveryPackage) =>
      pkg.claims
        .filter((_, index) => Boolean(findAnalystForClaimIndex(assignments, pkg.id, index + 1)))
        .map((claim) => claim.id),
    [assignments],
  )

  const value = useMemo(
    () => ({
      hydrated,
      getRangesForPackage,
      setRangesForPackage,
      getAnalystCohorts,
      getAnalystClaims,
      getClaimAnalystId,
      getAssignedClaimCount,
      packageHasAssignmentsForAnalyst,
      getAllAssignedClaimIds,
    }),
    [
      hydrated,
      getRangesForPackage,
      setRangesForPackage,
      getAnalystCohorts,
      getAnalystClaims,
      getClaimAnalystId,
      getAssignedClaimCount,
      packageHasAssignmentsForAnalyst,
      getAllAssignedClaimIds,
    ],
  )

  return (
    <WorkAssignmentContext.Provider value={value}>{children}</WorkAssignmentContext.Provider>
  )
}

export function useWorkAssignment() {
  const ctx = useContext(WorkAssignmentContext)
  if (!ctx) throw new Error('useWorkAssignment must be used within WorkAssignmentProvider')
  return ctx
}

export function getAnalystNameForClaim(
  getClaimAnalystId: (packageId: string, claimIndex: number) => string | null,
  packageId: string,
  claimIndex: number,
): string {
  const analystId = getClaimAnalystId(packageId, claimIndex)
  if (!analystId) return 'Unassigned'
  return getAnalystById(analystId)?.name ?? 'Unassigned'
}
