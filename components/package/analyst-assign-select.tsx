'use client'

import { getAllAnalysts } from '@/lib/revcompass/analysts'

type AnalystAssignSelectProps = {
  value: string
  onChange: (analystId: string) => void
  disabled?: boolean
}

export function AnalystAssignSelect({ value, onChange, disabled }: AnalystAssignSelectProps) {
  const analysts = getAllAnalysts()

  return (
    <select
      className="analyst-assign-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Assigned analyst"
    >
      <option value="">Select analyst…</option>
      {analysts.map((analyst) => (
        <option key={analyst.id} value={analyst.id}>
          {analyst.name}
        </option>
      ))}
    </select>
  )
}
