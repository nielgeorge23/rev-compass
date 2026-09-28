import { getProfileAvatar } from '@/lib/revcompass/profile-avatars'
import type { DemoRole } from '@/lib/revcompass/types'

export const SESSION_COOKIE = 'revcompass_session'
export const DEMO_PASSWORD = 'revcompass123'

export type DemoUser = {
  email: string
  password: string
  name: string
  initials: string
  title: string
  roleLabel: string
  role: DemoRole
  avatar?: string
  department: string
  office: string
  employeeId: string
  manager: string
  analystId?: string
  managerId?: string
}

export type PublicUser = Omit<DemoUser, 'password'>

const DEMO_USERS: DemoUser[] = [
  {
    email: 'steph.curry@pwc.com',
    password: DEMO_PASSWORD,
    name: 'Stephen Wardell Curry',
    initials: 'SC',
    title: 'Revenue Integrity Analyst',
    roleLabel: 'Analyst',
    role: 'analyst',
    analystId: 'steph-curry',
    avatar: getProfileAvatar('steph-curry'),
    department: 'Health Industries · RCM Advisory',
    office: 'San Francisco, CA',
    employeeId: 'US-1048291',
    manager: 'Steve Kerr',
  },
  {
    email: 'klay.thompson@pwc.com',
    password: DEMO_PASSWORD,
    name: 'Klay Thompson',
    initials: 'KT',
    title: 'Revenue Integrity Analyst',
    roleLabel: 'Analyst',
    role: 'analyst',
    analystId: 'klay-thompson',
    avatar: getProfileAvatar('klay-thompson'),
    department: 'Health Industries · RCM Advisory',
    office: 'San Francisco, CA',
    employeeId: 'US-1048293',
    manager: 'Steve Kerr',
  },
  {
    email: 'draymond.green@pwc.com',
    password: DEMO_PASSWORD,
    name: 'Draymond Green',
    initials: 'DG',
    title: 'Revenue Integrity Manager',
    roleLabel: 'Manager',
    role: 'manager',
    managerId: 'draymond-green',
    avatar: getProfileAvatar('draymond-green'),
    department: 'Health Industries · RCM Advisory',
    office: 'San Francisco, CA',
    employeeId: 'US-1048292',
    manager: 'Steve Kerr',
  },
  {
    email: 'steve.kerr@pwc.com',
    password: DEMO_PASSWORD,
    name: 'Steve Kerr',
    initials: 'SK',
    title: 'RCM Practice Director',
    roleLabel: 'Director',
    role: 'director',
    avatar: getProfileAvatar('steve-kerr'),
    department: 'Health Industries · RCM Advisory',
    office: 'San Francisco, CA',
    employeeId: 'US-1048201',
    manager: 'Regional Managing Director',
  },
]

export const DEMO_ACCOUNT_HINTS = DEMO_USERS.map(({ email, roleLabel, name, avatar, initials }) => ({
  email,
  roleLabel,
  name,
  avatar,
  initials,
}))

/** @deprecated Use session user from auth context */
export const MOCK_EMAIL = DEMO_USERS[0].email
export const MOCK_PASSWORD = DEMO_PASSWORD
export const MOCK_USER_NAME = DEMO_USERS[0].name
export const MOCK_USER_INITIALS = DEMO_USERS[0].initials
export const MOCK_USER_TITLE = DEMO_USERS[0].title
export const MOCK_USER_AVATAR = DEMO_USERS[0].avatar ?? ''
export const MOCK_USER_DEPARTMENT = DEMO_USERS[0].department
export const MOCK_USER_OFFICE = DEMO_USERS[0].office
export const MOCK_USER_EMPLOYEE_ID = DEMO_USERS[0].employeeId
export const MOCK_USER_MANAGER = DEMO_USERS[0].manager

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function getUserByEmail(email: string | undefined | null): DemoUser | null {
  if (!email) return null
  const normalized = normalizeEmail(email)
  return DEMO_USERS.find((user) => user.email === normalized) ?? null
}

export function toPublicUser(user: DemoUser): PublicUser {
  const { password: _password, ...publicUser } = user
  return publicUser
}

export function authenticateUser(email: string, password: string): DemoUser | null {
  const user = getUserByEmail(email)
  if (!user || password !== user.password) return null
  return user
}

export function isValidCredentials(email: string, password: string): boolean {
  return authenticateUser(email, password) !== null
}

export function isValidSession(value: string | undefined): boolean {
  return getUserByEmail(value) !== null
}
