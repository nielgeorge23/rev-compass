import { Database } from 'lucide-react'

type VarianceSourceNoticeProps = {
  compact?: boolean
}

export function VarianceSourceNotice({ compact = false }: VarianceSourceNoticeProps) {
  return (
    <div className={`variance-source-notice ${compact ? 'variance-source-notice-compact' : ''}`}>
      <Database size={compact ? 14 : 16} aria-hidden />
      <div>
        <strong>Variance flags sourced from Epic / EHR</strong>
        <p>
          Denial and underpayment flags are pulled from your EHR work queues — not calculated or
          inferred by RevCompass. A single claim may belong to multiple cohorts when more than one
          variance issue exists on that claim.
        </p>
      </div>
    </div>
  )
}

export function EhrSourceBadge() {
  return <span className="ehr-source-badge">Epic / EHR</span>
}

export function isEhrSourcedVariance(varianceType: string) {
  return varianceType === 'denial' || varianceType === 'true_underpayment'
}
