'use client'

import { formatManagerLabel, getAllManagers } from '@/lib/revcompass/managers'
import type { PackageManager, RecoveryPackage } from '@/lib/revcompass/types'

type OwnerAssignSelectProps = {
  pkg: RecoveryPackage
  value: PackageManager
  onChange: (manager: PackageManager) => void
  disabled?: boolean
}

export function OwnerAssignSelect({ pkg, value, onChange, disabled }: OwnerAssignSelectProps) {
  const options = getAllManagers()

  return (
    <select
      className="owner-assign-select"
      value={value.id}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => {
        const manager = options.find((m) => m.id === e.target.value)
        if (manager) onChange(manager)
      }}
      aria-label={`Assign ${pkg.code} to manager`}
    >
      {options.map((manager) => (
        <option key={manager.id} value={manager.id}>
          {formatManagerLabel(manager)}
        </option>
      ))}
    </select>
  )
}
