import type { ReactNode } from 'react'
import { COLORS } from '@/lib/brand'

type PwcCardProps = {
  children: ReactNode
  className?: string
  featured?: boolean
}

export function PwcCard({ children, className = '', featured = false }: PwcCardProps) {
  if (featured) {
    return (
      <div className={`pwc-card pwc-card-featured ${className}`.trim()}>
        {children}
      </div>
    )
  }

  return <div className={`pwc-card ${className}`.trim()}>{children}</div>
}

export function PwcCardCategory({
  children,
  tone = 'accent',
}: {
  children: ReactNode
  tone?: 'accent' | 'success'
}) {
  return (
    <span
      className="pwc-card-category"
      style={{ color: tone === 'success' ? COLORS.success_green : COLORS.charcoal }}
    >
      {children}
    </span>
  )
}
