import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { communitiesApi, type Community } from '../api/communitiesApi'
import { useJoinedCommunitiesStore } from '../features/communities/useJoinedCommunitiesStore'
import { useAuthStore } from '../auth/useAuthStore'
import { toast } from 'sonner'

export function CommunitiesPage() {
  const [q, setQ] = useState('')
  const joined = useJoinedCommunitiesStore((s) => s.joinedSlugs)
  const join = useJoinedCommunitiesStore((s) => s.join)
  const leave = useJoinedCommunitiesStore((s) => s.leave)
  const fetchJoined = useJoinedCommunitiesStore((s) => s.fetchJoined)
  const isJoinedLoading = useJoinedCommunitiesStore((s) => s.isLoading)
  const user = useAuthStore((s) => s.user)

  // Fetch joined communities on mount
  useEffect(() => {
    if (user) {
      console.log('DEBUG CommunitiesPage: Fetching joined communities')
      fetchJoined()
    }
  }, [user, fetchJoined])

  const { data: communities = [], isLoading, error } = useQuery({
    queryKey: ['communities'],
    queryFn: communitiesApi.fetchAll,
  })

  const list = communities.filter(
    (c: Community) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.slug.toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="space-y-5">
      {/* Enhanced Header */}
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] to-[var(--surface-muted)] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Communities
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Discover and join communities that interest you
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search communities..."
                className="min-w-[180px] sm:min-w-[220px] rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
            
            {/* Create Button */}
            <Link
              to="/create-community"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-3 sm:px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create</span>
            </Link>
          </div>
        </div>
      </div>


      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Loading communities...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Failed to load communities. Please try again.
          </p>
        </div>
      )}

      {/* Communities Grid */}
      {!isLoading && !error && (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((c: Community) => {
            const isJoined = joined.includes(c.slug)
            return (
              <div
                key={c.slug}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] bg-gradient-to-br p-5 transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundImage: `linear-gradient(to bottom right, var(--surface), var(--surface-muted))` }}
              >
                <div className="flex items-start gap-3">
                  {/* Community Icon */}
                  <Link to={`/r/${c.slug}`} className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.accent || 'from-blue-500/20 to-cyan-500/20'} flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity`}>
                    <span className="text-lg font-bold text-[var(--text)]">
                      {c.name.charAt(0).toUpperCase()}
                    </span>
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/r/${c.slug}`} className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors block">
                      r/{c.slug}
                    </Link>
                    <div className="mt-1 text-sm text-[var(--text-muted)] line-clamp-2">
                      {c.description}
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {c.memberCount?.toLocaleString() || 0} members
                      </span>
                      <span>·</span>
                      <span>Created by u/{c.createdBy}</span>
                    </div>
                  </div>
                  
                  {/* Join/Leave Button */}
                  <button
                    type="button"
                    disabled={isJoinedLoading}
                    onClick={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      try {
                        if (isJoined) {
                          await leave(c)
                          toast.success(`Left r/${c.slug}`)
                        } else {
                          await join(c)
                          toast.success(`Joined r/${c.slug}`)
                        }
                      } catch (err: any) {
                        toast.error(err.response?.data?.error || 'Failed to update membership')
                      }
                    }}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all flex-shrink-0 ${
                      isJoined
                        ? 'border border-[var(--border)] hover:bg-[var(--surface-muted)] text-[var(--text)]'
                        : 'bg-[var(--accent)] text-white hover:opacity-90'
                    } ${isJoinedLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isJoinedLoading ? '...' : (isJoined ? 'Joined' : 'Join')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && list.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-[var(--text)] mb-2">No communities found</p>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            {q ? 'Try a different search term' : 'Be the first to create a community!'}
          </p>
          {!q && user && (
            <Link 
              to="/create-community" 
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Community
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
