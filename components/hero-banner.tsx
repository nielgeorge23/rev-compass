import { logoSvg } from '@/lib/brand'

type HeroBannerProps = {
  title: string
  subtitle: string
}

export function HeroBanner({ title, subtitle }: HeroBannerProps) {
  return (
    <header className="hero-banner">
      <div className="hero-banner-accent" aria-hidden />
      <div className="hero-banner-body">
        <div className="hero-banner-inner">
          <div className="hero-banner-logo" aria-hidden>
            {logoSvg('#2D2D2D')}
          </div>
          <div>
            <h1 className="hero-banner-title">{title}</h1>
            <p className="hero-banner-subtitle">{subtitle}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
