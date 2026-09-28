import type { ClaimResolutionStatus, ClaimResolutionSummary } from '@/lib/revcompass/types'

export const CLAIM_RESOLUTION_OPTIONS: { value: ClaimResolutionStatus; label: string }[] = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_review', label: 'In review' },
  { value: 'pending_documentation', label: 'Pending documentation' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'resolved', label: 'Resolved' },
]

export function getResolutionLabel(status: ClaimResolutionStatus): string {
  return CLAIM_RESOLUTION_OPTIONS.find((option) => option.value === status)?.label ?? 'Not started'
}

export function isInProgressResolution(status: ClaimResolutionStatus): boolean {
  return status === 'in_review' || status === 'pending_documentation' || status === 'escalated'
}

export function mergeResolutionSummaries(
  summaries: ClaimResolutionSummary[],
): ClaimResolutionSummary {
  const total = summaries.reduce((sum, item) => sum + item.total, 0)
  if (total === 0) {
    return { total: 0, resolved: 0, inProgress: 0, notStarted: 0, percentResolved: 0 }
  }
  const resolved = summaries.reduce((sum, item) => sum + item.resolved, 0)
  const inProgress = summaries.reduce((sum, item) => sum + item.inProgress, 0)
  const notStarted = summaries.reduce((sum, item) => sum + item.notStarted, 0)
  return {
    total,
    resolved,
    inProgress,
    notStarted,
    percentResolved: Math.round((resolved / total) * 100),
  }
}
