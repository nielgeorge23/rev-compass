'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, Menu } from 'lucide-react'
import { AppSidebar } from '@/components/app-sidebar'
import { HomeView } from '@/components/home-view'
import { ConfigView } from '@/components/views/config-view'
import { FingerprintsView } from '@/components/views/fingerprints-view'
import { OutcomesView } from '@/components/views/outcomes-view'
import { PackagesView } from '@/components/views/packages-view'
import { ManagerPackagesView } from '@/components/views/manager-packages-view'
import { DirectorDashboardView } from '@/components/views/director-dashboard-view'
import { StructureView } from '@/components/views/structure-view'
import { UserProfileMenu } from '@/components/topbar-user-menu'
import { DemoRoleProvider, useDemoRole } from '@/lib/demo-role-context'
import { EngagementConfigProvider, useEngagementConfig } from '@/lib/engagement-config-context'
import { OwnerAssignmentProvider } from '@/lib/owner-assignment-context'
import { WorkAssignmentProvider } from '@/lib/work-assignment-context'
import { ClaimResolutionProvider } from '@/lib/claim-resolution-context'
import { CohortReviewProvider } from '@/lib/cohort-review-context'
import { buildNavItems, VIEW_LABELS, type View } from '@/lib/navigation'
import type { WorklistSegment } from '@/lib/revcompass/types'

function isView(value: string | null): value is View {
  return value !== null && value in VIEW_LABELS
}

function isWorklistSegment(value: string | null): value is WorklistSegment {
  return value === 'all' || value === 'ready' || value === 'needs_review' || value === 'mine'
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null
  return <div className="demo-toast show">{message}</div>
}

type NavigateParams = {
  packageId?: string
  segment?: WorklistSegment
}

function AppRouter() {
  const { role } = useDemoRole()
  const { manualReviewCount } = useEngagementConfig()
  const navItems = buildNavItems(manualReviewCount)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [view, setView] = useState<View>('home')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [packageId, setPackageId] = useState<string | null>(null)
  const [worklistSegment, setWorklistSegment] = useState<WorklistSegment>('all')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const v = searchParams.get('view')
    const pkg = searchParams.get('package')
    const segment = searchParams.get('segment')

    if (v === 'review' || v === 'workflows') {
      setView('packages')
      if (v === 'review') setWorklistSegment('needs_review')
    } else if (isView(v)) {
      setView(v)
    }

    if (pkg) setPackageId(pkg)
    if (isWorklistSegment(segment)) setWorklistSegment(segment)
  }, [searchParams])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 3400)
  }, [])

  const navigate = useCallback(
    (nextView: View, params?: NavigateParams) => {
      setView(nextView)
      if (params?.packageId) setPackageId(params.packageId)
      if (params?.segment) {
        setWorklistSegment(params.segment)
      } else if (nextView === 'packages') {
        setWorklistSegment('all')
      }

      const query = new URLSearchParams()
      query.set('view', nextView)
      if (params?.packageId) query.set('package', params.packageId)
      if (params?.segment) query.set('segment', params.segment)
      router.replace(`/?${query.toString()}`, { scroll: false })
    },
    [router],
  )

  return (
    <main className="app-shell">
      <AppSidebar
        view={view}
        navItems={navItems}
        onNavigate={(v) => navigate(v)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="main-shell">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumbs">
            <span>RevCompass</span>
            <ChevronRight size={14} />
            <strong>
              {view === 'packages' && role === 'director'
                ? 'Director dashboard'
                : view === 'packages' && role === 'manager'
                  ? 'Manager worklist'
                  : VIEW_LABELS[view]}
            </strong>
          </div>
          <div className="topbar-right">
            <span className="sync">
              <span className="sync-dot" /> Synthetic data · MVP demo
            </span>
            <UserProfileMenu />
          </div>
        </header>
        <div className={view === 'home' ? 'content content-home' : 'content'}>
          {view === 'home' && <HomeView onNavigate={navigate} />}
          {view === 'packages' && role === 'director' && (
            <DirectorDashboardView initialPackageId={packageId} onToast={showToast} />
          )}
          {view === 'packages' && role === 'manager' && (
            <ManagerPackagesView
              initialPackageId={packageId}
              initialSegment={worklistSegment}
              onToast={showToast}
            />
          )}
          {view === 'packages' && role === 'analyst' && (
            <PackagesView
              initialPackageId={packageId}
              initialSegment={worklistSegment}
              onToast={showToast}
              variant="analyst"
            />
          )}
          {view === 'fingerprints' && <FingerprintsView onNavigate={navigate} />}
          {view === 'outcomes' && <OutcomesView />}
          {view === 'structure' && <StructureView />}
          {view === 'config' && <ConfigView />}
        </div>
      </div>
      <Toast message={toast} />
    </main>
  )
}

export default function Page() {
  return (
    <DemoRoleProvider>
      <EngagementConfigProvider>
        <OwnerAssignmentProvider>
          <WorkAssignmentProvider>
            <CohortReviewProvider>
              <ClaimResolutionProvider>
                <Suspense fallback={<div className="content">Loading…</div>}>
                  <AppRouter />
                </Suspense>
              </ClaimResolutionProvider>
            </CohortReviewProvider>
          </WorkAssignmentProvider>
        </OwnerAssignmentProvider>
      </EngagementConfigProvider>
    </DemoRoleProvider>
  )
}
