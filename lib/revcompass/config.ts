export type EngagementConfig = {
  autoRecommendThreshold: number
  manualReviewThreshold: number
  supervisorOverrideRequired: boolean
  minimumCohortSize: number
  urgencyLaneWindowDays: number
  appealUnitCost: number
  crossClientFingerprintSharing: 'pending' | 'enabled' | 'disabled'
}

export const ENGAGEMENT_CONFIG_STORAGE_KEY = 'revcompass_engagement_config'

export const ENGAGEMENT_CONFIG: EngagementConfig = {
  autoRecommendThreshold: 0.75,
  manualReviewThreshold: 0.5,
  supervisorOverrideRequired: true,
  minimumCohortSize: 3,
  urgencyLaneWindowDays: 10,
  appealUnitCost: 45,
  crossClientFingerprintSharing: 'pending',
}

export const CONFIG_LABELS: { key: keyof EngagementConfig; label: string; desc: string; hitl?: boolean }[] = [
  {
    key: 'autoRecommendThreshold',
    label: 'Auto-recommend threshold',
    desc: 'Confidence score above which a cohort is auto-recommended rather than routed to manual research.',
    hitl: true,
  },
  {
    key: 'manualReviewThreshold',
    label: 'Manual review threshold',
    desc: 'Below this confidence, a cohort always routes to the Manual Review Queue for human sign-off.',
    hitl: true,
  },
  {
    key: 'supervisorOverrideRequired',
    label: 'Manager override',
    desc: 'Requires a written justification, logged to the audit trail, to approve a cohort below the manual-review threshold.',
    hitl: true,
  },
  {
    key: 'minimumCohortSize',
    label: 'Minimum cohort size',
    desc: 'Claims below this count stay as standalone review items rather than forming a cohort.',
  },
  {
    key: 'urgencyLaneWindowDays',
    label: 'Urgency lane window',
    desc: 'Days before filing deadline at which a claim is scored standalone rather than waiting on its cohort. Filing deadline is never used to group claims into a cohort.',
  },
  {
    key: 'appealUnitCost',
    label: 'Appeal unit cost',
    desc: "Used in the expected-value calculation. Calibrate against this client's actual rework cost.",
  },
  {
    key: 'crossClientFingerprintSharing',
    label: 'Cross-client fingerprint sharing',
    desc: 'Pool de-identified payer behavior with other RevCompass clients on the same payers.',
  },
]
