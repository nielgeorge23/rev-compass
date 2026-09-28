export function Metric({
  label,
  value,
  note,
  accent,
}: {
  label: string
  value: string
  note: string
  accent: string
}) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <strong style={{ color: accent }}>{value}</strong>
      <span className="metric-note">{note}</span>
    </div>
  )
}
