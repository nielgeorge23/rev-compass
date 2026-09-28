import type { ClusterClaim, PackageOutcome, RecoveryPackage } from './types'
import { MANAGERS } from './managers'

function expandClaims(
  seeds: ClusterClaim[],
  total: number,
  options: { idStart: number; accountStart: number; dateStart: string },
): ClusterClaim[] {
  const { idStart, accountStart, dateStart } = options
  const start = new Date(`${dateStart}T12:00:00`)

  return Array.from({ length: total }, (_, i) => {
    const seed = seeds[i % seeds.length]
    const date = new Date(start)
    date.setDate(date.getDate() + i)
    return {
      ...seed,
      id: `CLM-${idStart + i}`,
      account: `NSM-${accountStart + i}`,
      serviceDate: date.toISOString().slice(0, 10),
    }
  })
}

const aetnaClaimSeeds = [
  { id: 'CLM-88421', account: 'NSM-44102', serviceDate: '2026-03-14', drg: '871 → 872', billed: '$24,800', paid: '$18,420', variance: '$6,380', status: 'Denied' as const },
  { id: 'CLM-88437', account: 'NSM-44118', serviceDate: '2026-03-15', drg: '871 → 872', billed: '$31,200', paid: '$22,960', variance: '$8,240', status: 'Underpaid' as const },
  { id: 'CLM-88452', account: 'NSM-44129', serviceDate: '2026-03-16', drg: '871 → 872', billed: '$19,450', paid: '$14,110', variance: '$5,340', status: 'Denied' as const },
  { id: 'CLM-88468', account: 'NSM-44144', serviceDate: '2026-03-17', drg: '871 → 872', billed: '$28,900', paid: '$21,300', variance: '$7,600', status: 'Underpaid' as const },
  { id: 'CLM-88479', account: 'NSM-44157', serviceDate: '2026-03-18', drg: '871 → 872', billed: '$22,100', paid: '$16,880', variance: '$5,220', status: 'Underpaid' as const },
  { id: 'CLM-88491', account: 'NSM-44163', serviceDate: '2026-03-19', drg: '871 → 872', billed: '$26,700', paid: '$19,540', variance: '$7,160', status: 'Pending review' as const },
  { id: 'CLM-88504', account: 'NSM-44171', serviceDate: '2026-03-20', drg: '871 → 872', billed: '$18,600', paid: '$13,420', variance: '$5,180', status: 'Underpaid' as const },
  { id: 'CLM-88518', account: 'NSM-44188', serviceDate: '2026-03-21', drg: '871 → 872', billed: '$29,400', paid: '$21,900', variance: '$7,500', status: 'Underpaid' as const },
]

const bcbsClaimSeeds = [
  { id: 'CLM-66201', account: 'NSM-52001', serviceDate: '2026-06-04', drg: '22612', billed: '$42,100', paid: '$0', variance: '$42,100', status: 'Denied' as const },
  { id: 'CLM-66218', account: 'NSM-52014', serviceDate: '2026-06-05', drg: '22612', billed: '$38,900', paid: '$0', variance: '$38,900', status: 'Denied' as const },
  { id: 'CLM-66229', account: 'NSM-52027', serviceDate: '2026-06-06', drg: '22612', billed: '$45,200', paid: '$12,400', variance: '$32,800', status: 'Underpaid' as const },
  { id: 'CLM-66244', account: 'NSM-52039', serviceDate: '2026-06-07', drg: '22612', billed: '$41,800', paid: '$0', variance: '$41,800', status: 'Denied' as const },
  { id: 'CLM-66257', account: 'NSM-52048', serviceDate: '2026-06-08', drg: '22612', billed: '$39,500', paid: '$0', variance: '$39,500', status: 'Denied' as const },
  { id: 'CLM-66263', account: 'NSM-52055', serviceDate: '2026-06-09', drg: '22612', billed: '$44,100', paid: '$8,200', variance: '$35,900', status: 'Underpaid' as const },
]

const contractClaimSeeds = [
  { id: 'CLM-90102', account: 'NSM-61001', serviceDate: '2026-07-02', drg: '470', billed: '$12,000', paid: '$9,000', variance: '$3,000', status: 'Underpaid' as const },
  { id: 'CLM-90118', account: 'NSM-61014', serviceDate: '2026-07-05', drg: '470', billed: '$12,000', paid: '$9,000', variance: '$3,000', status: 'Underpaid' as const },
  { id: 'CLM-90129', account: 'NSM-61027', serviceDate: '2026-07-08', drg: '470', billed: '$12,000', paid: '$9,000', variance: '$3,000', status: 'Underpaid' as const },
  { id: 'CLM-90144', account: 'NSM-61039', serviceDate: '2026-07-10', drg: '470', billed: '$12,000', paid: '$9,000', variance: '$3,000', status: 'Underpaid' as const },
  { id: 'CLM-90157', account: 'NSM-61048', serviceDate: '2026-07-12', drg: '470', billed: '$12,000', paid: '$9,000', variance: '$3,000', status: 'Underpaid' as const },
  { id: 'CLM-90163', account: 'NSM-61055', serviceDate: '2026-07-15', drg: '470', billed: '$12,000', paid: '$9,000', variance: '$3,000', status: 'Underpaid' as const },
]

const cignaClaimSeeds = [
  { id: 'CLM-77021', account: 'NSM-33001', serviceDate: '2026-02-18', drg: '291', billed: '$14,800', paid: '$9,200', variance: '$5,600', status: 'Denied' as const },
  { id: 'CLM-77022', account: 'NSM-33002', serviceDate: '2026-02-19', drg: '291', billed: '$16,200', paid: '$10,100', variance: '$6,100', status: 'Denied' as const },
  { id: 'CLM-77023', account: 'NSM-33003', serviceDate: '2026-02-20', drg: '291', billed: '$13,900', paid: '$8,700', variance: '$5,200', status: 'Denied' as const },
]

const preventClaimSeeds = [
  { id: 'CLM-91004', account: 'NSM-72001', serviceDate: '2026-04-02', drg: '93458', billed: '$18,200', paid: '$0', variance: '$18,200', status: 'Denied' as const },
  { id: 'CLM-91005', account: 'NSM-72002', serviceDate: '2026-04-02', drg: '93458', billed: '$15,900', paid: '$0', variance: '$15,900', status: 'Denied' as const },
  { id: 'CLM-91006', account: 'NSM-72003', serviceDate: '2026-04-03', drg: '93458', billed: '$17,400', paid: '$0', variance: '$17,400', status: 'Denied' as const },
]

const aetnaClaims = expandClaims(aetnaClaimSeeds, 52, {
  idStart: 88421,
  accountStart: 44102,
  dateStart: '2026-03-14',
})
const bcbsClaims = expandClaims(bcbsClaimSeeds, 163, {
  idStart: 66201,
  accountStart: 52001,
  dateStart: '2026-06-04',
})
const contractClaims = expandClaims(contractClaimSeeds, 412, {
  idStart: 90102,
  accountStart: 61001,
  dateStart: '2026-07-02',
})
const cignaClaims = expandClaims(cignaClaimSeeds, 19, {
  idStart: 77021,
  accountStart: 33001,
  dateStart: '2026-02-18',
})
const preventClaims = expandClaims(preventClaimSeeds, 28, {
  idStart: 91004,
  accountStart: 72001,
  dateStart: '2026-04-02',
})

export const RECOVERY_PACKAGES: RecoveryPackage[] = [
  {
    id: 'RC-00271',
    code: 'RC-00271',
    title: 'BCBS spinal fusion CO-50 cluster',
    summary: 'Policy change May 28 · Conservative therapy required',
    payer: 'BCBS Commercial',
    facility: 'Northstar Medical Center',
    engine: 'fingerprint',
    workflowId: '3a',
    disposition: 'appeal',
    dispositionLabel: 'Appeal',
    varianceType: 'denial',
    procedureCode: 'CPT 22612',
    pill: 'amber',
    pillLabel: 'DRIFT ALERT',
    exposure: '$1.7M',
    expectedRecovery: '$1.1M',
    confidence: 89,
    confidenceRationale:
      'Payer behavior drift detected after May 28 policy revision. Historical overturn rate of 78% for this payer × reason combination supports a coordinated appeal for the full cohort.',
    confidenceBreakdown: { evidence: 0.92, cohesion: 0.91, reliability: 0.84 },
    evMath: 'EV(appeal) = $1.7M × 0.78 − 163 × $45 ≈ $1.1M recoverable',
    claimCount: 163,
    updated: '12 min ago',
    created: 'Created today at 08:55',
    filingDays: 38,
    icon: 'shield',
    linkedFingerprintId: 'bcbs',
    artifactLabel: 'Appeal package AP-00271 — BCBS Orthopedic Policy Change',
    primaryCarc: 'CO-50',
    secondaryCarcs: [],
    assignee: 'none',
    assignedTeam: 'Unassigned',
    daysPending: 5,
    pastTargetDeadline: false,
    approvalStatus: 'pending',
    recommendedOwner: MANAGERS['draymond-green'],
    alternateOwners: [MANAGERS['maria-chen'], MANAGERS['james-patel']],
    denialRootCause:
      'Potential payer policy change (May 28 revision) — BCBS Texas denial rate rose materially after June 3, concentrated in spinal fusion (CPT 22612), measured against trailing 12-month payer history.',
    payerContext:
      'Trailing 12-month BCBS history: denial rate for spinal fusion CO-50 rose from 4% to 12% after the May 28 policy revision. 84 comparable historical cases show 78% overturn when policy criteria are met.',
    appealTemplates: [
      { name: 'BCBS medical necessity — Policy §4.2 rebuttal', fit: '94% fit', best: true },
      { name: 'Generic CO-50 appeal template', fit: '62% fit', best: false },
      { name: 'BCBS spinal fusion clinical criteria', fit: '58% fit', best: false },
    ],
    clusterMetrics: [
      { label: 'Claims in cluster', value: '163', note: 'BCBS spinal fusion CO-50' },
      { label: 'Drift detected', value: '12 days', note: 'Before volume peaked' },
      { label: 'Denial rate shift', value: '4% → 12%', note: 'Since June 3' },
      { label: 'Evidence coverage', value: '94%', note: 'Policy + cohort grounding' },
    ],
    claims: bcbsClaims,
    evidence: [
      { id: 'e1', title: 'Remit 835 — CARC CO-50', detail: 'Not medically necessary', sourceType: 'remit' },
      { id: 'e2', title: 'BCBS Policy §4.2 (updated May 28)', detail: 'Conservative therapy required before spinal fusion', sourceType: 'policy' },
      { id: 'e3', title: 'Historical appeal cohort', detail: '84 similar claims · 78% overturn rate', sourceType: 'cohort' },
    ],
  },
  {
    id: 'RC-00428',
    code: 'RC-00428',
    title: 'DRG 871 → 872 downgrade cluster',
    summary: 'Discharge status mismatch · Contract §4.2',
    payer: 'Aetna Commercial',
    facility: 'Northstar Medical Center',
    engine: 'disposition',
    workflowId: '3b',
    disposition: 'appeal',
    dispositionLabel: 'Appeal',
    varianceType: 'denial',
    procedureCode: 'DRG 871',
    pill: 'amber',
    pillLabel: 'HIGH EV',
    exposure: '$899K',
    expectedRecovery: '$735K',
    confidence: 91,
    confidenceRationale:
      'Highly similar historical claims, clear contract and policy citations, consistent denial reason across all 52 claims.',
    confidenceBreakdown: { evidence: 0.95, cohesion: 0.93, reliability: 0.82 },
    evMath: 'EV(appeal) = $899K × 0.82 − 52 × $45 ≈ $735K',
    claimCount: 52,
    updated: '8 min ago',
    created: 'Created today at 09:42',
    filingDays: 45,
    icon: 'shield',
    linkedFingerprintId: 'aetna',
    artifactLabel: 'Appeal artifact AP-00428',
    primaryCarc: 'CO-50',
    secondaryCarcs: ['CO-97'],
    assignee: 'me',
    assignedTeam: 'Unassigned',
    daysPending: 4,
    pastTargetDeadline: false,
    approvalStatus: 'pending',
    recommendedOwner: MANAGERS['draymond-green'],
    alternateOwners: [MANAGERS['lauren-brooks'], MANAGERS['james-patel']],
    denialRootCause:
      'Aetna reassigned DRG 871 (septicemia w/ MCC) to 872 without the medical-record review its own Policy P-118 requires.',
    payerContext:
      'Trailing 12-month Aetna history: DRG 871→872 downgrade rate rose from 2% to 61% since a Feb 2026 policy revision — this cohort is one of 3 opened against that drift signal.',
    appealTemplates: [
      { name: 'Aetna DRG Downgrade — Policy P-118 rebuttal', fit: '96% fit', best: true },
      { name: 'Generic medical-necessity appeal', fit: '61% fit', best: false },
      { name: 'Aetna bundling dispute template', fit: '40% fit', best: false },
    ],
    clusterMetrics: [
      { label: 'Claims in cluster', value: '52', note: 'Single DRG edit family' },
      { label: 'Median variance', value: '$17.3K', note: 'Per claim underpayment' },
      { label: 'Edit pattern match', value: '91%', note: 'Aetna DRG downgrade signature' },
      { label: 'Evidence coverage', value: '96%', note: 'Contract + clinical grounding' },
    ],
    claims: aetnaClaims,
    evidence: [
      { id: 'e1', title: 'Contract §4.2', detail: 'Pay as billed absent a documented clinical review', sourceType: 'contract' },
      { id: 'e2', title: 'Policy P-118', detail: 'Review required before any DRG reassignment', sourceType: 'policy' },
      { id: 'e3', title: 'Remit trail', detail: 'No review referenced on any of the 52 remits', sourceType: 'remit' },
    ],
  },
  {
    id: 'RC-00512',
    code: 'RC-00512',
    title: 'Outdated contracted rate — orthopedic DRG 470',
    summary: 'Contract amendment July 1 · Payment system not updated',
    payer: 'UHC Commercial',
    facility: 'Northstar Medical Center',
    engine: 'contract_variance',
    workflowId: '3c',
    disposition: 'escalate',
    dispositionLabel: 'Payer escalation',
    varianceType: 'true_underpayment',
    procedureCode: 'DRG 470',
    pill: 'teal',
    pillLabel: 'CONTRACT',
    exposure: '$620K',
    expectedRecovery: '$620K',
    confidence: 94,
    confidenceRationale:
      'Contract amendment found in policy store, sustained underpayment pattern across 412 claims, cohort-level EV strongly positive.',
    confidenceBreakdown: { evidence: 0.97, cohesion: 0.95, reliability: 0.9 },
    evMath: '412 claims × $3,000 variance = $1.236M gross · $620K net recoverable after adjustments',
    claimCount: 412,
    updated: '1 hr ago',
    created: 'Created yesterday at 14:30',
    filingDays: 60,
    icon: 'contract',
    linkedFingerprintId: 'uhc',
    artifactLabel: 'Escalation request ER-00512',
    primaryCarc: 'CO-45',
    assignee: 'none',
    assignedTeam: 'Unassigned',
    daysPending: 9,
    pastTargetDeadline: false,
    approvalStatus: 'pending',
    recommendedOwner: MANAGERS['kevin-shah'],
    varianceRootCause:
      'Updated orthopedic rate effective July 1 may not have been applied consistently. Contract Variance explains the underpayment; disposition recommends validating configuration and initiating payer recovery.',
    payerContext:
      'Trailing 12-month UHC history: stable denial rate (6–7%); sustained underpayment pattern since July 1 points to contract configuration, not payer drift.',
    clusterMetrics: [
      { label: 'Claims in cluster', value: '412', note: 'Orthopedic DRG 470' },
      { label: 'Per-claim variance', value: '$3,000', note: 'Expected $12K vs paid $9K' },
      { label: 'Pattern duration', value: 'Since Jul 1', note: 'Sustained underpayment' },
      { label: 'Evidence coverage', value: '98%', note: 'Contract amendment on file' },
    ],
    claims: contractClaims,
    evidence: [
      { id: 'e1', title: 'Contract variance feed', detail: 'Expected $12,000 vs actual $9,000 per claim', sourceType: 'remit' },
      { id: 'e2', title: 'Contract amendment — effective July 1', detail: 'Rate schedule update not applied in payment system', sourceType: 'amendment' },
      { id: 'e3', title: 'Sustained pattern analysis', detail: '412 claims share payer × DRG × variance signature', sourceType: 'cohort' },
    ],
  },
  {
    id: 'RC-00488',
    code: 'RC-00488',
    title: 'Heart failure DRG downcoding',
    summary: 'DRG 291 downcode · Insufficient evidence',
    payer: 'Cigna Commercial',
    facility: 'Northstar Medical Center',
    engine: 'disposition',
    workflowId: '3b',
    disposition: 'write_off',
    dispositionLabel: 'Write-off',
    varianceType: 'denial',
    procedureCode: 'DRG 291',
    pill: 'slate',
    pillLabel: 'LOW CONFIDENCE',
    exposure: '$264K',
    expectedRecovery: '$0',
    confidence: 12,
    confidenceRationale:
      'No contract or policy clause retrieved above the similarity threshold for this downcoding pattern. Cannot auto-recommend.',
    confidenceBreakdown: { evidence: 0.18, cohesion: 0.64, reliability: 0.09 },
    evMath: 'All actionable EV is at or below 0 — no evidence found supporting a documentation gap on the Cigna side.',
    claimCount: 19,
    updated: '22 min ago',
    created: 'Created today at 07:30',
    filingDays: 6,
    icon: 'shield',
    artifactLabel: 'Manual review — RC-00488',
    primaryCarc: 'CO-11',
    secondaryCarcs: ['CO-16'],
    assignee: 'none',
    assignedTeam: 'Unassigned',
    daysPending: 14,
    pastTargetDeadline: true,
    approvalStatus: 'pending',
    recommendedOwner: MANAGERS['nicole-harris'],
    insufficientEvidence: true,
    needsPatientDocValidation: true,
    patientDocNote:
      "Cigna's stated basis references clinical severity criteria — validating this requires comparing coded severity against the EHR H&P and nursing documentation for these 19 encounters before any appeal is drafted.",
    denialRootCause:
      'No contract or policy clause was retrieved above the similarity threshold for this downcoding pattern.',
    payerContext:
      'No prior outcomes for this payer × DRG combination — insufficient history to estimate overturn probability.',
    clusterMetrics: [
      { label: 'Claims in cluster', value: '19', note: 'DRG 291 downcode' },
      { label: 'Evidence spans', value: '0', note: 'Above similarity threshold' },
      { label: 'Historical overturn', value: '—', note: 'Insufficient history' },
      { label: 'Filing urgency', value: '6 days', note: 'Urgency lane active' },
    ],
    claims: cignaClaims,
    evidence: [],
  },
  {
    id: 'RC-00430',
    code: 'RC-00430',
    title: 'Prior-auth workflow failure — Location X imaging',
    summary: 'Internal scheduling gap · Not payer-driven',
    payer: 'UHC Commercial',
    facility: 'Northstar Medical Center — Location X',
    engine: 'fingerprint',
    workflowId: '3a',
    disposition: 'prevent',
    dispositionLabel: 'Prevent',
    varianceType: 'denial',
    procedureCode: 'CPT 93458',
    pill: 'green',
    pillLabel: 'INTERNAL',
    exposure: '$210K',
    expectedRecovery: '$0',
    confidence: 88,
    confidenceRationale:
      'Root cause traced to an internal process gap, not payer behavior. Prevention ticket recommended over appeal.',
    confidenceBreakdown: { evidence: 0.9, cohesion: 0.88, reliability: 0.85 },
    evMath: 'Prevention ROI: $210K exposure avoided on recurrence vs. $45/claim rework cost',
    claimCount: 28,
    updated: '35 min ago',
    created: 'Created today at 06:15',
    filingDays: 18,
    urgentClaimCount: 4,
    icon: 'shield',
    linkedFingerprintId: 'uhc',
    artifactLabel: 'Prevent ticket EPIC-2291',
    primaryCarc: 'CO-197',
    assignee: 'none',
    assignedTeam: 'Scheduling/Auth Team',
    daysPending: 8,
    pastTargetDeadline: false,
    approvalStatus: 'pending',
    recommendedOwner: MANAGERS['amanda-lee'],
    denialRootCause:
      'Root cause traced to an internal process gap, not payer behavior: front-desk scheduling at Location X is not capturing prior-auth confirmation before imaging appointments are booked.',
    payerContext:
      'Trailing 12-month UHC history: stable denial rate (6–7%); this is an isolated export-bug pattern at Location X, not payer drift.',
    preventTicket:
      'Routed to Epic auth-workflow queue · Ticket #EPIC-2291 · Owner: Location X scheduling team · Closes automatically when denial rate for this location/CPT returns to baseline.',
    clusterMetrics: [
      { label: 'Claims in cluster', value: '28', note: 'Location X imaging' },
      { label: 'Root cause', value: 'Internal', note: 'Auth workflow gap' },
      { label: 'Payer drift', value: 'None', note: 'Stable UHC baseline' },
      { label: 'Urgent claims', value: '4', note: 'Within urgency lane' },
    ],
    claims: preventClaims,
    evidence: [
      { id: 'e1', title: 'Auth log', detail: 'Authorization approved prior to date of service on sample claims', sourceType: 'cohort' },
      { id: 'e2', title: '837 export audit', detail: 'Auth number field blank on all 28 claims — export bug JIRA-4021', sourceType: 'remit' },
    ],
  },
]

export const PACKAGE_OUTCOMES: PackageOutcome[] = [
  {
    packageId: 'RC-00428',
    packageTitle: 'DRG 871 → 872 downgrade',
    payer: 'Aetna',
    exposure: '$899K',
    recovered: '$812K',
    result: '47 / 52',
    patternConfirmed: true,
    learningNote: 'Aetna DRG downgrade overturn rate updated to 90.2% for this policy wording.',
  },
  {
    packageId: 'RC-00271',
    packageTitle: 'BCBS spinal fusion CO-50',
    payer: 'BCBS',
    exposure: '$1.7M',
    recovered: '$1.32M',
    result: '127 / 163',
    patternConfirmed: true,
    learningNote: 'Policy drift confirmed — appeal baseline raised for BCBS spinal fusion CO-50 cohorts.',
  },
  {
    packageId: 'RC-00512',
    packageTitle: 'Outdated contracted rate',
    payer: 'UHC',
    exposure: '$620K',
    recovered: '$580K',
    result: '398 / 412',
    patternConfirmed: true,
    learningNote: 'Contract rate table flagged for correction — escalation pattern validated.',
  },
  {
    packageId: 'RC-00488',
    packageTitle: 'Heart failure DRG downcoding',
    payer: 'Cigna',
    exposure: '$264K',
    recovered: '$0',
    result: 'Written off',
    patternConfirmed: false,
    learningNote: 'Pattern killed — insufficient evidence to pursue; manual review threshold validated.',
  },
  {
    packageId: 'RC-00430',
    packageTitle: 'Auth workflow failure — Location X',
    payer: 'UHC',
    exposure: '$210K',
    recovered: 'Pending',
    result: 'Prevent ticket open',
    patternConfirmed: true,
    learningNote: 'First cycle this internal pattern has been surfaced — monitoring Location X denial rate.',
  },
]

export const OPEN_EXPOSURE_TOTAL = '$3.69M'

export function getPackage(id: string) {
  return RECOVERY_PACKAGES.find((p) => p.id === id)
}

export function getPackageByWorkflow(workflowId: string) {
  return RECOVERY_PACKAGES.find((p) => p.workflowId === workflowId)
}
