import type { Metadata } from 'next'
import { logoSvg, PRODUCT_NAME, PRODUCT_TAGLINE } from '@/lib/brand'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: `Sign in — ${PRODUCT_NAME}`,
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card-accent" aria-hidden />
        <div className="login-brand">
          <div className="login-logo" aria-hidden>
            {logoSvg('#2D2D2D')}
          </div>
          <div>
            <p className="login-product">{PRODUCT_NAME}</p>
            <p className="login-tagline">{PRODUCT_TAGLINE}</p>
          </div>
        </div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-subtitle">Enter your email and password to access the RevCompass workspace.</p>
        <LoginForm />
        <p className="login-footer">
          Access is restricted to authorized users. This environment uses mock authentication for demo purposes.
        </p>
      </div>
    </div>
  )
}
