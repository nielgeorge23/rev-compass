import type { RecoveryPackage } from '@/lib/revcompass/types'
import { InsufficientEvidenceBanner } from '@/components/package/insufficient-evidence-banner'

export function RootCausePanel({ pkg }: { pkg: RecoveryPackage }) {
  return (
    <div className="detail-panel">
      {pkg.denialRootCause ? (
        <>
          <span className="eyebrow">Denial root cause</span>
          <p className="detail-text">{pkg.denialRootCause}</p>
        </>
      ) : null}
      {pkg.varianceRootCause ? (
        <>
          <span className="eyebrow" style={{ marginTop: pkg.denialRootCause ? 16 : 0 }}>
            Underpayment / variance root cause
          </span>
          <p className="detail-text">{pkg.varianceRootCause}</p>
        </>
      ) : null}
      {pkg.needsPatientDocValidation && pkg.patientDocNote ? (
        <div className="doc-flag-banner">
          Needs patient-record validation — {pkg.patientDocNote}
        </div>
      ) : null}
      {pkg.insufficientEvidence ? <InsufficientEvidenceBanner /> : null}
      <span className="eyebrow" style={{ marginTop: 16 }}>Payer behavior context</span>
      <div className="payer-context-box">{pkg.payerContext}</div>
    </div>
  )
}
