import type { WorkflowScenario } from './types'

export const WORKFLOWS: Record<string, WorkflowScenario> = {
  '3a': {
    id: '3a',
    label: '3A · Payer Fingerprint',
    packageId: 'RC-00271',
    scenario:
      'BCBS spinal-fusion claims start denying at triple the normal rate. The fingerprint catches the shift before the volume does — and the disposition engine recommends a coordinated appeal for the full cohort.',
    gate: 'Analyst reviews the cohort evidence and confidence, then approves the appeal for all 163 claims.',
    notes: [
      '163 new BCBS spinal-fusion claims land as VarianceRecords, all carrying denial code CO-50.',
      "BCBS's fingerprint shows the denial rate for this CPT jumped from 4% to 12% starting June 3 — flagged as drift before the volume builds further.",
      'All 163 claims share the same payer × CPT × CARC × date-range signature and are grouped into one candidate cohort.',
      'Vertex AI Search finds BCBS quietly changed its policy wording on May 28 — conservative therapy is now required before surgery.',
      'Historical overturn rate of 78% for this payer × reason combination supports a single appeal recommendation for the full cohort.',
      'One cohort, one disposition: Appeal. On approval, one filing package per claim is queued.',
      "The overturn rate on appealed claims becomes BCBS's new appeal baseline for this exact policy wording.",
    ],
    stats: [
      ['$1.7M', 'Exposure'],
      ['$1.1M', 'Recoverable'],
      ['89%', 'Confidence'],
      ['12 days', 'Time to detection'],
    ],
  },
  '3b': {
    id: '3b',
    label: '3B · Appeal Engine',
    packageId: 'RC-00428',
    scenario:
      'Aetna quietly downgrades 52 claims from DRG 871 to DRG 872. The disposition engine turns 52 separate mysteries into one appeal with a positive expected value.',
    gate: 'Analyst reviews the drafted appeal and evidence, then approves submission for all 52 claims at once.',
    notes: [
      '52 VarianceRecords land: Aetna, DRG 871 → 872, downgrade, $899K total exposure.',
      'The downgrade rate for this DRG pair has climbed from 4% to 61% in eight weeks — a drift alert is raised alongside the denials.',
      'All 52 claims share payer × DRG-pair × reason and are grouped into one cohort with one root-cause hypothesis.',
      'Contract §4.2 and Policy P-118 confirm reassignment requires a medical-record review — one Aetna skipped on every claim.',
      'EV(appeal) = $899K × 0.82 − 52 × $45 ≈ $735K → Appeal, High confidence. EV(write-off) = 0 is clearly dominated.',
      'One consolidated appeal is drafted for all 52 claims, citing Contract §4.2 and Policy P-118, and submitted after approval.',
      "47 of 52 overturn — $812K recovered. The result feeds back into Aetna's fingerprint and the recovery-probability model.",
    ],
    stats: [
      ['52', 'Claims'],
      ['$899K', 'Exposure'],
      ['$812K', 'Recovered'],
      ['91%', 'Confidence'],
    ],
  },
  '3c': {
    id: '3c',
    label: '3C · Contract Variance',
    packageId: 'RC-00512',
    scenario:
      '412 orthopedic claims have been paid at an outdated contracted rate since July. The variance engine catches the pattern behind the shortfall, not just each individual paycheck.',
    gate: 'Analyst reviews the escalation package before it goes to the payer relationship team — this is a rate correction, not an appeal.',
    notes: [
      'The contract-management system reports expected $12,000 vs. actual $9,000 on each claim — a $3,000 variance × 412 claims.',
      'The underpayment rate for this DRG/payer combination has been rising steadily since July 1 — flagged as sustained, not a one-off.',
      "All 412 claims share payer × DRG × variance-type and are grouped into one cohort: 'outdated contracted rate.'",
      'A contract amendment effective July 1 is found in the policy store — the payment system was never updated to match it.',
      'Expected value across the cohort is strongly positive at the cohort level — recommend payer escalation, not 412 individual appeals.',
      'One escalation request is drafted for all 412 claims, citing the contract amendment, and routed to the payer relationship team.',
      'Recovery is tracked against the $620K exposure, and the contract rate table is flagged for correction going forward.',
    ],
    stats: [
      ['412', 'Claims'],
      ['$620K', 'Exposure'],
      ['Outdated rate', 'Root cause'],
      ['Escalation', 'Recommended action'],
    ],
  },
}

export const WORKFLOW_LIST = Object.values(WORKFLOWS)
