'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { ReviewStatus } from '@/lib/revcompass/types'

export const COHORT_REVIEW_STORAGE_KEY = 'revcompass_cohort_review_v1'

type ReviewMap = Record<string, ReviewStatus>

function loadReviews(): ReviewMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(COHORT_REVIEW_STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as ReviewMap
  } catch {
    return {}
  }
}

function persistReviews(reviews: ReviewMap) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COHORT_REVIEW_STORAGE_KEY, JSON.stringify(reviews))
  } catch {
    /* storage may be unavailable */
  }
}

type CohortReviewContextValue = {
  getReviewStatus: (packageId: string) => ReviewStatus
  setReviewStatus: (packageId: string, status: ReviewStatus) => void
}

const CohortReviewContext = createContext<CohortReviewContextValue | null>(null)

export function CohortReviewProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<ReviewMap>({})

  useEffect(() => {
    setReviews(loadReviews())
  }, [])

  const getReviewStatus = useCallback(
    (packageId: string): ReviewStatus => reviews[packageId] ?? 'pending',
    [reviews],
  )

  const setReviewStatus = useCallback((packageId: string, status: ReviewStatus) => {
    setReviews((prev) => {
      const next = { ...prev, [packageId]: status }
      persistReviews(next)
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ getReviewStatus, setReviewStatus }),
    [getReviewStatus, setReviewStatus],
  )

  return <CohortReviewContext.Provider value={value}>{children}</CohortReviewContext.Provider>
}

export function useCohortReview() {
  const ctx = useContext(CohortReviewContext)
  if (!ctx) throw new Error('useCohortReview must be used within CohortReviewProvider')
  return ctx
}
