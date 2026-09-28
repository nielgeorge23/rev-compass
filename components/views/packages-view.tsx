'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Clock3, Sparkles, X } from 'lucide-react'
import { ClaimDistributionPanel } from '@/components/package/claim-distribution-panel'
import { ClaimResolutionSummaryPanel } from '@/components/package/claim-resolution-summary'
import { ClaimsTable } from '@/components/package/claims-table'
import { ConfidenceBreakdownPanel } from '@/components/package/confidence-breakdown'
import { EvidencePanel } from '@/components/package/evidence-panel'
import { PackagesTable, varianceLabel } from '@/components/package/packages-table'
import { PreventTicketPanel } from '@/components/package/prevent-ticket-panel'
import { RootCausePanel } from '@/components/package/root-cause-panel'
import { VarianceSourceNotice } from '@/components/package/variance-source-notice'
import { HumanGatePanel } from '@/components/pipeline/human-gate-panel'
import { Metric } from '@/components/ui/metric'
import { Pill } from '@/components/ui/pill'
import { useClaimResolution } from '@/lib/claim-resolution-context'
import { useCohortReview } from '@/lib/cohort-review-context'
import { useDemoRole } from '@/lib/demo-role-context'
import { useEngagementConfig } from '@/lib/engagement-config-context'
import { useOwnerAssignment } from '@/lib/owner-assignment-context'
import { useWorkAssignment } from '@/lib/work-assignment-context'
import { OPEN_EXPOSURE_TOTAL, RECOVERY_PACKAGES } from '@/lib/revcompass/packages'
import type { RecoveryPackage, VarianceType, WorklistSegment } from '@/lib/revcompass/types'

type PackagesViewProps = {
  initialPackageId?: string | null
  initialSegment?: WorklistSegment
  onToast?: (message: string) => void
  variant?: 'default' | 'analyst' | 'manager'
}

type ConfidenceFilter = 'any' | 'high' | 'medium' | 'low'

function matchesConfidence(confidence: number, filter: ConfidenceFilter) {
  if (filter === 'any') return true
  if (filter === 'high') return confidence >= 75
  if (filter === 'medium') return confidence >= 50 && confidence < 75
  return confidence < 50
}

function countBySegment(
  segment: WorklistSegment,
  packages: RecoveryPackage[],
  isManualReviewPackage: (pkg: RecoveryPackage) => boolean,
  variant: PackagesViewProps['variant'],
  isManagerView: boolean,
  analystId?: string,
  packageHasAssignmentsForAnalyst?: (packageId: string, id: string) => boolean,
) {
  return packages.filter((pkg) => {
    if (segment === 'mine') {
      if (isManagerView) return true
      if (variant === 'analyst' && analystId && packageHasAssignmentsForAnalyst) {
        return packageHasAssignmentsForAnalyst(pkg.id, analystId)
      }
      return pkg.assignee === 'me'
    }
    if (segment === 'needs_review') return isManualReviewPackage(pkg)
    if (segment === 'ready') return !isManualReviewPackage(pkg)
    return true
  }).length
}

export function PackagesView({
  initialPackageId,
  initialSegment,
  onToast,
  variant = 'default',
}: PackagesViewProps) {
  const { role, user } = useDemoRole()
  const isAnalystView = variant === 'analyst'
  const isManagerView = role === 'manager' || variant === 'manager'
  const { isPackageOwnedByManager } = useOwnerAssignment()
  const {
    packageHasAssignmentsForAnalyst,
    getAnalystClaims,
    getAllAssignedClaimIds,
    getAssignedClaimCount,
  } = useWorkAssignment()
  const { getSummaryForClaimIds, getGlobalAssignedSummary } = useClaimResolution()
  const { getReviewStatus, setReviewStatus } = useCohortReview()
  const { manualReviewCount, isManualReviewPackage } = useEngagementConfig()
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const defaultSegment: WorklistSegment =
    variant === 'analyst' ? 'mine' : initialSegment ?? 'all'
  const [worklistSegment, setWorklistSegment] = useState<WorklistSegment>(defaultSegment)
  const [payerFilter, setPayerFilter] = useState('all')
  const [varianceFilter, setVarianceFilter] = useState<VarianceType | 'all'>('all')
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>('any')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (initialPackageId) setSelectedPackageId(initialPackageId)
  }, [initialPackageId])

  useEffect(() => {
    if (initialSegment) setWorklistSegment(initialSegment)
  }, [initialSegment])

  const scopedPackages = useMemo(() => {
    if (isManagerView && user?.managerId) {
      return RECOVERY_PACKAGES.filter((pkg) => isPackageOwnedByManager(pkg, user.managerId!))
    }
    if (variant === 'analyst' && user?.analystId) {
      return RECOVERY_PACKAGES.filter((pkg) =>
        packageHasAssignmentsForAnalyst(pkg.id, user.analystId!),
      )
    }
    return RECOVERY_PACKAGES
  }, [isManagerView, variant, user?.managerId, user?.analystId, isPackageOwnedByManager, packageHasAssignmentsForAnalyst])

  const scopedManualReviewCount = useMemo(
    () => scopedPackages.filter((pkg) => isManualReviewPackage(pkg)).length,
    [scopedPackages, isManualReviewPackage],
  )

  useEffect(() => {
    if (scopedPackages.length === 0) {
      setSelectedPackageId(null)
      return
    }

    const preferredId =
      initialPackageId && scopedPackages.some((pkg) => pkg.id === initialPackageId)
        ? initialPackageId
        : scopedPackages[0].id

    if (!selectedPackageId || !scopedPackages.some((pkg) => pkg.id === selectedPackageId)) {
      setSelectedPackageId(preferredId)
    }
  }, [scopedPackages, selectedPackageId, initialPackageId])

  const filteredPackages = useMemo(() => {
    return scopedPackages.filter((pkg) => {
      if (!isAnalystView) {
        if (worklistSegment === 'mine') {
          if (isManagerView) {
            // Manager worklist is already scoped to owned cohorts.
          } else if (pkg.assignee !== 'me') {
            return false
          }
        }
        if (worklistSegment === 'needs_review' && !isManualReviewPackage(pkg)) return false
        if (worklistSegment === 'ready' && isManualReviewPackage(pkg)) return false
      }
      if (payerFilter !== 'all' && !pkg.payer.toLowerCase().includes(payerFilter.toLowerCase())) return false
      if (varianceFilter !== 'all' && pkg.varianceType !== varianceFilter) return false
      if (!matchesConfidence(pkg.confidence, confidenceFilter)) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const hay = `${pkg.title} ${pkg.payer} ${pkg.procedureCode} ${pkg.code}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [
    scopedPackages,
    worklistSegment,
    payerFilter,
    varianceFilter,
    confidenceFilter,
    search,
    isManualReviewPackage,
    isAnalystView,
    variant,
    isManagerView,
    user?.analystId,
    packageHasAssignmentsForAnalyst,
  ])

  const selectedPackage = scopedPackages.find((p) => p.id === selectedPackageId) ?? null
  const status = selectedPackage ? getReviewStatus(selectedPackage.id) : 'pending'
  const selectedNeedsReview = selectedPackage ? isManualReviewPackage(selectedPackage) : false
  const selectedAssignedCount = selectedPackage ? getAssignedClaimCount(selectedPackage.id) : 0
  const showManagerProgress = Boolean(
    isManagerView && selectedPackage && status === 'approved' && selectedAssignedCount > 0,
  )

  const analystAssignedClaimCount = useMemo(() => {
    if (!isAnalystView || !user?.analystId) return 0
    return scopedPackages.reduce(
      (sum, pkg) => sum + getAnalystClaims(pkg, user.analystId!).length,
      0,
    )
  }, [isAnalystView, user?.analystId, scopedPackages, getAnalystClaims])

  const analystResolutionSummary = useMemo(() => {
    if (!isAnalystView || !user?.analystId) return null
    return getGlobalAssignedSummary(scopedPackages, (pkg) =>
      getAnalystClaims(pkg, user.analystId!).map((claim) => claim.id),
    )
  }, [isAnalystView, user?.analystId, scopedPackages, getGlobalAssignedSummary, getAnalystClaims])

  const selectedPackageResolutionSummary = useMemo(() => {
    if (!selectedPackage) return null
    if (isAnalystView && user?.analystId) {
      const claimIds = getAnalystClaims(selectedPackage, user.analystId).map((claim) => claim.id)
      return getSummaryForClaimIds(selectedPackage.id, claimIds)
    }
    if (showManagerProgress) {
      return getSummaryForClaimIds(selectedPackage.id, getAllAssignedClaimIds(selectedPackage))
    }
    return null
  }, [
    selectedPackage,
    isAnalystView,
    user?.analystId,
    showManagerProgress,
    getAnalystClaims,
    getSummaryForClaimIds,
    getAllAssignedClaimIds,
  ])

  const isManagerGate = isManagerView
  const highEvCount = scopedPackages.filter((p) => p.confidence >= 75).length
  const exposureNote = isManagerView || isAnalystView ? 'Your assigned cohorts' : 'Across all open cohorts'
  const reviewCount = isManagerView || isAnalystView ? scopedManualReviewCount : manualReviewCount

  return (
    <>
      {isManagerView ? (
        <div className="role-banner manager-banner">
          Manager view — approve the cohort at the human gate, then distribute claim ranges to analysts.
        </div>
      ) : null}

      {isAnalystView ? (
        <div className="role-banner analyst-banner">
          Analyst view — only your assigned cohorts and claims appear here. Update resolution progress as you work each claim.
        </div>
      ) : null}

      {role === 'director' ? (
        <div className="role-banner director-banner">
          Director view — executive read-only summary. Approve and assign actions are hidden.
        </div>
      ) : null}

      <section className="hero-row">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} />
            {variant === 'manager' ? 'Manager worklist' : isAnalystView ? 'Assigned work' : 'Resolution cohorts'}
          </div>
          <h1>
            {variant === 'manager'
              ? 'Approve cohorts, then assign claim work to your analysts.'
              : isAnalystView
                ? 'Work your assigned claims and track resolution.'
                : (
                  <>
                    The <em>cohort</em>, not the claim, is the unit of work.
                  </>
                )}
          </h1>
          <p className="hero-copy">
            {variant === 'manager'
              ? 'Review the recommendation and approve at the human gate. Claim-level assignment to Stephen Wardell Curry, Klay Thompson, and other analysts unlocks after approval.'
              : isAnalystView
                ? 'Your manager distributes claim ranges after cohort approval. Open a cohort below to review evidence and set resolution status on each assigned claim.'
                : (
                  <>
                    RevCompass groups similar variances into cohorts sourced from Epic / EHR. They appear
                    here ready for your review — one recommendation per cohort. On approval, each claim
                    becomes an individual payer filing. Low-confidence cohorts stay in the same worklist
                    under <strong>Needs manual review</strong>.
                  </>
                )}
          </p>
        </div>
        <div className="hero-actions">
          <div className="live-status">
            <span className="live-dot" /> Demo environment <span className="separator">•</span> Synthetic
            data
          </div>
        </div>
      </section>

      <section className="metric-grid">
        <Metric
          label={isAnalystView ? 'Assigned cohorts' : 'Active cohorts'}
          value={String(scopedPackages.length)}
          note={isAnalystView ? 'From manager distribution' : 'Ranked by expected value'}
          accent="var(--ink)"
        />
        {isAnalystView ? (
          <Metric
            label="Assigned claims"
            value={String(analystAssignedClaimCount)}
            note="Across your cohorts"
            accent="var(--primary)"
          />
        ) : (
          <Metric label="Open exposure" value={OPEN_EXPOSURE_TOTAL} note={exposureNote} accent="var(--ink)" />
        )}
        {isAnalystView && analystResolutionSummary ? (
          <Metric
            label="Resolved"
            value={`${analystResolutionSummary.percentResolved}%`}
            note={`${analystResolutionSummary.resolved} of ${analystResolutionSummary.total} claims`}
            accent="var(--green)"
          />
        ) : (
          <Metric label="Drift alerts" value="2" note="BCBS + Aetna" accent="var(--orange)" />
        )}
        <Metric
          label={isAnalystView ? 'In progress' : 'Manual review'}
          value={
            isAnalystView && analystResolutionSummary
              ? String(analystResolutionSummary.inProgress)
              : String(reviewCount)
          }
          note={
            isAnalystView && analystResolutionSummary
              ? `${analystResolutionSummary.notStarted} not started`
              : 'Below confidence threshold'
          }
          accent="var(--green)"
        />
      </section>

      <VarianceSourceNotice />

      {isAnalystView && analystResolutionSummary ? (
        <ClaimResolutionSummaryPanel summary={analystResolutionSummary} title="Your resolution progress" />
      ) : null}

      <div className="section-heading">
        <div>
          <span className="eyebrow">{isAnalystView ? 'Assigned work' : 'Worklist'}</span>
          <h2>{isAnalystView ? 'Your cohorts' : 'Resolution cohorts'}</h2>
        </div>
        {!isAnalystView ? (
          <div className="filter-row">
            <button
              type="button"
              className={`filter ${worklistSegment === 'all' ? 'active' : ''}`}
              onClick={() => setWorklistSegment('all')}
            >
              All <b>{countBySegment('all', scopedPackages, isManualReviewPackage, variant, isManagerView)}</b>
            </button>
            <button
              type="button"
              className={`filter ${worklistSegment === 'ready' ? 'active' : ''}`}
              onClick={() => setWorklistSegment('ready')}
            >
              Ready to act <b>{countBySegment('ready', scopedPackages, isManualReviewPackage, variant, isManagerView)}</b>
            </button>
            <button
              type="button"
              className={`filter filter-review ${worklistSegment === 'needs_review' ? 'active' : ''}`}
              onClick={() => setWorklistSegment('needs_review')}
            >
              Needs manual review <b>{reviewCount}</b>
            </button>
            {!isManagerView ? (
              <button
                type="button"
                className={`filter ${worklistSegment === 'mine' ? 'active' : ''}`}
                onClick={() => setWorklistSegment('mine')}
              >
                My queue <b>{countBySegment('mine', scopedPackages, isManualReviewPackage, variant, isManagerView, user?.analystId, packageHasAssignmentsForAnalyst)}</b>
              </button>
            ) : null}
            <button type="button" className="filter filter-muted">
              High EV <b>{highEvCount}</b>
            </button>
          </div>
        ) : (
          <span className="assigned-work-count">
            {scopedPackages.length} cohort{scopedPackages.length === 1 ? '' : 's'} · {analystAssignedClaimCount} claim
            {analystAssignedClaimCount === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="dashboard-filters">
        <select
          className="dashboard-filter-select"
          value={payerFilter}
          onChange={(e) => setPayerFilter(e.target.value)}
          aria-label="Filter by payer"
        >
          <option value="all">All payers</option>
          <option value="bcbs">BCBS</option>
          <option value="aetna">Aetna</option>
          <option value="uhc">UHC</option>
          <option value="cigna">Cigna</option>
        </select>
        <select
          className="dashboard-filter-select"
          value={varianceFilter}
          onChange={(e) => setVarianceFilter(e.target.value as VarianceType | 'all')}
          aria-label="Filter by variance type"
        >
          <option value="all">All variance types</option>
          <option value="denial">Denial</option>
          <option value="true_underpayment">Underpayment</option>
          <option value="writeoff">Write-off</option>
        </select>
        <select
          className="dashboard-filter-select"
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value as ConfidenceFilter)}
          aria-label="Filter by confidence"
        >
          <option value="any">Any confidence</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="search"
          className="dashboard-filter-search"
          placeholder="Search payer, CPT, DRG…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isAnalystView && scopedPackages.length === 0 ? (
        <div className="packages-empty">
          <strong>No assigned work yet</strong>
          <p>Your manager will assign claim ranges after approving a cohort at the human gate.</p>
        </div>
      ) : (
        <PackagesTable
          packages={filteredPackages}
          selectedId={selectedPackageId}
          needsManualReview={isManualReviewPackage}
          onSelect={setSelectedPackageId}
        />
      )}

      {selectedPackage ? (
        <section className="detail-shell">
          <div className="detail-head">
            <div>
              <div className="package-meta">
                <Pill tone="green">SELECTED COHORT</Pill>
                {selectedNeedsReview ? <Pill tone="amber">MANUAL REVIEW</Pill> : null}
                <span>{selectedPackage.code}</span>
                <span>•</span>
                <span>{varianceLabel(selectedPackage.varianceType)}</span>
              </div>
              <h2>{selectedPackage.title}</h2>
              <p>
                {selectedPackage.claimCount} claims · {selectedPackage.payer} · Facility:{' '}
                {selectedPackage.facility}
                {selectedPackage.primaryCarc ? ` · Primary CARC ${selectedPackage.primaryCarc}` : ''}
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

          {selectedNeedsReview ? (
            <div className="manual-review-banner">
              <AlertTriangle size={18} />
              <div>
                <strong>Below auto-recommend threshold</strong>
                <p>
                  {isManagerGate
                    ? 'RevCompass will not auto-recommend this cohort. Review evidence gaps, request more documentation, or log a manager override before approving.'
                    : 'RevCompass will not auto-recommend this cohort. Your manager will review evidence and decide at the human gate.'}
                </p>
              </div>
            </div>
          ) : null}

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
                <HumanGatePanel
                  pkg={selectedPackage}
                  status={status}
                  showActions={isManagerGate}
                  showManagerOverride={isManagerGate && selectedNeedsReview}
                  onApprove={() => {
                    setReviewStatus(selectedPackage.id, 'approved')
                    onToast?.(
                      `Cohort ${selectedPackage.code} approved — you can now assign claims to analysts.`,
                    )
                  }}
                  onReject={() => {
                    setReviewStatus(selectedPackage.id, 'rejected')
                    onToast?.(`Cohort ${selectedPackage.code} rejected and logged as an outcome.`)
                  }}
                  onOverride={(note) => {
                    onToast?.(`Manager override logged for ${selectedPackage.code}: ${note.slice(0, 40)}…`)
                    setReviewStatus(selectedPackage.id, 'approved')
                  }}
                />
                {isManagerGate && selectedNeedsReview ? (
                  <div className="review-quick-actions">
                    <span className="review-quick-label">Manual review actions</span>
                    <div className="review-quick-buttons">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          onToast?.(`Research request logged for ${selectedPackage.code} — contract team notified.`)
                        }
                      >
                        Request more evidence
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setReviewStatus(selectedPackage.id, 'rejected')
                          onToast?.(`Cohort ${selectedPackage.code} marked for write-off — logged to outcomes.`)
                        }}
                      >
                        Confirm write-off
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {isManagerView && selectedPackage && status === 'approved' ? (
            <ClaimDistributionPanel pkg={selectedPackage} onToast={onToast} />
          ) : null}

          {isManagerView && selectedPackage && status === 'pending' ? (
            <section className="claim-distribution-locked">
              <span className="eyebrow">Work assignment</span>
              <h3>Distribute work to analysts</h3>
              <p>
                Approve this cohort at the human gate above to unlock claim-level assignment to your
                analysts.
              </p>
            </section>
          ) : null}

          {selectedPackageResolutionSummary ? (
            <ClaimResolutionSummaryPanel
              summary={selectedPackageResolutionSummary}
              title={isAnalystView ? 'Your claims in this cohort' : 'Team resolution progress'}
            />
          ) : null}

          <ClaimsTable
            pkg={selectedPackage}
            showAssignmentColumn={isManagerView && status === 'approved'}
            showProgressColumn={isAnalystView || showManagerProgress}
            showOnlyAssignedClaims={showManagerProgress}
            editableProgress={isAnalystView}
            currentAnalystId={isAnalystView ? user?.analystId : undefined}
            filterToAnalystId={isAnalystView ? user?.analystId : undefined}
          />
        </section>
      ) : null}
    </>
  )
}
