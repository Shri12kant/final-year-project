import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore'
import { cn } from '../../lib/cn'
import { useThemeStore } from '../../theme/useThemeStore'
import { NotificationBell } from '../../features/notifications/NotificationBell'

export function TopNav() {
  const navigate = useNavigate()
  const { user, logout, hydrated, tokens } = useAuthStore()
  const { mode, toggle } = useThemeStore()

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface-solid) 70%, transparent)' }}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-semibold tracking-tight">
          CommunityHub
        </Link>

        <nav className="flex items-center gap-3 text-sm" style={{ color: 'var(--muted)' }}>
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
          <button
            className="rounded border px-3 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            onClick={toggle}
            aria-label="Toggle theme"
            title="Toggle theme"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          >
            {mode === 'dark' ? 'Dark' : 'Light'}
          </button>
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
      </div>
    </header>
  )
}

