'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { Clock3, LayoutDashboard, Sparkles, X } from 'lucide-react'
import { ClaimResolutionSummaryPanel } from '@/components/package/claim-resolution-summary'
import { ClaimsTable } from '@/components/package/claims-table'
import { ConfidenceBreakdownPanel } from '@/components/package/confidence-breakdown'
import { EvidencePanel } from '@/components/package/evidence-panel'
import {
  DirectorPackagesTable,
  filterPackagesForDirector,
  type DirectorMonitorFilter,
  varianceLabel,
} from '@/components/package/director-packages-table'
import { PreventTicketPanel } from '@/components/package/prevent-ticket-panel'
import { RootCausePanel } from '@/components/package/root-cause-panel'
import { VarianceSourceNotice } from '@/components/package/variance-source-notice'
import { Metric } from '@/components/ui/metric'
import { Pill } from '@/components/ui/pill'
import { formatManagerLabel } from '@/lib/revcompass/managers'
import { useClaimResolution } from '@/lib/claim-resolution-context'
import { useOwnerAssignment } from '@/lib/owner-assignment-context'
import { useWorkAssignment } from '@/lib/work-assignment-context'
import { OPEN_EXPOSURE_TOTAL, RECOVERY_PACKAGES } from '@/lib/revcompass/packages'
import type { PackageManager, RecoveryPackage } from '@/lib/revcompass/types'

type DirectorDashboardViewProps = {
  initialPackageId?: string | null
  onToast?: (message: string) => void
}

function countPendingApproval() {
  return RECOVERY_PACKAGES.filter((pkg) => pkg.approvalStatus === 'pending').length
}

function countStale() {
  return RECOVERY_PACKAGES.filter((pkg) => pkg.daysPending > 7).length
}

function countOverdue() {
  return RECOVERY_PACKAGES.filter((pkg) => pkg.pastTargetDeadline).length
}

export function DirectorDashboardView({ initialPackageId, onToast }: DirectorDashboardViewProps) {
  const { assignOwner, getAssignedOwner } = useOwnerAssignment()
  const { getAllAssignedClaimIds, getAssignedClaimCount } = useWorkAssignment()
  const { getSummaryForClaimIds, getGlobalAssignedSummary } = useClaimResolution()
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    initialPackageId ?? RECOVERY_PACKAGES[0].id,
  )
  const [monitorFilter, setMonitorFilter] = useState<DirectorMonitorFilter>('all')

  useEffect(() => {
    if (initialPackageId) setSelectedPackageId(initialPackageId)
  }, [initialPackageId])

  const filteredPackages = useMemo(
    () => filterPackagesForDirector(RECOVERY_PACKAGES, monitorFilter),
    [monitorFilter],
  )

  const selectedPackage = RECOVERY_PACKAGES.find((p) => p.id === selectedPackageId) ?? null
  const assignedOwner = selectedPackage ? getAssignedOwner(selectedPackage) : null

  const globalResolutionSummary = useMemo(
    () => getGlobalAssignedSummary(RECOVERY_PACKAGES, getAllAssignedClaimIds),
    [getGlobalAssignedSummary, getAllAssignedClaimIds],
  )

  const selectedPackageResolutionSummary = useMemo(() => {
    if (!selectedPackage) return null
    const claimIds = getAllAssignedClaimIds(selectedPackage)
    if (claimIds.length === 0) return null
    return getSummaryForClaimIds(selectedPackage.id, claimIds)
  }, [selectedPackage, getAllAssignedClaimIds, getSummaryForClaimIds])

  const getClaimResolutionSummary = useCallback(
    (pkg: RecoveryPackage) => {
      const claimIds = getAllAssignedClaimIds(pkg)
      return getSummaryForClaimIds(pkg.id, claimIds)
    },
    [getAllAssignedClaimIds, getSummaryForClaimIds],
  )

  function handleAssignOwner(pkg: RecoveryPackage, manager: PackageManager) {
    assignOwner(pkg.id, manager.id)
    onToast?.(`Cohort ${pkg.code} assigned to ${formatManagerLabel(manager)}.`)
  }

  const monitorCards: {
    id: DirectorMonitorFilter
    label: string
    value: string
    note: string
    accent: string
  }[] = [
    {
      id: 'pending_approval',
      label: 'Pending human approval',
      value: String(countPendingApproval()),
      note: 'Awaiting manager human gate',
      accent: 'var(--orange)',
    },
    {
      id: 'stale',
      label: 'Pending > 7 days',
      value: String(countStale()),
      note: 'In queue without resolution',
      accent: 'var(--ink)',
    },
    {
      id: 'overdue',
      label: 'Past target deadline',
      value: String(countOverdue()),
      note: 'SLA breach — needs escalation',
      accent: 'var(--primary)',
    },
    {
      id: 'all',
      label: 'Open exposure',
      value: OPEN_EXPOSURE_TOTAL,
      note: `${RECOVERY_PACKAGES.length} active cohorts`,
      accent: 'var(--ink)',
    },
  ]

  return (
    <>
      <section className="hero-row">
        <div>
          <div className="eyebrow">
            <LayoutDashboard size={14} /> Director dashboard
          </div>
          <h1>
            Executive <em>monitoring</em> and ownership.
          </h1>
          <p className="hero-copy">
            Assign cohorts to functional managers, monitor approval backlog, and flag cohorts that
            have exceeded target timelines. Managers assign work to analysts; approval actions remain at the human gate.
          </p>
        </div>
        <div className="hero-actions">
          <div className="live-status">
            <span className="live-dot" /> Read-only actions · Assign owners enabled
          </div>
        </div>
      </section>

      <section className="metric-grid director-monitoring-grid">
        {monitorCards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`director-metric-btn ${monitorFilter === card.id ? 'director-metric-btn-active' : ''}`}
            onClick={() => setMonitorFilter(card.id)}
          >
            <Metric
              label={card.label}
              value={card.value}
              note={card.note}
              accent={card.accent}
            />
          </button>
        ))}
      </section>

      <ClaimResolutionSummaryPanel
        summary={globalResolutionSummary}
        title="Organization-wide claim resolution"
      />

      <VarianceSourceNotice />

      <div className="section-heading">
        <div>
          <span className="eyebrow">Ownership worklist</span>
          <h2>Resolution cohorts</h2>
        </div>
        {monitorFilter !== 'all' ? (
          <button
            type="button"
            className="filter active"
            onClick={() => setMonitorFilter('all')}
          >
            Clear filter
          </button>
        ) : null}
      </div>

      <DirectorPackagesTable
        packages={filteredPackages}
        selectedId={selectedPackageId}
        getAssignedOwner={getAssignedOwner}
        getClaimResolutionSummary={getClaimResolutionSummary}
        onAssignOwner={handleAssignOwner}
        onSelect={setSelectedPackageId}
      />

      {selectedPackage && assignedOwner ? (
        <section className="detail-shell">
          <div className="detail-head">
            <div>
              <div className="package-meta">
                <Pill tone="slate">READ-ONLY</Pill>
                <span>{selectedPackage.code}</span>
                <span>•</span>
                <span>{varianceLabel(selectedPackage.varianceType)}</span>
                <span>•</span>
                <span>Owner: {assignedOwner.name}</span>
              </div>
              <h2>{selectedPackage.title}</h2>
              <p>
                {selectedPackage.claimCount} claims · {selectedPackage.payer} ·{' '}
                {selectedPackage.daysPending} days in queue
                {selectedPackage.pastTargetDeadline ? ' · Past target deadline' : ''}
              </p>
            </div>
            <div className="detail-head-right">
              <div className="deadline">
                <Clock3 size={16} />
                <span>Filing window</span>
                <strong>{selectedPackage.filingDays} days left</strong>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close detail"
                onClick={() => setSelectedPackageId(null)}
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <section className="cluster-metrics">
            {selectedPackage.clusterMetrics.map((metric) => (
              <div className="cluster-metric" key={metric.label}>
                <span className="cluster-metric-label">{metric.label}</span>
                <strong>{metric.value}</strong>
                <span className="cluster-metric-note">{metric.note}</span>
              </div>
            ))}
          </section>

          {selectedPackage.disposition === 'prevent' ? (
            <>
              <RootCausePanel pkg={selectedPackage} />
              {selectedPackage.preventTicket ? (
                <PreventTicketPanel ticket={selectedPackage.preventTicket} />
              ) : null}
            </>
          ) : (
            <div className="detail-grid detail-grid-wide">
              <div className="detail-stack">
                <RootCausePanel pkg={selectedPackage} />
                <EvidencePanel pkg={selectedPackage} />
              </div>
              <div className="detail-stack">
                <ConfidenceBreakdownPanel
                  confidence={selectedPackage.confidence}
                  breakdown={selectedPackage.confidenceBreakdown}
                />
                <div className="detail-panel director-owner-panel">
                  <span className="eyebrow">Assigned owner</span>
                  <h3>{assignedOwner.name}</h3>
                  <p className="detail-text">{assignedOwner.title}</p>
                  <p className="detail-text muted-copy">
                    <Sparkles size={12} />                     Use the table above to reassign this cohort to any functional manager.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedPackageResolutionSummary ? (
            <ClaimResolutionSummaryPanel
              summary={selectedPackageResolutionSummary}
              title="Claim resolution in this cohort"
            />
          ) : null}

          <ClaimsTable
            pkg={selectedPackage}
            showProgressColumn={getAssignedClaimCount(selectedPackage.id) > 0}
            showOnlyAssignedClaims={getAssignedClaimCount(selectedPackage.id) > 0}
          />
        </section>
      ) : null}
    </>
  )
}
