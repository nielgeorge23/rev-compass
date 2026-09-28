'use client'

import {
  CLAIM_RESOLUTION_OPTIONS,
  getResolutionLabel,
} from '@/lib/revcompass/claim-resolution'
import type { ClaimResolutionStatus } from '@/lib/revcompass/types'

type ClaimResolutionSelectProps = {
  value: ClaimResolutionStatus
  onChange: (status: ClaimResolutionStatus) => void
  disabled?: boolean
  readOnly?: boolean
}

export function ClaimResolutionSelect({
  value,
  onChange,
  disabled,
  readOnly,
}: ClaimResolutionSelectProps) {
  if (readOnly) {
    return (
      <span className={`claim-resolution-pill claim-resolution-${value}`}>
        {getResolutionLabel(value)}
      </span>
    )
  }

  return (
    <select
      className={`claim-resolution-select claim-resolution-${value}`}
      value={value}
      onChange={(e) => onChange(e.target.value as ClaimResolutionStatus)}
      disabled={disabled}
      aria-label="Resolution progress"
    >
      {CLAIM_RESOLUTION_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
