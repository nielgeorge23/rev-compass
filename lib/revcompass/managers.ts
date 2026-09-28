import { getProfileAvatar } from './profile-avatars'
import type { PackageManager, RecoveryPackage } from './types'

export const MANAGERS: Record<string, PackageManager> = {
  'draymond-green': {
    id: 'draymond-green',
    name: 'Draymond Green',
    title: 'Revenue Integrity Manager',
    avatar: getProfileAvatar('draymond-green'),
  },
  'maria-chen': {
    id: 'maria-chen',
    name: 'Maria Chen',
    title: 'Manager, Denials & Appeals',
  },
  'james-patel': {
    id: 'james-patel',
    name: 'James Patel',
    title: 'Manager, Payer Appeals',
  },
  'lauren-brooks': {
    id: 'lauren-brooks',
    name: 'Lauren Brooks',
    title: 'Manager, Clinical Validation / CDI',
  },
  'kevin-shah': {
    id: 'kevin-shah',
    name: 'Kevin Shah',
    title: 'Manager, Contract Management & Underpayments',
  },
  'nicole-harris': {
    id: 'nicole-harris',
    name: 'Nicole Harris',
    title: 'Manager, Clinical Denials',
  },
  'amanda-lee': {
    id: 'amanda-lee',
    name: 'Amanda Lee',
    title: 'Patient Access Manager, Authorization & Scheduling',
  },
}

export function formatManagerLabel(manager: PackageManager): string {
  return `${manager.name} — ${manager.title}`
}

export function getAllManagers(): PackageManager[] {
  return Object.values(MANAGERS).sort((a, b) => a.name.localeCompare(b.name))
}

export function getManagersForPackage(pkg: RecoveryPackage): PackageManager[] {
  const options = [pkg.recommendedOwner]
  if (pkg.alternateOwners?.length) {
    options.push(...pkg.alternateOwners)
  }
  return options
}

export function getManagerById(id: string): PackageManager | null {
  return MANAGERS[id] ?? null
}
