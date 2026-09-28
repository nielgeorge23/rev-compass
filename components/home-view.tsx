'use client'

import { BarChart3, Fingerprint, Layers, LockKeyhole } from 'lucide-react'
import { HeroBanner } from '@/components/hero-banner'
import { PwcCard, PwcCardCategory } from '@/components/pwc-card'
import { Metric } from '@/components/ui/metric'
import { COLORS, PRODUCT_NAME, PRODUCT_TAGLINE } from '@/lib/brand'
import { useEngagementConfig } from '@/lib/engagement-config-context'
import { OPEN_EXPOSURE_TOTAL, RECOVERY_PACKAGES } from '@/lib/revcompass/packages'
import type { View } from '@/lib/navigation'
import type { WorklistSegment } from '@/lib/revcompass/types'

type HomeViewProps = {
  onNavigate: (view: View, params?: { packageId?: string; segment?: WorklistSegment }) => void
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { manualReviewCount } = useEngagementConfig()

  return (
    <div className="home-page">
      <HeroBanner
        title={PRODUCT_NAME}
        subtitle={`Pattern-level, evidence-backed resolution decisions above the EHR. ${PRODUCT_TAGLINE}.`}
      />

      <div className="home-body">
        <div className="home-body-inner">
          <section className="home-kpi-row">
            <Metric label="Open exposure" value={OPEN_EXPOSURE_TOTAL} note={`${RECOVERY_PACKAGES.length} active cohorts`} accent="var(--ink)" />
            <Metric label="Expected resolution" value="$2.5M" note="Across all engines" accent="var(--teal)" />
            <Metric label="Drift alerts" value="2" note="BCBS + Aetna" accent="var(--orange)" />
            <Metric
              label="Manual review"
              value={String(manualReviewCount)}
              note="In Cohorts worklist"
              accent="var(--green)"
            />
          </section>

          <section className="home-section">
            <div className="home-section-head">
              <p className="home-section-title">Start here</p>
              <p className="home-section-lede">
                Monitor payer drift, work resolution cohorts, or explore how the platform is built.
              </p>
            </div>
            <div className="home-start-here-row">
              <PwcCard className="home-action-card">
                <div className="home-card-icon" aria-hidden>
                  <Fingerprint size={20} />
                </div>
                <PwcCardCategory>MONITOR</PwcCardCategory>
                <div className="pwc-card-heading">Payer fingerprints</div>
                <p className="pwc-card-copy">
                  Drift alerts and baseline vs. current denial patterns across BCBS, Aetna, UHC, and Cigna.
                </p>
                <button
                  type="button"
                  className="pwc-card-button"
                  onClick={() => onNavigate('fingerprints')}
                >
                  Open fingerprints →
                </button>
              </PwcCard>
              <PwcCard featured className="home-action-card home-action-card-featured">
                <div className="home-card-icon home-card-icon-featured" aria-hidden>
                  <BarChart3 size={20} />
                </div>
                <PwcCardCategory>Worklist</PwcCardCategory>
                <div className="pwc-card-heading">Resolution cohorts</div>
                <p className="pwc-card-copy">
                  One worklist for all cohorts — ready to act, needs manual review, and your assigned queue.
                  {manualReviewCount > 0
                    ? ` ${manualReviewCount} cohort${manualReviewCount === 1 ? '' : 's'} need review now.`
                    : ''}
                </p>
                <div className="home-card-actions">
                  <button
                    type="button"
                    className="pwc-card-button"
                    onClick={() => onNavigate('packages')}
                  >
                    Open cohorts →
                  </button>
                  {manualReviewCount > 0 ? (
                    <button
                      type="button"
                      className="pwc-card-button pwc-card-button-secondary"
                      onClick={() => onNavigate('packages', { segment: 'needs_review' })}
                    >
                      Review {manualReviewCount} cohort{manualReviewCount === 1 ? '' : 's'} →
                    </button>
                  ) : null}
                </div>
              </PwcCard>
              <PwcCard className="home-action-card">
                <div className="home-card-icon" aria-hidden>
                  <Layers size={20} />
                </div>
                <PwcCardCategory>Architecture</PwcCardCategory>
                <div className="pwc-card-heading">How RevCompass runs</div>
                <p className="pwc-card-copy">
                  Cohort assembly, three engines, seven-agent pipeline, and human approval gate.
                </p>
                <button type="button" className="pwc-card-button" onClick={() => onNavigate('structure')}>
                  View structure →
                </button>
              </PwcCard>
            </div>
          </section>

          <section className="home-section home-reference-section">
            <p className="home-section-title">Reference</p>
            <div className="home-reference-bar">
              <div className="home-reference-icon" aria-hidden>
                <LockKeyhole size={18} />
              </div>
              <div className="home-reference-copy">
                <strong>Synthetic demo workspace</strong>
                <span>
                  HIPAA-ready mock data for BCBS, Aetna, UHC, Cigna, and contract variance cohorts ·{' '}
                  <span className="home-reference-status">
                    <span className="sync-dot" /> All systems operational
                  </span>
                </span>
              </div>
              <span className="home-reference-tag" style={{ color: COLORS.success_green }}>
                Demo environment
              </span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
