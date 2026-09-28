'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ENGAGEMENT_CONFIG,
  ENGAGEMENT_CONFIG_STORAGE_KEY,
  type EngagementConfig,
} from '@/lib/revcompass/config'
import { countManualReviewPackages } from '@/lib/revcompass/types'
import { RECOVERY_PACKAGES } from '@/lib/revcompass/packages'

type EngagementConfigContextValue = {
  config: EngagementConfig
  updateConfig: (patch: Partial<EngagementConfig>) => void
  resetConfig: () => void
  isManualReviewPackage: (pkg: { confidence: number; insufficientEvidence?: boolean }) => boolean
  manualReviewCount: number
}

const EngagementConfigContext = createContext<EngagementConfigContextValue | null>(null)

function loadStoredConfig(): EngagementConfig {
  if (typeof window === 'undefined') return ENGAGEMENT_CONFIG
  try {
    const raw = window.localStorage.getItem(ENGAGEMENT_CONFIG_STORAGE_KEY)
    if (!raw) return ENGAGEMENT_CONFIG
    return { ...ENGAGEMENT_CONFIG, ...JSON.parse(raw) } as EngagementConfig
  } catch {
    return ENGAGEMENT_CONFIG
  }
}

function persistConfig(config: EngagementConfig) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ENGAGEMENT_CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch {
    /* storage may be unavailable */
  }
}

export function EngagementConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<EngagementConfig>(ENGAGEMENT_CONFIG)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setConfig(loadStoredConfig())
    setHydrated(true)
  }, [])

  const updateConfig = useCallback((patch: Partial<EngagementConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch }
      persistConfig(next)
      return next
    })
  }, [])

  const resetConfig = useCallback(() => {
    setConfig(ENGAGEMENT_CONFIG)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(ENGAGEMENT_CONFIG_STORAGE_KEY)
      } catch {
        /* ignore */
      }
    }
  }, [])

  const isManualReviewPackage = useCallback(
    (pkg: { confidence: number; insufficientEvidence?: boolean }) =>
      pkg.confidence < config.manualReviewThreshold * 100 || Boolean(pkg.insufficientEvidence),
    [config.manualReviewThreshold],
  )

  const manualReviewCount = useMemo(
    () => countManualReviewPackages(RECOVERY_PACKAGES, config.manualReviewThreshold),
    [config.manualReviewThreshold],
  )

  const value = useMemo(
    () => ({
      config: hydrated ? config : ENGAGEMENT_CONFIG,
      updateConfig,
      resetConfig,
      isManualReviewPackage,
      manualReviewCount,
    }),
    [config, hydrated, updateConfig, resetConfig, isManualReviewPackage, manualReviewCount],
  )

  return (
    <EngagementConfigContext.Provider value={value}>{children}</EngagementConfigContext.Provider>
  )
}

export function useEngagementConfig() {
  const ctx = useContext(EngagementConfigContext)
  if (!ctx) throw new Error('useEngagementConfig must be used within EngagementConfigProvider')
  return ctx
}
