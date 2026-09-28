'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import { useDemoRole } from '@/lib/demo-role-context'

export function UserProfileMenu() {
  const { user } = useDemoRole()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.replace('/login')
      router.refresh()
    } catch {
      setSigningOut(false)
    }
  }

  if (!user) return null

  return (
    <div className="topbar-profile" ref={rootRef}>
      <button
        type="button"
        className="topbar-profile-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <UserAvatar size="sm" />
        <span className="topbar-profile-text">
          <strong>{user.name}</strong>
          <span>{user.roleLabel}</span>
        </span>
        <ChevronDown size={16} className={open ? 'topbar-profile-chevron-open' : ''} />
      </button>

      {open ? (
        <div className="topbar-profile-menu" role="menu">
          <div className="topbar-profile-header">
            <UserAvatar size="md" className="topbar-profile-avatar-lg" />
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>

          <dl className="topbar-profile-details">
            <div>
              <dt>Role</dt>
              <dd>{user.title}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{user.department}</dd>
            </div>
            <div>
              <dt>Office</dt>
              <dd>{user.office}</dd>
            </div>
            <div>
              <dt>Employee ID</dt>
              <dd>{user.employeeId}</dd>
            </div>
            <div>
              <dt>Manager</dt>
              <dd>{user.manager}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="topbar-profile-sign-out"
            onClick={handleSignOut}
            disabled={signingOut}
            role="menuitem"
          >
            <LogOut size={16} />
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
