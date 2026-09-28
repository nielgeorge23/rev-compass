'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AccountDrilldownPanel, ClaimDrilldownPanel } from '@/components/package/claim-drilldown-panel'
import { ClaimResolutionSelect } from '@/components/package/claim-resolution-select'
import { MultiSelectFilter } from '@/components/package/multi-select-filter'
import { PersonAvatar } from '@/components/person-avatar'
import { EhrSourceBadge, VarianceSourceNotice } from '@/components/package/variance-source-notice'
import { useClaimResolution } from '@/lib/claim-resolution-context'
import { getAnalystById } from '@/lib/revcompass/analysts'
import { getAnalystNameForClaim, useWorkAssignment } from '@/lib/work-assignment-context'
import type { ClusterClaim, RecoveryPackage } from '@/lib/revcompass/types'

type DatePreset = 'all' | '7d' | '30d' | '90d' | 'custom'

type ClaimFilters = {
  claimIds: string[]
  accounts: string[]
  datePreset: DatePreset
  dateFrom: string
  dateTo: string
  drgs: string[]
  billedMin: string
  billedMax: string
  paidMin: string
  paidMax: string
  varianceMin: string
  varianceMax: string
  statuses: string[]
}

const EMPTY_FILTERS: ClaimFilters = {
  claimIds: [],
  accounts: [],
  datePreset: 'all',
  dateFrom: '',
  dateTo: '',
  drgs: [],
  billedMin: '',
  billedMax: '',
  paidMin: '',
  paidMax: '',
  varianceMin: '',
  varianceMax: '',
  statuses: [],
}

function parseCurrency(value: string) {
  const n = Number(value.replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : null
}

function matchesInList(value: string, selected: string[]) {
  if (selected.length === 0) return true
  return selected.includes(value)
}

function matchesAmount(value: string, min: string, max: string) {
  const amount = parseCurrency(value)
  if (amount === null) return false
  const minN = min.trim() ? parseCurrency(min) : null
  const maxN = max.trim() ? parseCurrency(max) : null
  if (minN !== null && amount < minN) return false
  if (maxN !== null && amount > maxN) return false
  return true
}

function getDateRange(
  preset: DatePreset,
  dateFrom: string,
  dateTo: string,
  clusterMax: string,
): { from: string | null; to: string | null } {
  if (preset === 'all') return { from: null, to: null }
  if (preset === 'custom') {
    return { from: dateFrom || null, to: dateTo || null }
  }
  const end = new Date(`${clusterMax}T12:00:00`)
  const start = new Date(end)
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
  start.setDate(start.getDate() - days + 1)
  return {
    from: start.toISOString().slice(0, 10),
    to: clusterMax,
  }
}

function matchesDate(serviceDate: string, from: string | null, to: string | null) {
  if (!from && !to) return true
  if (from && serviceDate < from) return false
  if (to && serviceDate > to) return false
  return true
}

function filterClaims(claims: ClusterClaim[], filters: ClaimFilters, clusterMaxDate: string) {
  const { from, to } = getDateRange(filters.datePreset, filters.dateFrom, filters.dateTo, clusterMaxDate)
  return claims.filter(
    (claim) =>
      matchesInList(claim.id, filters.claimIds) &&
      matchesInList(claim.account, filters.accounts) &&
      matchesDate(claim.serviceDate, from, to) &&
      matchesInList(claim.drg, filters.drgs) &&
      matchesAmount(claim.billed, filters.billedMin, filters.billedMax) &&
      matchesAmount(claim.paid, filters.paidMin, filters.paidMax) &&
      matchesAmount(claim.variance, filters.varianceMin, filters.varianceMax) &&
      matchesInList(claim.status, filters.statuses),
  )
}

function hasActiveFilters(filters: ClaimFilters) {
  return JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS)
}

function FilterField({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`claims-filter-field ${className}`.trim()}>
      <span className="claims-filter-label">{label}</span>
      {children}
    </div>
  )
}

function RangeField({
  label,
  min,
  max,
  onMin,
  onMax,
}: {
  label: string
  min: string
  max: string
  onMin: (v: string) => void
  onMax: (v: string) => void
}) {
  return (
    <FilterField label={label} className="claims-filter-field-range">
      <div className="claims-range-pair">
        <input
          type="text"
          className="claims-filter-input"
          placeholder="Min"
          value={min}
          onChange={(e) => onMin(e.target.value)}
        />
        <span className="claims-range-sep">–</span>
        <input
          type="text"
          className="claims-filter-input"
          placeholder="Max"
          value={max}
          onChange={(e) => onMax(e.target.value)}
        />
      </div>
    </FilterField>
  )
}

export function ClaimsTable({
  pkg,
  showAssignmentColumn = false,
  showProgressColumn = false,
  editableProgress = false,
  showOnlyAssignedClaims = false,
  currentAnalystId,
  filterToAnalystId,
}: {
  pkg: RecoveryPackage
  showAssignmentColumn?: boolean
  showProgressColumn?: boolean
  editableProgress?: boolean
  showOnlyAssignedClaims?: boolean
  currentAnalystId?: string
  filterToAnalystId?: string
}) {
  const { getClaimAnalystId } = useWorkAssignment()
  const { getClaimProgress, setClaimProgress } = useClaimResolution()
  const [filters, setFilters] = useState<ClaimFilters>(EMPTY_FILTERS)
  const [selectedClaim, setSelectedClaim] = useState<ClusterClaim | null>(null)
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  useEffect(() => {
    setFilters(EMPTY_FILTERS)
    setSelectedClaim(null)
    setSelectedAccount(null)
  }, [pkg.id])

  const scopedClaims = useMemo(() => {
    let claims = pkg.claims
    if (filterToAnalystId) {
      claims = claims.filter((_, index) => {
        const claimIndex = index + 1
        return getClaimAnalystId(pkg.id, claimIndex) === filterToAnalystId
      })
    } else if (showOnlyAssignedClaims) {
      claims = claims.filter((_, index) => Boolean(getClaimAnalystId(pkg.id, index + 1)))
    }
    return claims
  }, [pkg.claims, pkg.id, filterToAnalystId, showOnlyAssignedClaims, getClaimAnalystId])

  const clusterMaxDate = useMemo(() => {
    const sorted = [...scopedClaims].map((c) => c.serviceDate).sort()
    return sorted[sorted.length - 1] ?? ''
  }, [scopedClaims])

  const uniqueDrgs = useMemo(
    () => [...new Set(scopedClaims.map((c) => c.drg))].sort(),
    [scopedClaims],
  )

  const uniqueStatuses = useMemo(
    () => [...new Set(scopedClaims.map((c) => c.status))].sort(),
    [scopedClaims],
  )

  const uniqueClaimIds = useMemo(
    () => [...new Set(scopedClaims.map((c) => c.id))].sort(),
    [scopedClaims],
  )

  const uniqueAccounts = useMemo(
    () => [...new Set(scopedClaims.map((c) => c.account))].sort(),
    [scopedClaims],
  )

  const accountClaims = useMemo(() => {
    if (!selectedAccount) return []
    return scopedClaims.filter((c) => c.account === selectedAccount)
  }, [scopedClaims, selectedAccount])

  const filteredClaims = useMemo(
    () => filterClaims(scopedClaims, filters, clusterMaxDate),
    [scopedClaims, filters, clusterMaxDate],
  )

  function updateFilter<K extends keyof ClaimFilters>(key: K, value: ClaimFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function openClaimDrilldown(claim: ClusterClaim) {
    setSelectedClaim(claim)
    setSelectedAccount(null)
    updateFilter('claimIds', [claim.id])
  }

  function openAccountDrilldown(account: string) {
    setSelectedAccount(account)
    setSelectedClaim(null)
    updateFilter('accounts', [account])
  }

  function clearDrilldowns() {
    setSelectedClaim(null)
    setSelectedAccount(null)
  }

  const filtered = filteredClaims.length !== scopedClaims.length

  return (
    <div className="claims-panel">
      <div className="claims-panel-head">
        <div>
          <span className="eyebrow">Cluster drilldown</span>
          <h3>Individual claims</h3>
        </div>
        <div className="claims-panel-head-right">
          <span className="claims-panel-note">
            {filtered
              ? `Showing ${filteredClaims.length} of ${filterToAnalystId ? scopedClaims.length : pkg.claimCount} claims`
              : scopedClaims.length === pkg.claimCount
                ? `All ${pkg.claimCount} claims in cluster`
                : `Showing ${scopedClaims.length} of ${pkg.claimCount} claims`}
          </span>
          {hasActiveFilters(filters) ? (
            <button
              type="button"
              className="claims-clear-filters"
              onClick={() => {
                setFilters(EMPTY_FILTERS)
                clearDrilldowns()
              }}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <VarianceSourceNotice compact />

      <div className="claims-filters-bar">
        <div className="claims-filters-row">
          <FilterField label="Claim ID">
            <MultiSelectFilter
              options={uniqueClaimIds}
              selected={filters.claimIds}
              onChange={(value) => {
                updateFilter('claimIds', value)
                if (value.length === 1) {
                  const claim = pkg.claims.find((c) => c.id === value[0])
                  setSelectedClaim(claim ?? null)
                  setSelectedAccount(null)
                } else {
                  setSelectedClaim(null)
                }
              }}
              searchable
            />
          </FilterField>
          <FilterField label="Account">
            <MultiSelectFilter
              options={uniqueAccounts}
              selected={filters.accounts}
              onChange={(value) => {
                updateFilter('accounts', value)
                if (value.length === 1) {
                  setSelectedAccount(value[0])
                  setSelectedClaim(null)
                } else {
                  setSelectedAccount(null)
                }
              }}
              searchable
            />
          </FilterField>
          <FilterField label="DRG">
            <MultiSelectFilter
              options={uniqueDrgs}
              selected={filters.drgs}
              onChange={(value) => updateFilter('drgs', value)}
            />
          </FilterField>
          <FilterField label="Status">
            <MultiSelectFilter
              options={uniqueStatuses}
              selected={filters.statuses}
              onChange={(value) => updateFilter('statuses', value)}
            />
          </FilterField>
        </div>
        <div className="claims-filters-row">
          <FilterField label="Service date" className="claims-filter-field-wide">
            <div className="claims-date-controls">
              <select
                className="claims-filter-select"
                value={filters.datePreset}
                onChange={(e) => updateFilter('datePreset', e.target.value as DatePreset)}
              >
                <option value="all">All time</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="custom">Custom range</option>
              </select>
              {filters.datePreset === 'custom' ? (
                <div className="claims-range-pair">
                  <input
                    type="date"
                    className="claims-filter-input"
                    value={filters.dateFrom}
                    onChange={(e) => updateFilter('dateFrom', e.target.value)}
                    aria-label="From date"
                  />
                  <span className="claims-range-sep">–</span>
                  <input
                    type="date"
                    className="claims-filter-input"
                    value={filters.dateTo}
                    onChange={(e) => updateFilter('dateTo', e.target.value)}
                    aria-label="To date"
                  />
                </div>
              ) : null}
            </div>
          </FilterField>
          <RangeField
            label="Billed"
            min={filters.billedMin}
            max={filters.billedMax}
            onMin={(v) => updateFilter('billedMin', v)}
            onMax={(v) => updateFilter('billedMax', v)}
          />
          <RangeField
            label="Paid"
            min={filters.paidMin}
            max={filters.paidMax}
            onMin={(v) => updateFilter('paidMin', v)}
            onMax={(v) => updateFilter('paidMax', v)}
          />
          <RangeField
            label="Variance"
            min={filters.varianceMin}
            max={filters.varianceMax}
            onMin={(v) => updateFilter('varianceMin', v)}
            onMax={(v) => updateFilter('varianceMax', v)}
          />
        </div>
      </div>

      {selectedClaim ? (
        <ClaimDrilldownPanel
          pkg={pkg}
          claim={selectedClaim}
          onClose={() => {
            setSelectedClaim(null)
            updateFilter('claimIds', [])
          }}
        />
      ) : null}

      {selectedAccount ? (
        <AccountDrilldownPanel
          pkg={pkg}
          account={selectedAccount}
          claims={accountClaims}
          onClose={() => {
            setSelectedAccount(null)
            updateFilter('accounts', [])
          }}
          onSelectClaim={openClaimDrilldown}
        />
      ) : null}

      <div
        className={`claims-table ${showAssignmentColumn ? 'claims-table-with-assign' : ''} ${showProgressColumn ? 'claims-table-with-progress' : ''}`}
      >
        <div className="claims-table-head">
          {showAssignmentColumn ? <span>#</span> : null}
          <span>Claim ID</span>
          <span>Account</span>
          <span>Service date</span>
          <span>DRG</span>
          <span>Billed</span>
          <span>Paid</span>
          <span>Variance</span>
          {showAssignmentColumn ? <span>Assigned to</span> : null}
          {showProgressColumn ? <span>Resolution</span> : null}
          <span>Status</span>
        </div>
        {filteredClaims.length === 0 ? (
          <div className="claims-table-empty">No claims match the current filters.</div>
        ) : (
          filteredClaims.map((claim) => {
            const claimIndex = pkg.claims.findIndex((c) => c.id === claim.id) + 1
            const analystId = getClaimAnalystId(pkg.id, claimIndex)
            const analyst = analystId ? getAnalystById(analystId) : null
            const assignLabel =
              currentAnalystId && analystId === currentAnalystId
                ? 'You'
                : getAnalystNameForClaim(getClaimAnalystId, pkg.id, claimIndex)

            return (
            <div
              className={`claims-table-row ${selectedClaim?.id === claim.id ? 'claims-table-row-active' : ''} ${analyst ? `claims-row-analyst-${analyst.initials.toLowerCase()}` : ''}`}
              key={claim.id}
            >
              {showAssignmentColumn ? <span className="claims-row-index">{claimIndex}</span> : null}
              <span>
                <button
                  type="button"
                  className="claims-drilldown-link"
                  onClick={() => openClaimDrilldown(claim)}
                >
                  {claim.id}
                </button>
              </span>
              <span>
                <button
                  type="button"
                  className="claims-drilldown-link"
                  onClick={() => openAccountDrilldown(claim.account)}
                >
                  {claim.account}
                </button>
              </span>
              <span>{claim.serviceDate}</span>
              <span>{claim.drg}</span>
              <span>{claim.billed}</span>
              <span>{claim.paid}</span>
              <span className="claims-variance">{claim.variance}</span>
              {showAssignmentColumn ? (
                <span className="claims-assign-cell">
                  {analyst ? (
                    <PersonAvatar
                      name={analyst.name}
                      initials={analyst.initials}
                      avatar={analyst.avatar}
                      size="sm"
                      className="claim-assign-avatar"
                    />
                  ) : null}
                  {assignLabel}
                </span>
              ) : null}
              {showProgressColumn ? (
                <span className="claims-progress-cell">
                  <ClaimResolutionSelect
                    value={getClaimProgress(pkg.id, claim.id)}
                    onChange={(status) => setClaimProgress(pkg.id, claim.id, status)}
                    readOnly={!editableProgress}
                  />
                </span>
              ) : null}
              <span
                className={`claims-status claims-status-${claim.status.toLowerCase().replace(' ', '-')} claim-status-with-source`}
              >
                {claim.status}
                {claim.status === 'Denied' || claim.status === 'Underpaid' ? <EhrSourceBadge /> : null}
              </span>
            </div>
            )
          })
        )}
      </div>
    </div>
  )
}
