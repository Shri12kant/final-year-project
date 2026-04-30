import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore'
import { cn } from '../../lib/cn'
import { NotificationBell } from '../../features/notifications/NotificationBell'
import { useState } from 'react'

export function TopNav() {
  const navigate = useNavigate()
  const { user, logout, hydrated, tokens } = useAuthStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface-solid) 70%, transparent)' }}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-base sm:text-xl hover:opacity-80 transition-opacity">
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">CommunityHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all duration-200',
                'hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5',
                isActive && 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium',
              )
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </NavLink>
          <NavLink
            to="/communities"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all duration-200',
                'hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5',
                isActive && 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium',
              )
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Communities
          </NavLink>
          {user && (
            <NavLink
              to="/submit"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all duration-200',
                  'hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5',
                  isActive && 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium',
                )
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 text-sm">
          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-2">
            {!hydrated && tokens?.accessToken ? (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Signing in…
              </div>
            ) : user ? (
              <>
                <NotificationBell />
                <button
                  className="rounded border px-3 py-1.5 font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => navigate(`/u/${encodeURIComponent(user.username)}`)}
                  style={{ borderColor: 'var(--border)' }}
                >
                  @{user.username}
                </button>
                <button
                  className="rounded border px-3 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => {
                    logout()
                    navigate('/', { replace: true })
                  }}
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      'rounded px-3 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10',
                      isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
                    )
                  }
                  style={{ color: 'var(--muted)' }}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={() =>
                    cn(
                      'rounded border px-3 py-1.5 font-medium text-white transition-colors',
                      'hover:opacity-95',
                    )
                  }
                  style={{
                    borderColor: 'color-mix(in srgb, var(--accent) 55%, var(--border))',
                    background:
                      'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 60%, var(--accent)))',
                  }}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="md:hidden rounded border p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
          <nav className="px-4 py-3 space-y-2" style={{ color: 'var(--muted)' }}>
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded px-3 py-2 text-sm transition-colors',
                  'hover:bg-black/5 dark:hover:bg-white/10',
                  isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/communities"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'block rounded px-3 py-2 text-sm transition-colors',
                  'hover:bg-black/5 dark:hover:bg-white/10',
                  isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
                )
              }
            >
              Communities
            </NavLink>
            {user && (
              <NavLink
                to="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded px-3 py-2 text-sm transition-colors',
                    'hover:bg-black/5 dark:hover:bg-white/10',
                    isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
                  )
                }
              >
                Create Post
              </NavLink>
            )}
            {user ? (
              <>
                <button
                  className="block w-full text-left rounded px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => {
                    navigate(`/u/${encodeURIComponent(user.username)}`)
                    setMobileMenuOpen(false)
                  }}
                  style={{ color: 'var(--text)' }}
                >
                  Profile (@{user.username})
                </button>
                <button
                  className="block w-full text-left rounded px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                  onClick={() => {
                    logout()
                    navigate('/', { replace: true })
                    setMobileMenuOpen(false)
                  }}
                  style={{ color: 'var(--muted)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'block rounded px-3 py-2 text-sm transition-colors',
                      'hover:bg-black/5 dark:hover:bg-white/10',
                      isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
                    )
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className={() =>
                    cn(
                      'block rounded px-3 py-2 text-sm font-medium text-white transition-colors',
                      'hover:opacity-95',
                    )
                  }
                  style={{
                    borderColor: 'color-mix(in srgb, var(--accent) 55%, var(--border))',
                    background:
                      'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 60%, var(--accent)))',
                  }}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

