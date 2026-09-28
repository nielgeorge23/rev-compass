'use client'

import type { ClaimResolutionSummary } from '@/lib/revcompass/types'

type ClaimResolutionSummaryPanelProps = {
  summary: ClaimResolutionSummary
  title?: string
}

export function ClaimResolutionSummaryPanel({
  summary,
  title = 'Claim resolution progress',
}: ClaimResolutionSummaryPanelProps) {
  if (summary.total === 0) {
    return (
      <section className="claim-resolution-summary claim-resolution-summary-empty">
        <span className="eyebrow">Analyst progress</span>
        <h3>{title}</h3>
        <p>No claims assigned yet — progress will appear after manager distribution.</p>
      </section>
    )
  }

  return (
    <section className="claim-resolution-summary">
      <div className="claim-resolution-summary-head">
        <div>
          <span className="eyebrow">Analyst progress</span>
          <h3>{title}</h3>
        </div>
        <strong>{summary.percentResolved}% resolved</strong>
      </div>
      <div className="claim-resolution-summary-bar" aria-hidden>
        <div
          className="claim-resolution-summary-bar-resolved"
          style={{ width: `${summary.percentResolved}%` }}
        />
      </div>
      <p className="claim-resolution-summary-stats">
        <span>{summary.resolved} resolved</span>
        <span>·</span>
        <span>{summary.inProgress} in progress</span>
        <span>·</span>
        <span>{summary.notStarted} not started</span>
        <span>·</span>
        <span>{summary.total} assigned claims</span>
      </p>
    </section>
  )
}
