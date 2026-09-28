'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEMO_ACCOUNT_HINTS, DEMO_PASSWORD } from '@/lib/auth/config'
import { PersonAvatar } from '@/components/person-avatar'

const SAFE_REDIRECT_DEFAULT = '/'

function safeRedirect(value: string | null): string {
  if (!value) return SAFE_REDIRECT_DEFAULT
  if (!value.startsWith('/')) return SAFE_REDIRECT_DEFAULT
  if (value.startsWith('//')) return SAFE_REDIRECT_DEFAULT
  if (value.startsWith('/login')) return SAFE_REDIRECT_DEFAULT
  return value
}

function LoginFormInner() {
  const router = useRouter()
  const search = useSearchParams()
  const next = safeRedirect(search.get('next'))

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function fillDemoAccount(demoEmail: string) {
    setEmail(demoEmail)
    setPassword(DEMO_PASSWORD)
    setError(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }

      if (!response.ok || !data.ok) {
        setError(data.error ?? 'Invalid email or password.')
        setSubmitting(false)
        return
      }

      router.replace(next)
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={onSubmit} noValidate>
        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={submitting}
          />
        </div>
        {error ? (
          <p className="login-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="login-submit" type="submit" disabled={submitting || !email || !password}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="login-demo-accounts">
        <p className="login-demo-title">Demo accounts</p>
        <p className="login-demo-note">Password for all accounts: <code>{DEMO_PASSWORD}</code></p>
        <ul className="login-demo-list">
          {DEMO_ACCOUNT_HINTS.map((account) => (
            <li key={account.email}>
              <button
                type="button"
                className="login-demo-account"
                onClick={() => fillDemoAccount(account.email)}
                disabled={submitting}
              >
                <PersonAvatar
                  name={account.name}
                  initials={account.initials}
                  avatar={account.avatar}
                  size="sm"
                  className="login-demo-avatar"
                />
                <div className="login-demo-account-text">
                  <span className="login-demo-role">{account.roleLabel}</span>
                  <span className="login-demo-name">{account.name}</span>
                  <span className="login-demo-email">{account.email}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="login-form-loading">Loading sign in…</div>}>
      <LoginFormInner />
    </Suspense>
  )
}
