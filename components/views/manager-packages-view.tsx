'use client'

import { PackagesView } from '@/components/views/packages-view'

type ManagerPackagesViewProps = {
  initialPackageId?: string | null
  initialSegment?: import('@/lib/revcompass/types').WorklistSegment
  onToast?: (message: string) => void
}

export function ManagerPackagesView(props: ManagerPackagesViewProps) {
  return <PackagesView {...props} variant="manager" />
}
