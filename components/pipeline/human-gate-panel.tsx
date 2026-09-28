'use client'

import { useMemo, useState } from 'react'
import { Check, FileCheck2, X } from 'lucide-react'
import { PersonAvatar } from '@/components/person-avatar'
import { UserAvatar } from '@/components/user-avatar'
import { useDemoRole } from '@/lib/demo-role-context'
import { initialsFromName } from '@/lib/revcompass/profile-avatars'
import { useOwnerAssignment } from '@/lib/owner-assignment-context'
import { useWorkAssignment } from '@/lib/work-assignment-context'
import type { PackageManager, RecoveryPackage, ReviewStatus } from '@/lib/revcompass/types'

type HumanGatePanelProps = {
  pkg: RecoveryPackage
  status: ReviewStatus
  showActions?: boolean
  showManagerOverride?: boolean
  onApprove: () => void
  onReject: () => void
  onOverride?: (note: string) => void
}

function AssignmentRow({
  manager,
  label,
}: {
  manager: PackageManager
  label: string
}) {
  return (
    <div className="reviewer-row">
      <PersonAvatar
        name={manager.name}
        initials={initialsFromName(manager.name)}
        avatar={manager.avatar}
        size="md"
      />
      <div>
        <strong>{manager.name}</strong>
        <span>{manager.title}</span>
      </div>
      <span className="assigned">{label}</span>
    </div>
  )
}

export function HumanGatePanel({
  pkg,
  status,
  showActions = true,
  showManagerOverride = false,
  onApprove,
  onReject,
  onOverride,
}: HumanGatePanelProps) {
  const { user, role } = useDemoRole()
  const { getAssignedOwner } = useOwnerAssignment()
  const { getAnalystClaims } = useWorkAssignment()
  const [overrideOpen, setOverrideOpen] = useState(false)
  const [overrideNote, setOverrideNote] = useState('')

  const isAnalystView = role === 'analyst'
  const cohortManager = getAssignedOwner(pkg)
  const analystClaimCount = useMemo(() => {
    if (!isAnalystView || !user?.analystId) return 0
    return getAnalystClaims(pkg, user.analystId).length
  }, [isAnalystView, user?.analystId, pkg, getAnalystClaims])

  return (
    <div className="approval-panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">Human gate</span>
          <h3>
            {status === 'approved'
              ? isAnalystView
                ? 'Work assigned to you'
                : 'Cohort approved'
              : status === 'rejected'
                ? 'Cohort rejected'
                : showActions
                  ? 'Review before action'
                  : 'Recommendation — manager review pending'}
          </h3>
        </div>
        <div className={`approval-dot ${status === 'approved' ? 'approved' : ''}`}>
          {status === 'approved' ? <Check size={15} /> : status === 'rejected' ? <X size={15} /> : null}
        </div>
      </div>

      {status === 'approved' ? (
        <>
          <p className="detail-text">
            {isAnalystView && analystClaimCount > 0
              ? `${cohortManager.name} approved this cohort and assigned ${analystClaimCount} claim${analystClaimCount === 1 ? '' : 's'} to you. Work the claims below and update resolution progress as you go.`
              : isAnalystView
                ? `${cohortManager.name} approved this cohort. Your manager will assign claim ranges before work begins.`
                : `Cohort approved — ${pkg.claimCount} claim filings queued. The ${pkg.dispositionLabel.toLowerCase()} action is ready for downstream handoff.`}
          </p>
          {isAnalystView ? (
            <AssignmentRow manager={cohortManager} label="Assigned by" />
          ) : (
            <div className="success-box">
              <Check size={18} />
              <div>
                <strong>Cohort approved</strong>
                <span>{pkg.artifactLabel} · Approved today</span>
              </div>
            </div>
          )}
        </>
      ) : status === 'rejected' ? (
        <p className="detail-text">
          Cohort routed back to the worklist. No downstream action will be taken.
        </p>
      ) : (
        <>
          <p className="detail-text">
            {showActions
              ? 'Action packaging is paused until a manager confirms the disposition and evidence set for this cohort.'
              : `RevCompass recommends ${pkg.dispositionLabel.toLowerCase()} for this cohort (${pkg.confidence}% confidence). A manager must approve at the human gate before filing.`}
          </p>
          {showActions ? (
            <div className="reviewer-row">
              <UserAvatar />
              <div>
                <strong>{user?.name ?? 'Manager'}</strong>
                <span>{user?.title ?? 'Revenue Integrity Manager'}</span>
              </div>
              <span className="assigned">Gate owner</span>
            </div>
          ) : isAnalystView ? (
            <div className="read-only-gate-note">
              <strong>Manager human gate</strong>
              <span>
                RevCompass recommends {pkg.dispositionLabel.toLowerCase()} for this cohort (
                {pkg.confidence}% confidence). Your cohort owner below must approve before claims
                can be assigned to you.
              </span>
            </div>
          ) : (
            <div className="read-only-gate-note">
              <strong>Manager human gate</strong>
              <span>
                Approve and reject actions are limited to managers. You can review the recommendation
                and evidence below.
              </span>
            </div>
          )}
          {isAnalystView ? <AssignmentRow manager={cohortManager} label="Cohort owner" /> : null}
          <div className="artifact-box">
            <FileCheck2 size={20} />
            <div>
              <strong>{pkg.artifactLabel}</strong>
              <span>
                {pkg.evidence.length} citations · {pkg.claimCount} claim references
              </span>
            </div>
          </div>
          {showManagerOverride && !overrideOpen ? (
            <button
              type="button"
              className="secondary-button action-btn override-trigger"
              onClick={() => setOverrideOpen(true)}
            >
              Manager override
            </button>
          ) : null}
          {overrideOpen ? (
            <div className="override-box">
              <div className="override-box-title">Manager override requires a written justification</div>
              <textarea
                className="override-textarea"
                placeholder="Why should this cohort proceed despite low confidence?"
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
              />
              <button
                type="button"
                className="approve-button action-btn"
                onClick={() => {
                  onOverride?.(overrideNote)
                  setOverrideOpen(false)
                  setOverrideNote('')
                }}
              >
                Confirm override
              </button>
            </div>
          ) : null}
          {showActions ? (
            <div className="approval-actions">
              <button type="button" className="secondary-button action-btn" onClick={onReject}>
                Reject
              </button>
              <button type="button" className="approve-button action-btn" onClick={onApprove}>
                <Check size={15} /> Approve cohort
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
