export function Pill({
  children,
  tone = 'slate',
}: {
  children: React.ReactNode
  tone?: 'slate' | 'teal' | 'amber' | 'green' | 'red'
}) {
  return <span className={`pill pill-${tone}`}>{children}</span>
}

export function DispositionBadge({ label }: { label: string }) {
  return <span className="disposition-badge">{label}</span>
}

export function EngineBadge({ engine }: { engine: string }) {
  const labels: Record<string, string> = {
    fingerprint: 'Fingerprint',
    disposition: 'Disposition',
    contract_variance: 'Contract variance',
  }
  return <span className="engine-badge">{labels[engine] ?? engine}</span>
}
