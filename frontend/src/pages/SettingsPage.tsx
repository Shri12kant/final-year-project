import { useAuthStore } from '../auth/useAuthStore'

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <div
        className="rounded-xl border p-4 text-sm"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        {user ? (
          <>
            Signed in as{' '}
            <span className="font-medium" style={{ color: 'var(--text)' }}>
              @{user.username}
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--muted)' }}>Not signed in</span>
        )}
      </div>
    </div>
  )
}

