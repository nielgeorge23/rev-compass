'use client'

import { useEffect, useState } from 'react'
import {
  LockKeyhole,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react'
import { logoSvg, PRODUCT_NAME, PRODUCT_TAGLINE } from '@/lib/brand'
import { useDemoRole } from '@/lib/demo-role-context'
import type { NavItem, View } from '@/lib/navigation'

const STORAGE_KEY = 'revcompass-sidebar-collapsed'
const EXPANDED_WIDTH = '280px'
const COLLAPSED_WIDTH = '64px'

function readStoredCollapsed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeStoredCollapsed(value: boolean) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    /* storage may be unavailable */
  }
}

function applySidebarWidth(collapsed: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.style.setProperty(
    '--sidebar-width',
    collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
  )
}

type AppSidebarProps = {
  view: View
  navItems: NavItem[]
  onNavigate: (view: View) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export function AppSidebar({
  view,
  navItems,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const { user } = useDemoRole()
  const [collapsed, setCollapsed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = readStoredCollapsed()
    setCollapsed(stored)
    setHydrated(true)
    applySidebarWidth(stored)
  }, [])

  function toggle() {
    setCollapsed((prev) => {
      const next = !prev
      writeStoredCollapsed(next)
      applySidebarWidth(next)
      return next
    })
  }

  function handleNavigate(id: View) {
    onNavigate(id)
    onMobileClose()
  }

  const showText = hydrated ? !collapsed : true
  const isCollapsed = hydrated && collapsed

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      ) : null}
      <aside
        className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}
        style={{ width: 'var(--sidebar-width)' }}
        aria-label="Primary navigation"
      >
        <div className={`sidebar-header ${isCollapsed ? 'sidebar-header-collapsed' : ''}`}>
          <div className={`sidebar-brand-row ${isCollapsed ? 'sidebar-brand-row-collapsed' : ''}`}>
            {showText ? (
              <div className="sidebar-logo" aria-hidden>
                {logoSvg('#FFFFFF')}
              </div>
            ) : null}
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggle}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            <button
              type="button"
              className="sidebar-mobile-close"
              onClick={onMobileClose}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>
          {showText ? (
            <>
              <p className="sidebar-product">{PRODUCT_NAME}</p>
              <p className="sidebar-tagline">{PRODUCT_TAGLINE}</p>
              <hr className="sidebar-divider" />
            </>
          ) : (
            <hr className="sidebar-divider sidebar-divider-collapsed" />
          )}
        </div>

        <nav>
          {navItems.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              type="button"
              className={view === id ? 'nav-active' : ''}
              onClick={() => handleNavigate(id)}
              aria-label={label}
              title={isCollapsed ? label : undefined}
            >
              <Icon size={17} />
              {showText ? <span>{label}</span> : null}
              {showText && badge ? <b>{badge}</b> : null}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          {showText ? (
            <div className="privacy-note">
              <LockKeyhole size={14} />
              <span>
                HIPAA-ready
                <br />
                <small>Synthetic workspace</small>
              </span>
            </div>
          ) : null}
          <div className={`user-row ${isCollapsed ? 'user-row-collapsed' : ''}`}>
            {showText && user ? (
              <div className="sidebar-user-summary">
                <strong>{user.name}</strong>
                <span>{user.roleLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      </aside>
    </>
  )
}

export type { View }
