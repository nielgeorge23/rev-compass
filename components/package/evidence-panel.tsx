import { BadgeCheck, FileText } from 'lucide-react'
import type { EvidenceCitation, RecoveryPackage } from '@/lib/revcompass/types'

export function EvidencePanel({ pkg }: { pkg: RecoveryPackage }) {
  return (
    <div className="evidence-panel-full">
      <div className="panel-title">
        <div>
          <span className="eyebrow">Recommendation</span>
          <h3>{pkg.dispositionLabel}</h3>
        </div>
      </div>
      <p className="detail-text">{pkg.confidenceRationale}</p>
      <div className="math-callout">
        <div className="math-icon">
          <BadgeCheck size={18} />
        </div>
        <div>
          <span>Expected value</span>
          <strong>{pkg.evMath}</strong>
          <small>Open exposure: {pkg.expectedRecovery} · Confidence: {pkg.confidence}%</small>
        </div>
      </div>
      {pkg.evidence.length > 0 ? (
        <div className="citation-list">
          {pkg.evidence.map((item: EvidenceCitation) => (
            <div key={item.id}>
              <FileText size={16} />
              <span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </span>
              <BadgeCheck size={15} />
            </div>
          ))}
        </div>
      ) : (
        <p className="detail-text muted-copy">No evidence spans retrieved above threshold.</p>
      )}
      {pkg.filingDays ? (
        <p className="filing-footnote">
          Timely filing: {pkg.filingDays} days remaining — urgency only; not used to form this cohort.
        </p>
      ) : null}
    </div>
  )
}
