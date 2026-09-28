'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { AnalystAssignSelect } from '@/components/package/analyst-assign-select'
import { getAnalystById } from '@/lib/revcompass/analysts'
import { useWorkAssignment } from '@/lib/work-assignment-context'
import type { ClaimRangeAssignment, RecoveryPackage } from '@/lib/revcompass/types'

type ClaimDistributionPanelProps = {
  pkg: RecoveryPackage
  onToast?: (message: string) => void
}

type DraftRange = {
  id: string
  startClaim: string
  endClaim: string
  analystId: string
}

function toDraftRanges(ranges: ClaimRangeAssignment[]): DraftRange[] {
  return ranges.map((range) => ({
    id: range.id,
    startClaim: String(range.startClaim),
    endClaim: String(range.endClaim),
    analystId: range.analystId,
  }))
}

function toClaimRanges(drafts: DraftRange[], packageId: string): ClaimRangeAssignment[] {
  return drafts
    .filter((draft) => draft.analystId && draft.startClaim && draft.endClaim)
    .map((draft) => ({
      id: draft.id,
      packageId,
      analystId: draft.analystId,
      startClaim: Number(draft.startClaim),
      endClaim: Number(draft.endClaim),
    }))
}

function getNextClaimStart(drafts: DraftRange[], assignedCount: number): number {
  const maxFromDrafts = drafts.reduce((max, draft) => {
    const end = Number(draft.endClaim)
    return Number.isFinite(end) ? Math.max(max, end) : max
  }, 0)
  return Math.max(assignedCount, maxFromDrafts) + 1
}

export function ClaimDistributionPanel({ pkg, onToast }: ClaimDistributionPanelProps) {
  const { getRangesForPackage, setRangesForPackage, getAssignedClaimCount } = useWorkAssignment()
  const [drafts, setDrafts] = useState<DraftRange[]>(() => toDraftRanges(getRangesForPackage(pkg.id)))
  const [error, setError] = useState<string | null>(null)

  // Load persisted ranges only when switching cohorts — not after each save.
  useEffect(() => {
    setDrafts(toDraftRanges(getRangesForPackage(pkg.id)))
    setError(null)
  }, [pkg.id])

  const assignedCount = getAssignedClaimCount(pkg.id)
  const unassignedCount = pkg.claimCount - assignedCount

  const barSegments = useMemo(() => {
    const ranges = toClaimRanges(drafts, pkg.id)
    return ranges.map((range) => {
      const analyst = getAnalystById(range.analystId)
      const width = ((range.endClaim - range.startClaim + 1) / pkg.claimCount) * 100
      return {
        id: range.id,
        label: analyst?.initials ?? '?',
        name: analyst?.name ?? 'Unassigned',
        width,
      }
    })
  }, [drafts, pkg.claimCount, pkg.id])

  function persistCompleteRanges(nextDrafts: DraftRange[], toastMessage?: string) {
    setDrafts(nextDrafts)
    const ranges = toClaimRanges(nextDrafts, pkg.id)

    if (ranges.length === 0) {
      const validationError = setRangesForPackage(pkg.id, [], pkg.claimCount)
      setError(validationError)
      return
    }

    const validationError = setRangesForPackage(pkg.id, ranges, pkg.claimCount)
    setError(validationError)
    if (!validationError && toastMessage) {
      onToast?.(toastMessage)
    }
  }

  function updateDraft(id: string, patch: Partial<DraftRange>) {
    const next = drafts.map((draft) => (draft.id === id ? { ...draft, ...patch } : draft))
    const updated = next.find((draft) => draft.id === id)
    let toastMessage: string | undefined
    if (patch.analystId && updated?.analystId) {
      const analyst = getAnalystById(patch.analystId)
      toastMessage = `Claims ${updated.startClaim}–${updated.endClaim} assigned to ${analyst?.name ?? 'analyst'}.`
    }

    const hasCompleteRange = next.some((draft) => draft.analystId && draft.startClaim && draft.endClaim)
    if (hasCompleteRange || next.length === 0) {
      persistCompleteRanges(next, toastMessage)
    } else {
      setDrafts(next)
      setError(null)
    }
  }

  function addRange() {
    const nextStart = getNextClaimStart(drafts, assignedCount)
    if (nextStart > pkg.claimCount) return

    setDrafts([
      ...drafts,
      {
        id: `range-${pkg.id}-${Date.now()}`,
        startClaim: String(nextStart),
        endClaim: String(Math.min(nextStart + 9, pkg.claimCount)),
        analystId: '',
      },
    ])
    setError(null)
  }

  function removeRange(id: string) {
    persistCompleteRanges(drafts.filter((draft) => draft.id !== id))
  }

  const canAddRange = getNextClaimStart(drafts, assignedCount) <= pkg.claimCount

  return (
    <section className="claim-distribution-panel">
      <div className="claim-distribution-head">
        <div>
          <span className="eyebrow">Work assignment</span>
          <h3>Distribute work to analysts</h3>
        </div>
        <p className="claim-distribution-summary">
          {pkg.claimCount} claims in cluster · <strong>{assignedCount} assigned</strong>
          {unassignedCount > 0 ? ` · ${unassignedCount} unassigned` : ''}
        </p>
      </div>

      <div className="claim-range-table">
        <div className="claim-range-table-head">
          <span>Claims</span>
          <span>Assigned to</span>
          <span aria-hidden />
        </div>
        {drafts.length === 0 ? (
          <div className="claim-range-empty">
            No claim ranges assigned yet. Add a range to route work to an analyst.
          </div>
        ) : (
          drafts.map((draft) => (
            <div className="claim-range-row" key={draft.id}>
              <div className="claim-range-inputs">
                <input
                  type="number"
                  className="claim-range-input"
                  min={1}
                  max={pkg.claimCount}
                  value={draft.startClaim}
                  onChange={(e) => updateDraft(draft.id, { startClaim: e.target.value })}
                  aria-label="Start claim"
                />
                <span className="claim-range-sep">–</span>
                <input
                  type="number"
                  className="claim-range-input"
                  min={1}
                  max={pkg.claimCount}
                  value={draft.endClaim}
                  onChange={(e) => updateDraft(draft.id, { endClaim: e.target.value })}
                  aria-label="End claim"
                />
              </div>
              <AnalystAssignSelect
                value={draft.analystId}
                onChange={(analystId) => updateDraft(draft.id, { analystId })}
              />
              <button
                type="button"
                className="icon-button claim-range-remove"
                aria-label="Remove range"
                onClick={() => removeRange(draft.id)}
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {error ? <p className="claim-distribution-error" role="alert">{error}</p> : null}

      <div className="claim-distribution-actions">
        <button type="button" className="secondary-button" onClick={addRange} disabled={!canAddRange}>
          <Plus size={14} /> Add range
        </button>
      </div>

      {barSegments.length > 0 ? (
        <div className="claim-range-bar" aria-hidden>
          {barSegments.map((segment, index) => (
            <div
              key={segment.id}
              className={`claim-range-bar-segment claim-range-bar-segment-${index % 2}`}
              style={{ width: `${segment.width}%` }}
              title={`${segment.name}`}
            >
              {segment.label}
            </div>
          ))}
          {unassignedCount > 0 ? (
            <div
              className="claim-range-bar-segment claim-range-bar-unassigned"
              style={{ width: `${(unassignedCount / pkg.claimCount) * 100}%` }}
              title="Unassigned"
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
