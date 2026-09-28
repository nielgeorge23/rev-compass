export type WorkflowScenarioId = '3a' | '3b' | '3c'

export type EngineType = 'fingerprint' | 'disposition' | 'contract_variance'

export type DispositionType = 'appeal' | 'resubmit' | 'write_off' | 'escalate' | 'prevent'

export type VarianceType = 'denial' | 'true_underpayment' | 'contractual_adjustment' | 'writeoff'

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type PackageApprovalStatus = 'pending' | 'approved' | 'rejected'

export type PackageManager = {
  id: string
  name: string
  title: string
  avatar?: string
}

export type PackagePillTone = 'amber' | 'teal' | 'green' | 'slate'

export type DemoRole = 'analyst' | 'manager' | 'director'

export type ClaimRangeAssignment = {
  id: string
  packageId: string
  analystId: string
  startClaim: number
  endClaim: number
}

export type ClaimResolutionStatus =
  | 'not_started'
  | 'in_review'
  | 'pending_documentation'
  | 'escalated'
  | 'resolved'

export type ClaimResolutionSummary = {
  total: number
  resolved: number
  inProgress: number
  notStarted: number
  percentResolved: number
}

export type ClusterClaim = {
  id: string
  account: string
  serviceDate: string
  drg: string
  billed: string
  paid: string
  variance: string
  status: 'Denied' | 'Underpaid' | 'Pending review'
}

export type ClusterMetric = {
  label: string
  value: string
  note: string
}

export type EvidenceCitation = {
  id: string
  title: string
  detail: string
  sourceType: 'remit' | 'policy' | 'contract' | 'cohort' | 'amendment'
}

export type ConfidenceBreakdown = {
  evidence: number
  cohesion: number
  reliability: number
}

export type AppealTemplate = {
  name: string
  fit: string
  best: boolean
}

export type RecoveryPackage = {
  id: string
  code: string
  title: string
  summary: string
  payer: string
  facility: string
  engine: EngineType
  workflowId: WorkflowScenarioId
  disposition: DispositionType
  dispositionLabel: string
  varianceType: VarianceType
  procedureCode: string
  pill: PackagePillTone
  pillLabel: string
  exposure: string
  expectedRecovery: string
  confidence: number
  confidenceRationale: string
  confidenceBreakdown: ConfidenceBreakdown
  evMath: string
  claimCount: number
  updated: string
  created: string
  filingDays: number
  icon: 'shield' | 'database' | 'contract'
  clusterMetrics: ClusterMetric[]
  claims: ClusterClaim[]
  evidence: EvidenceCitation[]
  artifactLabel: string
  linkedFingerprintId?: string
  primaryCarc?: string
  secondaryCarcs?: string[]
  denialRootCause?: string
  varianceRootCause?: string
  payerContext: string
  insufficientEvidence?: boolean
  needsPatientDocValidation?: boolean
  patientDocNote?: string
  assignee?: 'me' | 'none'
  assignedTeam?: string
  daysPending: number
  pastTargetDeadline: boolean
  approvalStatus: PackageApprovalStatus
  recommendedOwner: PackageManager
  alternateOwners?: PackageManager[]
  appealTemplates?: AppealTemplate[]
  preventTicket?: string
  urgentClaimCount?: number
}

export type AgentDefinition = {
  n: string
  name: string
  gemini: string
  tool: string
}

export type WorkflowScenario = {
  id: WorkflowScenarioId
  label: string
  scenario: string
  gate: string
  notes: string[]
  stats: [string, string][]
  packageId: string
}

export type PayerFingerprint = {
  id: string
  name: string
  shortName: string
  baseline: { denialRate: string; daysToPay: string; overturnRate: string; downgradeRate: string }
  current: { denialRate: string; daysToPay: string; overturnRate: string; downgradeRate: string }
  driftAlert?: string
  topSignal: string
  signalStrength: number
  editVectors: { label: string; pct: string }[]
  resolutionProfile: { label: string; value: string }[]
  linkedPackageId?: string
  sparkline: number[]
}

export type PayerExposureRow = {
  payer: string
  openPackages: number
  exposure: string
  denialTrend: string
  overturnRate: string
  trendTone?: 'bad' | 'stable' | 'muted'
}

export type PackageOutcome = {
  packageId: string
  packageTitle: string
  payer: string
  exposure: string
  recovered: string
  result: string
  patternConfirmed: boolean
  learningNote: string
}

export type WorklistSegment = 'all' | 'ready' | 'needs_review' | 'mine'

export type View =
  | 'home'
  | 'packages'
  | 'fingerprints'
  | 'outcomes'
  | 'structure'
  | 'config'

export const DATA_FEEDS = [
  'Claims (837)',
  'Remits (835)',
  'Payer identity & product',
  'CPT / DRG',
  'CARC / RARC reason codes',
  'Contract variance (expected vs. actual)',
  'Payer policy documents',
  'Historical outcomes',
] as const

export const VARIANCE_RECORD_FORMULA =
  'VarianceRecord = payer × CPT/DRG × CARC/RARC × variance type × $ × dates'

export function isManualReview(pkg: RecoveryPackage, manualReviewThreshold = 0.5): boolean {
  return pkg.confidence < manualReviewThreshold * 100 || Boolean(pkg.insufficientEvidence)
}

export function countManualReviewPackages(
  packages: RecoveryPackage[],
  manualReviewThreshold = 0.5,
): number {
  return packages.filter((p) => isManualReview(p, manualReviewThreshold)).length
}
