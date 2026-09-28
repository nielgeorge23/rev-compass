'use client'

import { useState } from 'react'
import { Fingerprint } from 'lucide-react'
import { Pill } from '@/components/ui/pill'
import { FINGERPRINTS, PAYER_EXPOSURE_ROWS } from '@/lib/revcompass/fingerprints'
import type { View } from '@/lib/navigation'

type FingerprintsViewProps = {
  onNavigate?: (view: View, params?: { packageId?: string }) => void
}

const NLQ_ANSWER =
  'Traced to 3 cohorts: RC-00428 (DRG 871 downgrade), RC-00430 (imaging pre-auth), and a bundling dispute — all opened in the last 6 weeks, citing Policy P-118 revisions dated Feb 2026. Overturn rate on appealed cohorts remains 82%; the drop is concentrated in claims Aetna denies without appeal follow-up.'

export function FingerprintsView({ onNavigate }: FingerprintsViewProps) {
  const [activeId, setActiveId] = useState(FINGERPRINTS[0].id)
  const fp = FINGERPRINTS.find((f) => f.id === activeId) ?? FINGERPRINTS[0]

  return (
    <section className="view-page">
      <div className="eyebrow">
        <Fingerprint size={14} /> Payer behavior intelligence
      </div>
      <h1>
        Payer <em>fingerprints.</em>
      </h1>
      <p className="hero-copy">
        A living view of how each payer edits, disputes, and resolves revenue — with drift detection
        before volume builds.
      </p>

      <div className="nlq-strip">
        <input
          type="text"
          className="nlq-input"
          value="Why did Aetna's overturn rate drop this quarter?"
          readOnly
          aria-label="Illustrative natural language question"
        />
        <span className="nlq-badge">Illustrative</span>
        <button type="button" className="nlq-ask-btn" disabled>Ask →</button>
      </div>
      <div className="nlq-answer">{NLQ_ANSWER}</div>

      <div className="fp-selector">
        {FINGERPRINTS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={activeId === f.id ? 'filter active' : 'filter'}
            onClick={() => setActiveId(f.id)}
          >
            {f.shortName}
          </button>
        ))}
      </div>

      {fp.driftAlert ? (
        <div className="drift-alert">
          <Pill tone="amber">DRIFT ALERT</Pill>
          <span>{fp.driftAlert}</span>
          {fp.linkedPackageId && onNavigate ? (
            <button
              type="button"
              className="pwc-card-link"
              onClick={() => onNavigate('packages', { packageId: fp.linkedPackageId })}
            >
              View cohort →
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="fingerprint-grid">
        <div className="large-card">
          <div className="card-head">
            <div>
              <span className="eyebrow">Denial rate · trailing 12mo</span>
              <h3>{fp.shortName} edit behavior</h3>
            </div>
            <Pill tone="amber">
              {fp.baseline.denialRate} → {fp.current.denialRate}
            </Pill>
          </div>
          <div className="spark-bars">
            {fp.sparkline.map((height, i) => (
              <i key={i} style={{ height: `${height}%` }} />
            ))}
          </div>
          <div className="chart-axis">
            <span>Apr 01</span>
            <span>May 01</span>
            <span>Jun 01</span>
            <span>Jun 30</span>
          </div>
        </div>
        <div className="side-card">
          <span className="eyebrow">Most reliable signal</span>
          <strong>{fp.topSignal}</strong>
          <p>Appears in overturned {fp.shortName} edits at elevated frequency.</p>
          <div className="signal-score">
            <span>Signal strength</span>
            <b>{fp.signalStrength}</b>
          </div>
          <div className="bar">
            <i style={{ width: `${fp.signalStrength * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="fp-compare">
        <div className="fp-compare-card">
          <span className="eyebrow">Baseline</span>
          <ul>
            <li><span>Denial rate</span><b>{fp.baseline.denialRate}</b></li>
            <li><span>Days to pay</span><b>{fp.baseline.daysToPay}</b></li>
            <li><span>Overturn rate</span><b>{fp.baseline.overturnRate}</b></li>
          </ul>
        </div>
        <div className="fp-compare-card fp-compare-current">
          <span className="eyebrow">Current</span>
          <ul>
            <li><span>Denial rate</span><b className="green-text">{fp.current.denialRate}</b></li>
            <li><span>Days to pay</span><b>{fp.current.daysToPay}</b></li>
            <li><span>Overturn rate</span><b className="green-text">{fp.current.overturnRate}</b></li>
          </ul>
        </div>
      </div>

      <div className="large-card payer-exposure-card">
        <div className="card-head">
          <div>
            <span className="eyebrow">Exposure ranking</span>
            <h3>Most active payers</h3>
          </div>
        </div>
        <div className="payer-exposure-table-wrap">
          <table className="payer-exposure-table">
            <thead>
              <tr>
                <th>Payer</th>
                <th>Open cohorts</th>
                <th>Exposure</th>
                <th>Denial rate trend</th>
                <th>Overturn rate</th>
              </tr>
            </thead>
            <tbody>
              {PAYER_EXPOSURE_ROWS.map((row) => (
                <tr key={row.payer}>
                  <td>{row.payer}</td>
                  <td>{row.openPackages}</td>
                  <td className="mono-cell">{row.exposure}</td>
                  <td className={row.trendTone === 'bad' ? 'trend-bad' : row.trendTone === 'muted' ? 'trend-muted' : ''}>
                    {row.denialTrend}
                  </td>
                  <td className="mono-cell">{row.overturnRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="insight-grid">
        <div>
          <span className="eyebrow">Common edit vectors</span>
          <ul>
            {fp.editVectors.map((v) => (
              <li key={v.label}>
                <span>{v.label}</span>
                <b>{v.pct}</b>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="eyebrow">Resolution profile</span>
          <ul>
            {fp.resolutionProfile.map((r) => (
              <li key={r.label}>
                <span>{r.label}</span>
                <b className={r.label === 'Overturn rate' ? 'green-text' : ''}>{r.value}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
