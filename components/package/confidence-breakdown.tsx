import type { ConfidenceBreakdown } from '@/lib/revcompass/types'

export function ConfidenceBreakdownPanel({
  confidence,
  breakdown,
}: {
  confidence: number
  breakdown: ConfidenceBreakdown
}) {
  const bucket = confidence >= 75 ? 'High' : confidence >= 50 ? 'Medium' : 'Low'

  return (
    <div className="detail-panel">
      <span className="eyebrow">Confidence</span>
      <h3>{confidence}% — {bucket}</h3>
      <div className="conf-breakdown">
        {(
          [
            ['Evidence strength', breakdown.evidence],
            ['Cluster cohesion', breakdown.cohesion],
            ['Outcome reliability', breakdown.reliability],
          ] as const
        ).map(([label, value]) => (
          <div className="conf-breakdown-item" key={label}>
            <div className="conf-breakdown-top">
              <span>{label}</span>
              <b>{value}</b>
            </div>
            <div className="conf-breakdown-track">
              <i style={{ width: `${Math.round(value * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
