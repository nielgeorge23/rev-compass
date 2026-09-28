import {
  BarChart3,
  Fingerprint,
  Home,
  Layers,
  LineChart,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { RECOVERY_PACKAGES } from '@/lib/revcompass/packages'
import type { View } from '@/lib/revcompass/types'

export type { View }

export type NavItem = {
  id: View
  label: string
  icon: LucideIcon
  badge?: string
}

export function buildNavItems(manualReviewCount: number): NavItem[] {
  const packagesBadge =
    manualReviewCount > 0
      ? `${RECOVERY_PACKAGES.length} · ${manualReviewCount} review`
      : String(RECOVERY_PACKAGES.length)

  return [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'packages', label: 'Cohorts', icon: BarChart3, badge: packagesBadge },
    { id: 'fingerprints', label: 'Payer fingerprints', icon: Fingerprint },
    { id: 'outcomes', label: 'Outcomes', icon: LineChart },
    { id: 'structure', label: 'Structure', icon: Layers },
    { id: 'config', label: 'Configuration', icon: Settings },
  ]
}

export const VIEW_LABELS: Record<View, string> = {
  home: 'Home',
  packages: 'Resolution cohorts',
  fingerprints: 'Payer fingerprints',
  outcomes: 'Outcome analytics',
  structure: 'Structure',
  config: 'Configuration',
}
