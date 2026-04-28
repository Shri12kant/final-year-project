import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../auth/useAuthStore'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, tokens, hydrated } = useAuthStore()
  const location = useLocation()

  if (!hydrated) {
    return (
      <div className="rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        Session restore ho rahi hai…
      </div>
    )
  }

  if (!user && !tokens?.accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

