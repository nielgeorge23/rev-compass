import { ExternalLink, Layers } from 'lucide-react'
import { AgentTimeline } from '@/components/pipeline/agent-timeline'
import { PwcCard, PwcCardCategory } from '@/components/pwc-card'
import { DATA_FEEDS, VARIANCE_RECORD_FORMULA } from '@/lib/revcompass/types'
import { ORCHESTRATOR_COPY } from '@/lib/revcompass/agents'

export function StructureView() {
  return (
    <section className="view-page structure-view">
      <div className="eyebrow">
        <Layers size={14} /> Platform architecture
      </div>
      <h1>
        How RevCompass <em>runs.</em>
      </h1>
      <p className="hero-copy structure-lede">
        RevCompass does not replace Epic or any system of record — it sits above them. The{' '}
        <strong>cohort</strong> is the decision unit; on approval it produces one payer filing per
        claim.
      </p>

      <div className="cohort-funnel-card">
        <span className="eyebrow">Cohort assembly</span>
        <div className="cohort-funnel">
          <div className="cohort-funnel-step">
            <strong>163</strong>
            <span>individual claims</span>
          </div>
          <span className="cohort-funnel-arrow">→</span>
          <div className="cohort-funnel-step cohort-funnel-step-accent">
            <strong>1</strong>
            <span>action-ready cohort</span>
          </div>
          <span className="cohort-funnel-arrow">→</span>
          <div className="cohort-funnel-step">
            <strong>163</strong>
            <span>filing actions on approval</span>
          </div>
        </div>
        <p className="structure-caption">
          Dispositions: appeal · resubmit · write-off · escalate · prevent — one recommendation per
          cohort, decided once as a unit.
        </p>
        <a className="architecture-link" href="/architecture.html" target="_blank" rel="noopener noreferrer">
          <ExternalLink size={16} /> Open full consolidated architecture
        </a>
      </div>

      <div className="structure-section">
        <div className="section-heading-inline">
          <h2>Three engines</h2>
        </div>
        <p className="section-note-inline">
          RevCompass converts fragmented denials and underpayments into pattern-level resolution
          decisions through three complementary intelligence engines.
        </p>
        <div className="structure-engines-row">
          <PwcCard>
            <PwcCardCategory>Engine 1</PwcCardCategory>
            <div className="pwc-card-heading pwc-card-heading-sm">Payer fingerprint</div>
            <p className="pwc-card-copy">
              Detect when a payer is behaving differently than normal — drift before volume builds.
            </p>
          </PwcCard>
          <PwcCard featured>
            <PwcCardCategory>Engine 2</PwcCardCategory>
            <div className="pwc-card-heading pwc-card-heading-sm">Denial disposition</div>
            <p className="pwc-card-copy">
              Recommend appeal, resubmit, write-off, escalate, or prevent — with expected value and
              cited evidence.
            </p>
          </PwcCard>
          <PwcCard>
            <PwcCardCategory>Engine 3</PwcCardCategory>
            <div className="pwc-card-heading pwc-card-heading-sm">Contract variance</div>
            <p className="pwc-card-copy">
              Catch underpayment patterns behind contract rate mismatches — escalate, don&apos;t appeal
              one by one.
            </p>
          </PwcCard>
        </div>
      </div>

      <div className="structure-section">
        <div className="section-heading-inline">
          <span className="section-num-inline">01</span>
          <h2>Where the data comes from</h2>
        </div>
        <p className="section-note-inline">
          Every RevCompass decision traces back to a single normalized record, assembled from eight
          feeds that already exist in the hospital&apos;s systems today.
        </p>
        <div className="structure-flow">
          <div className="ehr-box">
            <span className="ehr-tag">Source system</span>
            <strong>Epic</strong>
            <span>+ other RCM platforms</span>
          </div>
          <div className="flow-arrow">→</div>
          <div className="feed-grid">
            {DATA_FEEDS.map((feed) => (
              <div className="feed-chip" key={feed}>
                {feed}
              </div>
            ))}
          </div>
          <div className="flow-arrow">→</div>
          <div className="ingest-box">
            <span className="ingest-tag">Agent 1</span>
            <strong>Ingestion &amp; Doc Understanding</strong>
          </div>
        </div>
        <div className="record-box">
          <code>{VARIANCE_RECORD_FORMULA}</code>
        </div>
        <p className="structure-caption">
          The ingestion agent parses 837/835, de-identifies PHI, and maps every reason code to a
          shared dictionary before anything downstream ever sees a claim.
        </p>
      </div>

      <div className="structure-section">
        <div className="section-heading-inline">
          <span className="section-num-inline">02</span>
          <h2>The seven-agent pipeline</h2>
        </div>
        <p className="section-note-inline">
          Every VarianceRecord — denial, underpayment, or fingerprint alert — moves through the same
          seven agents. Gemini reasons and explains at each step; a deterministic tool supplies
          every number.
        </p>
        <div className="orchestrator-strip">
          <b>Orchestrator</b> — {ORCHESTRATOR_COPY}
        </div>
        <AgentTimeline />
      </div>
    </section>
  )
}
