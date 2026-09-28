import { DispositionBadge } from '@/components/ui/pill'
import { EhrSourceBadge, isEhrSourcedVariance } from '@/components/package/variance-source-notice'
import type { RecoveryPackage, VarianceType } from '@/lib/revcompass/types'

function varianceLabel(type: VarianceType) {
  const map: Record<VarianceType, string> = {
    denial: 'Denial',
    true_underpayment: 'Underpayment',
    contractual_adjustment: 'Contractual adj.',
    writeoff: 'Write-off',
  }
  return map[type]
}

type PackagesTableProps = {
  packages: RecoveryPackage[]
  selectedId: string | null
  needsManualReview?: (pkg: RecoveryPackage) => boolean
  onSelect: (id: string) => void
}

export function PackagesTable({
  packages,
  selectedId,
  needsManualReview,
  onSelect,
}: PackagesTableProps) {
  if (packages.length === 0) {
    return (
      <div className="packages-empty">
        <strong>You&apos;re caught up</strong>
        <p>No cohorts match the current filters.</p>
      </div>
    )
  }

  return (
    <div className="packages-table-wrap">
      <table className="packages-table">
        <thead>
          <tr>
            <th>Payer</th>
            <th>DRG / CPT</th>
            <th>Variance type</th>
            <th>Claims</th>
            <th>Exposure</th>
            <th>Action</th>
            <th>Confidence</th>
            <th aria-hidden />
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => {
            const manualReview = needsManualReview?.(pkg) ?? false
            return (
              <tr
                key={pkg.id}
                className={[
                  selectedId === pkg.id ? 'packages-table-row-active' : '',
                  manualReview ? 'packages-table-row-review' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onSelect(pkg.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSelect(pkg.id)
                }}
                tabIndex={0}
                role="button"
              >
                <td>
                  {pkg.payer.replace(' Commercial', '')}
                  {manualReview ? (
                    <span className="table-review-badge">Needs review</span>
                  ) : null}
                </td>
                <td className="mono-cell">{pkg.procedureCode}</td>
                <td>
                  <span className="variance-type-cell">
                    <span className="variance-type-pill">{varianceLabel(pkg.varianceType)}</span>
                    {isEhrSourcedVariance(pkg.varianceType) ? <EhrSourceBadge /> : null}
                  </span>
                </td>
                <td>
                  {pkg.claimCount}
                  {pkg.urgentClaimCount ? (
                    <span className="urgent-dot"> · {pkg.urgentClaimCount} urgent</span>
                  ) : null}
                </td>
                <td className="mono-cell">{pkg.exposure}</td>
                <td><DispositionBadge label={pkg.dispositionLabel} /></td>
                <td>
                  <div className="table-conf">
                    <div className="bar"><i style={{ width: `${pkg.confidence}%` }} /></div>
                    <span className={manualReview ? 'conf-low' : ''}>{pkg.confidence}%</span>
                  </div>
                </td>
                <td className="table-arrow">→</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export { varianceLabel }
