'use client'

import { DispositionBadge } from '@/components/ui/pill'
import { OwnerAssignSelect } from '@/components/package/owner-assign-select'
import { varianceLabel } from '@/components/package/packages-table'
import type { ClaimResolutionSummary, PackageManager, RecoveryPackage } from '@/lib/revcompass/types'

export type DirectorMonitorFilter = 'all' | 'pending_approval' | 'stale' | 'overdue'

type DirectorPackagesTableProps = {
  packages: RecoveryPackage[]
  selectedId: string | null
  getAssignedOwner: (pkg: RecoveryPackage) => PackageManager
  getClaimResolutionSummary?: (pkg: RecoveryPackage) => ClaimResolutionSummary
  onAssignOwner: (pkg: RecoveryPackage, manager: PackageManager) => void
  onSelect: (id: string) => void
}

function statusFlags(pkg: RecoveryPackage) {
  const flags: { label: string; tone: 'pending' | 'stale' | 'overdue' }[] = []
  if (pkg.approvalStatus === 'pending') {
    flags.push({ label: 'Pending approval', tone: 'pending' })
  }
  if (pkg.pastTargetDeadline) {
    flags.push({ label: 'Past target deadline', tone: 'overdue' })
  }
  if (pkg.daysPending > 7) {
    flags.push({ label: `${pkg.daysPending}d in queue`, tone: 'stale' })
  }
  return flags
}

export function DirectorPackagesTable({
  packages,
  selectedId,
  getAssignedOwner,
  getClaimResolutionSummary,
  onAssignOwner,
  onSelect,
}: DirectorPackagesTableProps) {
  if (packages.length === 0) {
    return (
      <div className="packages-empty">
        <strong>No cohorts match</strong>
        <p>Try clearing the monitoring filter above.</p>
      </div>
    )
  }

  return (
    <div className="packages-table-wrap director-table-wrap">
      <table className="packages-table director-packages-table">
        <thead>
          <tr>
            <th>Payer</th>
            <th>DRG / CPT</th>
            <th>Exposure</th>
            <th>Action</th>
            <th>Owner</th>
            <th>Assign to</th>
            <th>Claim progress</th>
            <th>Status</th>
            <th aria-hidden />
          </tr>
        </thead>
        <tbody>
          {packages.map((pkg) => {
            const owner = getAssignedOwner(pkg)
            const flags = statusFlags(pkg)
            const resolution = getClaimResolutionSummary?.(pkg)
            return (
              <tr
                key={pkg.id}
                className={[
                  selectedId === pkg.id ? 'packages-table-row-active' : '',
                  pkg.pastTargetDeadline ? 'packages-table-row-review' : '',
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
                <td>{pkg.payer.replace(' Commercial', '')}</td>
                <td className="mono-cell">{pkg.procedureCode}</td>
                <td className="mono-cell">{pkg.exposure}</td>
                <td><DispositionBadge label={pkg.dispositionLabel} /></td>
                <td className="director-owner-cell">
                  <strong>{owner.name}</strong>
                  <span>{owner.title}</span>
                </td>
                <td className="director-assign-cell" onClick={(e) => e.stopPropagation()}>
                  <OwnerAssignSelect
                    pkg={pkg}
                    value={owner}
                    onChange={(manager) => onAssignOwner(pkg, manager)}
                  />
                </td>
                <td className="director-progress-cell">
                  {resolution && resolution.total > 0 ? (
                    <span className="director-progress-value">{resolution.percentResolved}%</span>
                  ) : (
                    <span className="director-progress-empty">—</span>
                  )}
                </td>
                <td className="director-status-cell">
                  <div className="director-status-flags">
                    {flags.map((flag) => (
                      <span
                        key={flag.label}
                        className={`director-status-flag director-status-flag-${flag.tone}`}
                      >
                        {flag.label}
                      </span>
                    ))}
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

export function filterPackagesForDirector(
  packages: RecoveryPackage[],
  filter: DirectorMonitorFilter,
): RecoveryPackage[] {
  if (filter === 'pending_approval') {
    return packages.filter((pkg) => pkg.approvalStatus === 'pending')
  }
  if (filter === 'stale') {
    return packages.filter((pkg) => pkg.daysPending > 7)
  }
  if (filter === 'overdue') {
    return packages.filter((pkg) => pkg.pastTargetDeadline)
  }
  return packages
}

export { varianceLabel }
