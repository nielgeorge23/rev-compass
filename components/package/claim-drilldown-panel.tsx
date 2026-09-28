import { X } from 'lucide-react'
import { EhrSourceBadge } from '@/components/package/variance-source-notice'
import type { ClusterClaim, RecoveryPackage } from '@/lib/revcompass/types'

type ClaimDrilldownPanelProps = {
  pkg: RecoveryPackage
  claim: ClusterClaim
  onClose: () => void
}

export function ClaimDrilldownPanel({ pkg, claim, onClose }: ClaimDrilldownPanelProps) {
  const reasonCode =
    pkg.engine === 'fingerprint' ? 'CO-50' : pkg.engine === 'contract_variance' ? 'Contract rate' : 'DRG downgrade'
  const recommendedAction = (() => {
    if (pkg.disposition === 'prevent') return 'Address via prevention ticket — internal root cause'
    if (pkg.disposition === 'write_off') return 'Included in cohort write-off recommendation'
    if (claim.status === 'Denied') return `Include in cohort ${pkg.dispositionLabel.toLowerCase()}`
    if (claim.status === 'Underpaid') {
      return pkg.disposition === 'escalate' ? 'Include in payer escalation' : 'Include in resolution cohort'
    }
    return 'Pending analyst review'
  })()

  return (
    <div className="claim-drilldown">
      <div className="claim-drilldown-head">
        <div>
          <span className="eyebrow">Claim drilldown</span>
          <h4>{claim.id}</h4>
        </div>
        <button type="button" className="icon-button" aria-label="Close claim drilldown" onClick={onClose}>
          <X size={17} />
        </button>
      </div>
      <div className="claim-drilldown-grid">
        <div>
          <span className="claim-drilldown-label">Account</span>
          <strong>{claim.account}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Service date</span>
          <strong>{claim.serviceDate}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">DRG</span>
          <strong>{claim.drg}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Status</span>
          <strong className="claim-status-with-source">
            {claim.status}
            {claim.status === 'Denied' || claim.status === 'Underpaid' ? <EhrSourceBadge /> : null}
          </strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Billed</span>
          <strong>{claim.billed}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Paid</span>
          <strong>{claim.paid}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Variance</span>
          <strong className="claims-variance">{claim.variance}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Reason</span>
          <strong>{reasonCode}</strong>
        </div>
      </div>
      <p className="claim-drilldown-note">
        <strong>Cohort:</strong> {pkg.code} · {pkg.payer} · {pkg.facility}
      </p>
      <p className="claim-drilldown-note">
        <strong>Recommended action:</strong> {recommendedAction}
      </p>
    </div>
  )
}

type AccountDrilldownPanelProps = {
  pkg: RecoveryPackage
  account: string
  claims: ClusterClaim[]
  onClose: () => void
  onSelectClaim: (claim: ClusterClaim) => void
}

export function AccountDrilldownPanel({
  pkg,
  account,
  claims,
  onClose,
  onSelectClaim,
}: AccountDrilldownPanelProps) {
  const totalVariance = claims.reduce((sum, c) => sum + (Number(c.variance.replace(/[^0-9.-]/g, '')) || 0), 0)
  const formattedTotal = `$${totalVariance.toLocaleString()}`

  return (
    <div className="claim-drilldown claim-drilldown-account">
      <div className="claim-drilldown-head">
        <div>
          <span className="eyebrow">Account drilldown</span>
          <h4>{account}</h4>
        </div>
        <button type="button" className="icon-button" aria-label="Close account drilldown" onClick={onClose}>
          <X size={17} />
        </button>
      </div>
      <div className="claim-drilldown-grid">
        <div>
          <span className="claim-drilldown-label">Claims in cluster</span>
          <strong>{claims.length}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Total variance</span>
          <strong className="claims-variance">{formattedTotal}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Payer</span>
          <strong>{pkg.payer}</strong>
        </div>
        <div>
          <span className="claim-drilldown-label">Facility</span>
          <strong>{pkg.facility}</strong>
        </div>
      </div>
      <div className="account-claim-list">
        <span className="claim-drilldown-label">Episodes in this cohort</span>
        {claims.map((claim) => (
          <button
            key={claim.id}
            type="button"
            className="account-claim-link"
            onClick={() => onSelectClaim(claim)}
          >
            <span>{claim.id}</span>
            <span>{claim.serviceDate}</span>
            <span className="claims-variance">{claim.variance}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
