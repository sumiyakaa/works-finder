import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'

interface HeaderProps {
  onOpenContactForm: () => void
}

export function Header({ onOpenContactForm }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isDetailPage = location.pathname !== '/' && location.pathname !== '/works-finder/' && !location.pathname.endsWith('/works-finder')

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__left">
          {isDetailPage && (
            <Link to="/works-finder/" className="site-header__back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              一覧に戻る
            </Link>
          )}
          <Link to="/works-finder/" className="site-header__logo-link">
            <img
              className="site-header__logo"
              src={`${import.meta.env.BASE_URL}assets/images/meta/logo-white.png`}
              alt="AKASHIKI"
            />
          </Link>
        </div>

        <div className="site-header__right">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
          <button
            type="button"
            className="primary-button site-header__cta"
            onClick={onOpenContactForm}
          >
            制作について相談する
          </button>
        </div>
      </div>
    </header>
  )
}
