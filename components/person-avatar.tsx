'use client'

import Image from 'next/image'

type PersonAvatarProps = {
  name: string
  initials: string
  avatar?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PersonAvatar({
  name,
  initials,
  avatar,
  size = 'md',
  className = '',
}: PersonAvatarProps) {
  const dimension = size === 'sm' ? 28 : size === 'lg' ? 40 : 30
  const sizeClass =
    size === 'sm' ? 'top-avatar user-avatar' : size === 'lg' ? 'avatar user-avatar person-avatar-lg' : 'avatar user-avatar'

  return (
    <div className={`${sizeClass} ${className}`.trim()} aria-hidden>
      {avatar ? (
        <Image
          src={avatar}
          alt={name}
          width={dimension}
          height={dimension}
          className="user-avatar-image"
        />
      ) : null}
      <span className={`user-avatar-fallback ${avatar ? '' : 'user-avatar-fallback-only'}`}>
        {initials}
      </span>
    </div>
  )
}
