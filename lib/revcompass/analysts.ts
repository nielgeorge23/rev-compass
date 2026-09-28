import { getProfileAvatar } from './profile-avatars'

export type AnalystProfile = {
  id: string
  name: string
  title: string
  email: string
  initials: string
  avatar?: string
}

export const ANALYSTS: Record<string, AnalystProfile> = {
  'steph-curry': {
    id: 'steph-curry',
    name: 'Stephen Wardell Curry',
    title: 'Revenue Integrity Analyst',
    email: 'steph.curry@pwc.com',
    initials: 'SC',
    avatar: getProfileAvatar('steph-curry'),
  },
  'klay-thompson': {
    id: 'klay-thompson',
    name: 'Klay Thompson',
    title: 'Revenue Integrity Analyst',
    email: 'klay.thompson@pwc.com',
    initials: 'KT',
    avatar: getProfileAvatar('klay-thompson'),
  },
}

export function formatAnalystLabel(analyst: AnalystProfile): string {
  return `${analyst.name} — ${analyst.title}`
}

export function getAllAnalysts(): AnalystProfile[] {
  return Object.values(ANALYSTS).sort((a, b) => a.name.localeCompare(b.name))
}

export function getAnalystById(id: string): AnalystProfile | null {
  return ANALYSTS[id] ?? null
}
