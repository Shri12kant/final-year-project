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
        <Link to="/" className="font-semibold tracking-tight text-base sm:text-lg">
          CommunityHub
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'rounded px-2 py-1 transition-colors',
                'hover:text-[color:var(--text)]',
                isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/communities"
            className={({ isActive }) =>
              cn(
                'rounded px-2 py-1 transition-colors',
                'hover:text-[color:var(--text)]',
                isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
              )
            }
          >
            Communities
          </NavLink>
          {user && (
            <NavLink
              to="/submit"
              className={({ isActive }) =>
                cn(
                  'rounded px-2 py-1 transition-colors',
                  'hover:text-[color:var(--text)]',
                  isActive && 'bg-black/5 dark:bg-white/10 text-[color:var(--text)]',
                )
              }
            >
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

