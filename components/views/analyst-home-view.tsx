'use client'

import { useMemo } from 'react'
import { ArrowRight, Inbox } from 'lucide-react'
import { useDemoRole } from '@/lib/demo-role-context'
import { useWorkAssignment } from '@/lib/work-assignment-context'
import type { View } from '@/lib/navigation'
import type { ClusterClaim, RecoveryPackage, WorklistSegment } from '@/lib/revcompass/types'

type AnalystHomeViewProps = {
  onNavigate: (view: View, params?: { packageId?: string; segment?: WorklistSegment }) => void
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

type AssignedClaimRow = {
  pkg: RecoveryPackage
  claim: ClusterClaim
  claimIndex: number
}

export function AnalystHomeView({ onNavigate }: AnalystHomeViewProps) {
  const { user } = useDemoRole()
  const { getAnalystCohorts, getAnalystClaims } = useWorkAssignment()
  const analystId = user?.analystId ?? ''

  const assignedCohorts = useMemo(
    () => (analystId ? getAnalystCohorts(analystId) : []),
    [analystId, getAnalystCohorts],
  )

  const assignedClaims = useMemo(() => {
    if (!analystId) return [] as AssignedClaimRow[]
    const rows: AssignedClaimRow[] = []
    for (const pkg of assignedCohorts) {
      const claims = getAnalystClaims(pkg, analystId)
      claims.forEach((claim) => {
        const claimIndex = pkg.claims.findIndex((c) => c.id === claim.id) + 1
        rows.push({ pkg, claim, claimIndex })
      })
    }
    return rows
  }, [analystId, assignedCohorts, getAnalystClaims])

  const itemCount = assignedClaims.length

  return (
    <div className="analyst-home">
      <section className="analyst-home-greeting">
        <h1>
          {getGreeting()}!
        </h1>
        <p>
          You have <strong>{itemCount}</strong> new item{itemCount === 1 ? '' : 's'} assigned to your
          worklist.
        </p>
      </section>

      <section className="analyst-assigned-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Your cohorts</span>
            <h2>Assigned packages</h2>
          </div>
        </div>

        {assignedCohorts.length === 0 ? (
          <div className="analyst-empty-state">
            <Inbox size={28} />
            <p>No cohort assignments yet — your manager will route packages to you.</p>
          </div>
        ) : (
          <div className="packages-table-wrap analyst-assigned-table">
            <div className="packages-table-head analyst-assigned-head">
              <span>Cohort</span>
              <span>Payer</span>
              <span>Your claims</span>
              <span>Exposure</span>
              <span>Action</span>
            </div>
            {assignedCohorts.map((pkg) => {
              const claimCount = analystId ? getAnalystClaims(pkg, analystId).length : 0
              return (
                <div className="packages-table-row analyst-assigned-row" key={pkg.id}>
                  <span className="packages-table-code">{pkg.code}</span>
                  <span>{pkg.payer}</span>
                  <span>{claimCount}</span>
                  <span>{pkg.exposure}</span>
                  <span>
                    <button
                      type="button"
                      className="analyst-open-link"
                      onClick={() => onNavigate('packages', { packageId: pkg.id, segment: 'mine' })}
                    >
                      Open <ArrowRight size={14} />
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="analyst-claims-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Claim-level work</span>
            <h2>Individual claims assigned to you</h2>
          </div>
        </div>

        {assignedClaims.length === 0 ? (
          <div className="analyst-empty-state">
            <Inbox size={28} />
            <p>No claim assignments yet — your manager will route claims to you.</p>
          </div>
        ) : (
          <div className="claims-table analyst-claims-table">
            <div className="claims-table-head analyst-claims-head">
              <span>Cohort</span>
              <span>Claim ID</span>
              <span>Account</span>
              <span>Service date</span>
              <span>DRG</span>
              <span>Billed</span>
              <span>Paid</span>
              <span>Variance</span>
              <span>Status</span>
            </div>
            {assignedClaims.map(({ pkg, claim }) => (
              <div className="claims-table-row" key={`${pkg.id}-${claim.id}`}>
                <span>{pkg.code}</span>
                <span>
                  <button
                    type="button"
                    className="claims-drilldown-link"
                    onClick={() => onNavigate('packages', { packageId: pkg.id, segment: 'mine' })}
                  >
                    {claim.id}
                  </button>
                </span>
                <span>{claim.account}</span>
                <span>{claim.serviceDate}</span>
                <span>{claim.drg}</span>
                <span>{claim.billed}</span>
                <span>{claim.paid}</span>
                <span className="claims-variance">{claim.variance}</span>
                <span
                  className={`claims-status claims-status-${claim.status.toLowerCase().replace(' ', '-')}`}
                >
                  {claim.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
