import { ArrowUpRight, Database, FileText, ShieldCheck } from 'lucide-react'
import { DispositionBadge, EngineBadge, Pill } from '@/components/ui/pill'
import type { RecoveryPackage } from '@/lib/revcompass/types'

export function PackageRow({
  pkg,
  selected,
  onSelect,
}: {
  pkg: RecoveryPackage
  selected: boolean
  onSelect: () => void
}) {
  const MarkIcon = pkg.icon === 'shield' ? ShieldCheck : pkg.icon === 'contract' ? FileText : Database
  return (
    <button
      type="button"
      className={`package-row ${selected ? 'package-active' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className={`package-mark ${pkg.icon !== 'shield' ? 'quiet' : ''}`}>
        <MarkIcon size={21} />
      </div>
      <div className="package-main">
        <div className="package-meta">
          <Pill tone={pkg.pill}>{pkg.pillLabel}</Pill>
          <EngineBadge engine={pkg.engine} />
          <DispositionBadge label={pkg.dispositionLabel} />
          <span>{pkg.payer.split(' ')[0].toUpperCase()}</span>
          <span>Updated {pkg.updated}</span>
        </div>
        <h3>{pkg.title}</h3>
        <p>
          {pkg.claimCount} claims · {pkg.summary}
        </p>
      </div>
      <div className="package-money">
        <strong>{pkg.exposure}</strong>
        <span>exposure</span>
      </div>
      <div className="package-confidence">
        <span>Confidence</span>
        <strong>{pkg.confidence}%</strong>
        <div className="bar">
          <i style={{ width: `${pkg.confidence}%` }} />
        </div>
      </div>
      <ArrowUpRight className="row-arrow" size={18} />
    </button>
  )
}
