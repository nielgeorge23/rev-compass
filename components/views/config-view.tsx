'use client'

import { useState } from 'react'
import { RotateCcw, Settings } from 'lucide-react'
import { PwcCard, PwcCardCategory } from '@/components/pwc-card'
import { CONFIG_LABELS, type EngagementConfig } from '@/lib/revcompass/config'
import { useEngagementConfig } from '@/lib/engagement-config-context'

export function ConfigView() {
  const { config, updateConfig, resetConfig, manualReviewCount } = useEngagementConfig()
  const [savedFlash, setSavedFlash] = useState(false)

  function flashSaved() {
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 2000)
  }

  function patch<K extends keyof EngagementConfig>(key: K, value: EngagementConfig[K]) {
    updateConfig({ [key]: value })
    flashSaved()
  }

  return (
    <section className="view-page">
      <div className="eyebrow">
        <Settings size={14} /> Engagement settings
      </div>
      <h1>Engagement <em>configuration.</em></h1>
      <p className="hero-copy">
        Per-client thresholds — what makes RevCompass reusable across health systems rather than
        hard-coded to one. Changes save automatically in this demo session. Tagged items are
        human-in-the-loop (HITL) gates.
      </p>

      <div className="config-toolbar">
        <span className={`config-save-status ${savedFlash ? 'config-save-status-visible' : ''}`}>
          Settings saved
        </span>
        <button type="button" className="secondary-button config-reset-btn" onClick={() => {
          resetConfig()
          flashSaved()
        }}>
          <RotateCcw size={14} /> Reset to defaults
        </button>
      </div>

      <PwcCard>
        <PwcCardCategory>Editable · demo session</PwcCardCategory>
        <p className="config-hint">
          Packages worklist currently shows <strong>{manualReviewCount}</strong> cohort
          {manualReviewCount === 1 ? '' : 's'} in the <strong>Needs manual review</strong> segment at the configured threshold.
        </p>
        <div className="config-rows">
          {CONFIG_LABELS.map((row) => (
            <div className="config-row" key={row.key}>
              <div>
                <div className="config-row-label">
                  {row.label}
                  {row.hitl ? <span className="hitl-tag">HITL</span> : null}
                </div>
                <p className="config-row-desc">{row.desc}</p>
              </div>
              <ConfigControl rowKey={row.key} config={config} onPatch={patch} />
            </div>
          ))}
        </div>
      </PwcCard>
    </section>
  )
}

function ConfigControl({
  rowKey,
  config,
  onPatch,
}: {
  rowKey: keyof EngagementConfig
  config: EngagementConfig
  onPatch: <K extends keyof EngagementConfig>(key: K, value: EngagementConfig[K]) => void
}) {
  switch (rowKey) {
    case 'autoRecommendThreshold':
    case 'manualReviewThreshold':
      return (
        <input
          type="number"
          className="config-row-input"
          min={0}
          max={1}
          step={0.01}
          value={config[rowKey]}
          onChange={(e) => onPatch(rowKey, Number(e.target.value))}
          aria-label={rowKey}
        />
      )
    case 'supervisorOverrideRequired':
      return (
        <select
          className="config-row-input"
          value={config.supervisorOverrideRequired ? 'required' : 'disabled'}
          onChange={(e) => onPatch('supervisorOverrideRequired', e.target.value === 'required')}
          aria-label="Manager override"
        >
          <option value="required">Required</option>
          <option value="disabled">Disabled</option>
        </select>
      )
    case 'minimumCohortSize':
      return (
        <div className="config-input-suffix">
          <input
            type="number"
            className="config-row-input config-row-input-narrow"
            min={1}
            step={1}
            value={config.minimumCohortSize}
            onChange={(e) => onPatch('minimumCohortSize', Number(e.target.value))}
            aria-label="Minimum cohort size"
          />
          <span>claims</span>
        </div>
      )
    case 'urgencyLaneWindowDays':
      return (
        <div className="config-input-suffix">
          <input
            type="number"
            className="config-row-input config-row-input-narrow"
            min={1}
            step={1}
            value={config.urgencyLaneWindowDays}
            onChange={(e) => onPatch('urgencyLaneWindowDays', Number(e.target.value))}
            aria-label="Urgency lane window"
          />
          <span>days</span>
        </div>
      )
    case 'appealUnitCost':
      return (
        <div className="config-input-suffix">
          <span>$</span>
          <input
            type="number"
            className="config-row-input config-row-input-narrow"
            min={0}
            step={1}
            value={config.appealUnitCost}
            onChange={(e) => onPatch('appealUnitCost', Number(e.target.value))}
            aria-label="Appeal unit cost"
          />
        </div>
      )
    case 'crossClientFingerprintSharing':
      return (
        <select
          className="config-row-input"
          value={config.crossClientFingerprintSharing}
          onChange={(e) =>
            onPatch(
              'crossClientFingerprintSharing',
              e.target.value as EngagementConfig['crossClientFingerprintSharing'],
            )
          }
          aria-label="Cross-client fingerprint sharing"
        >
          <option value="pending">Pending legal review</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
      )
    default:
      return null
  }
}
