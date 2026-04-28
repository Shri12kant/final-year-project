import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/useAuthStore'
import { cn } from '../../lib/cn'

function Item({
  to,
  label,
}: {
  to: string
  label: string
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'flex items-center justify-between rounded-lg px-3 py-2 text-sm transition',
          'hover:bg-black/5 dark:hover:bg-white/10',
          isActive && 'bg-black/5 dark:bg-white/10',
        )
      }
      style={{ color: 'var(--text)' }}
    >
      <span className="truncate">{label}</span>
    </NavLink>
  )
}

export function LeftSidebar() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div
        className="sticky top-[72px] space-y-3 rounded-xl border p-3"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="px-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          Navigation
        </div>
        <div className="space-y-1">
          <Item to="/" label="Home" />
          <Item to="/search" label="Search" />
          <Item to="/communities" label="Communities" />
          <Item to="/about" label="About CommunityHub" />
          <Item to="/submit" label="Create post" />
          <Item to="/moderation" label="Moderation" />
        </div>

        <div className="h-px w-full" style={{ background: 'var(--border)' }} />

        <div className="px-2 text-xs font-semibold uppercase tracking-wide opacity-70">
          Your account
        </div>
        <div className="space-y-1">
          {user ? (
            <>
              <button
                className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
                style={{ color: 'var(--text)' }}
                onClick={() => navigate(`/u/${encodeURIComponent(user.username)}`)}
              >
                Profile
              </button>
              <Item to="/settings" label="Settings" />
            </>
          ) : (
            <>
              <Item to="/login" label="Login" />
              <Item to="/register" label="Register" />
            </>
          )}
        </div>

      </div>
    </aside>
  )
}

