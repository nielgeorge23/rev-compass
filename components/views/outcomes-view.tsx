import { LineChart } from 'lucide-react'
import { Metric } from '@/components/ui/metric'
import { Pill } from '@/components/ui/pill'
import { PACKAGE_OUTCOMES } from '@/lib/revcompass/packages'

const CALIBRATION = [
  { label: 'Low', n: 61, predicted: 50, actual: 46 },
  { label: 'Medium', n: 118, predicted: 65, actual: 70 },
  { label: 'High', n: 204, predicted: 91, actual: 87 },
]

export function OutcomesView() {
  return (
    <section className="view-page">
      <div className="eyebrow">
        <LineChart size={14} /> Closed-loop learning
      </div>
      <h1>
        Outcome <em>analytics.</em>
      </h1>
      <p className="hero-copy">
        Do high-confidence cohorts actually win at the rate we said they would? Every decision becomes
        signal for payer fingerprints and resolution-probability models.
      </p>

      <div className="large-card calibration-card">
        <div className="card-head">
          <div>
            <span className="eyebrow">Calibration</span>
            <h3>Predicted vs. actual win rate</h3>
          </div>
        </div>
        <div className="cal-chart">
          {CALIBRATION.map((col) => (
            <div className="cal-col" key={col.label}>
              <div className="cal-bars">
                <div className="cal-bar cal-bar-predicted" style={{ height: `${col.predicted}%` }} />
                <div className="cal-bar cal-bar-actual" style={{ height: `${col.actual}%` }} />
              </div>
              <div className="cal-label">
                {col.label}
                <br />
                <span className="mono-cell">n={col.n}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="cal-legend">
          <span><i className="cal-swatch cal-swatch-predicted" /> Predicted win rate</span>
          <span><i className="cal-swatch cal-swatch-actual" /> Actual win rate</span>
        </div>
      </div>

      <div className="outcome-kpis">
        <Metric label="Resolved value, YTD" value="$8.4M" note="Synthetic demo data" accent="var(--green)" />
        <Metric label="Cohorts closed" value="312" note="Trailing 12 months" accent="var(--ink)" />
        <Metric label="Avg. days to resolution" value="38" note="Across closed cohorts" accent="var(--teal)" />
        <Metric label="Mis-grouped claims re-opened" value="14" note="Fed back to clustering" accent="var(--orange)" />
      </div>

      <div className="large-card recovery-card">
        <div className="card-head">
          <div>
            <span className="eyebrow">Learning loop</span>
            <h3>Confirm or kill the hypothesis</h3>
          </div>
          <Pill tone="green">+$2.7M resolved</Pill>
        </div>
        <p className="detail-text">
          When outcomes return, RevCompass updates payer fingerprints and resolution-probability models.
          Patterns that fail are killed; patterns that succeed strengthen future recommendations.
        </p>
      </div>

      <div className="large-card roi-card">
        <div className="card-head">
          <div>
            <span className="eyebrow">ROI ledger</span>
            <h3>Contingency fee model</h3>
          </div>
          <Pill tone="slate">Synthetic · client finance view</Pill>
        </div>
        <div className="roi-rows">
          <div className="roi-row"><span>Total resolved, YTD</span><span className="mono-cell">$8,400,000</span></div>
          <div className="roi-row"><span>RevCompass fee (18% of resolved value)</span><span className="mono-cell">$1,512,000</span></div>
          <div className="roi-row roi-row-total"><span>Net value to client</span><span className="mono-cell">$6,888,000</span></div>
        </div>
      </div>

      <div className="outcome-table">
        <div className="table-head">
          <span>Cohort</span>
          <span>Payer</span>
          <span>Exposure</span>
          <span>Resolved</span>
          <span>Result</span>
        </div>
        {PACKAGE_OUTCOMES.map((row) => (
          <div className="outcome-row-extended" key={row.packageId}>
            <div className="table-row">
              <span>{row.packageTitle}</span>
              <span>{row.payer}</span>
              <span>{row.exposure}</span>
              <span>{row.recovered}</span>
              <span className="green-text">{row.result}</span>
            </div>
            <p className="learning-note">
              {row.patternConfirmed ? '✓ Pattern confirmed — ' : '✗ Pattern killed — '}
              {row.learningNote}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
