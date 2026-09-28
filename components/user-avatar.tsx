'use client'

import { useDemoRole } from '@/lib/demo-role-context'
import { PersonAvatar } from '@/components/person-avatar'

type UserAvatarProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function UserAvatar({ size = 'md', className = '' }: UserAvatarProps) {
  const { user } = useDemoRole()

  return (
    <PersonAvatar
      name={user?.name ?? 'User'}
      initials={user?.initials ?? '?'}
      avatar={user?.avatar}
      size={size}
      className={className}
    />
  )
}
