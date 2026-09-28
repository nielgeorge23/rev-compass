import type { PayerExposureRow, PayerFingerprint } from './types'

export const FINGERPRINTS: PayerFingerprint[] = [
  {
    id: 'bcbs',
    name: 'BCBS Commercial',
    shortName: 'BCBS',
    baseline: { denialRate: '4.0%', daysToPay: '22d', overturnRate: '62%', downgradeRate: '2.1%' },
    current: { denialRate: '12.0%', daysToPay: '34d', overturnRate: '78%', downgradeRate: '2.8%' },
    driftAlert: 'Spinal fusion CO-50 denials up 3× since June 3 — policy change suspected',
    topSignal: 'Conservative therapy documentation gap',
    signalStrength: 0.89,
    editVectors: [
      { label: 'Medical necessity (CO-50)', pct: '61%' },
      { label: 'Authorization', pct: '19%' },
      { label: 'Coding edit', pct: '12%' },
      { label: 'Other', pct: '8%' },
    ],
    resolutionProfile: [
      { label: 'Overturn rate', value: '78%' },
      { label: 'Median response', value: '21 days' },
      { label: 'Best evidence', value: 'Policy + clinical criteria' },
      { label: 'Last refreshed', value: 'Today, 09:15' },
    ],
    linkedPackageId: 'RC-00271',
    sparkline: [28, 32, 30, 38, 42, 55, 62, 74, 68, 82, 78, 91, 88, 97],
  },
  {
    id: 'aetna',
    name: 'Aetna Commercial',
    shortName: 'Aetna',
    baseline: { denialRate: '4.2%', daysToPay: '18d', overturnRate: '70%', downgradeRate: '4.0%' },
    current: { denialRate: '12.0%', daysToPay: '34d', overturnRate: '82%', downgradeRate: '61%' },
    driftAlert: 'DRG 871→872 downgrade rate climbed from 4% to 61% in eight weeks',
    topSignal: 'Clinical indicator mismatch',
    signalStrength: 0.91,
    editVectors: [
      { label: 'DRG downgrade', pct: '61%' },
      { label: 'Medical necessity', pct: '23%' },
      { label: 'Discharge status', pct: '11%' },
      { label: 'Other', pct: '5%' },
    ],
    resolutionProfile: [
      { label: 'Overturn rate', value: '82%' },
      { label: 'Median response', value: '18 days' },
      { label: 'Best evidence', value: 'Clinical + contract' },
      { label: 'Last refreshed', value: 'Today, 09:42' },
    ],
    linkedPackageId: 'RC-00428',
    sparkline: [36, 42, 38, 55, 48, 62, 58, 74, 68, 82, 78, 91, 84, 97],
  },
  {
    id: 'uhc',
    name: 'UnitedHealthcare',
    shortName: 'UHC',
    baseline: { denialRate: '6.0%', daysToPay: '19d', overturnRate: '77%', downgradeRate: '3.0%' },
    current: { denialRate: '7.0%', daysToPay: '20d', overturnRate: '77%', downgradeRate: '3.0%' },
    topSignal: 'Contract rate configuration',
    signalStrength: 0.74,
    editVectors: [
      { label: 'Contract underpayment', pct: '44%' },
      { label: 'Authorization', pct: '31%' },
      { label: 'Medical necessity', pct: '15%' },
      { label: 'Other', pct: '10%' },
    ],
    resolutionProfile: [
      { label: 'Overturn rate', value: '77%' },
      { label: 'Median response', value: '20 days' },
      { label: 'Best evidence', value: 'Contract amendment' },
      { label: 'Last refreshed', value: 'Yesterday, 16:18' },
    ],
    linkedPackageId: 'RC-00512',
    sparkline: [40, 38, 42, 44, 46, 48, 50, 52, 49, 51, 53, 55, 54, 56],
  },
  {
    id: 'cigna',
    name: 'Cigna Commercial',
    shortName: 'Cigna',
    baseline: { denialRate: '5.5%', daysToPay: '21d', overturnRate: '—', downgradeRate: '8.0%' },
    current: { denialRate: '7.2%', daysToPay: '23d', overturnRate: '—', downgradeRate: '12.0%' },
    topSignal: 'Insufficient history for DRG 291',
    signalStrength: 0.42,
    editVectors: [
      { label: 'DRG downcode', pct: '52%' },
      { label: 'Medical necessity', pct: '28%' },
      { label: 'Authorization', pct: '12%' },
      { label: 'Other', pct: '8%' },
    ],
    resolutionProfile: [
      { label: 'Overturn rate', value: 'Insufficient history' },
      { label: 'Median response', value: '—' },
      { label: 'Best evidence', value: 'Patient record validation' },
      { label: 'Last refreshed', value: 'Today, 07:30' },
    ],
    linkedPackageId: 'RC-00488',
    sparkline: [32, 34, 33, 36, 38, 40, 39, 42, 44, 43, 45, 47, 46, 48],
  },
]

export const PAYER_EXPOSURE_ROWS: PayerExposureRow[] = [
  { payer: 'Aetna', openPackages: 1, exposure: '$899K', denialTrend: '↑ 4% → 12%', overturnRate: '82%', trendTone: 'bad' },
  { payer: 'BCBS', openPackages: 1, exposure: '$1.7M', denialTrend: '↑ 4% → 12%', overturnRate: '78%', trendTone: 'bad' },
  { payer: 'UHC', openPackages: 2, exposure: '$830K', denialTrend: '→ stable', overturnRate: '77%', trendTone: 'stable' },
  { payer: 'Cigna', openPackages: 1, exposure: '$264K', denialTrend: 'insufficient history', overturnRate: '—', trendTone: 'muted' },
]

export function getFingerprint(id: string) {
  return FINGERPRINTS.find((f) => f.id === id) ?? FINGERPRINTS[0]
}
