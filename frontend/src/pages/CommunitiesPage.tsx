import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { communitiesApi, COMMUNITY_CATEGORIES, type Community } from '../api/communitiesApi'
import { useJoinedCommunitiesStore } from '../features/communities/useJoinedCommunitiesStore'
import { useAuthStore } from '../auth/useAuthStore'
import { toast } from 'sonner'

export function CommunitiesPage() {
  const [q, setQ] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
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
    (c: Community) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.slug.toLowerCase().includes(q.toLowerCase()) ||
        c.description.toLowerCase().includes(q.toLowerCase())
      const matchesCategory = selectedCategory === '' || c.category === selectedCategory
      return matchesSearch && matchesCategory
    },
  )

  return (
    <div className="space-y-5">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] p-6 sm:p-8 shadow-lg">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--accent-2)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[var(--text)] to-[var(--text-muted)] bg-clip-text text-transparent">
                Communities
              </h1>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md">
              Discover and join communities that interest you. Find your tribe and start connecting!
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="min-w-[140px] sm:min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {COMMUNITY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search communities..."
                className="min-w-[140px] sm:min-w-[180px] rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((c: Community, index: number) => {
            const isJoined = joined.includes(c.slug)
            return (
              <div
                key={c.slug}
                className="group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Community Icon with enhanced styling */}
                    <Link 
                      to={`/r/${c.slug}`} 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.accent || 'from-blue-500/20 to-cyan-500/20'} flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300`}
                    >
                      <span className="text-xl font-bold text-white drop-shadow-sm">
                        {c.name.charAt(0).toUpperCase()}
                      </span>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link to={`/r/${c.slug}`} className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                          r/{c.slug}
                        </Link>
                        {c.category && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[var(--accent)]/20 to-[var(--accent-2)]/20 text-[var(--accent)] font-medium border border-[var(--accent)]/20">
                            {c.category}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                        {c.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                    <span className="flex items-center gap-1.5 bg-[var(--surface-muted)] px-2 py-1 rounded-lg">
                      <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">{c.memberCount?.toLocaleString() || 0}</span> members
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      u/{c.createdBy}
                    </span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="mt-auto flex items-center gap-2">
                    <Link
                      to={`/r/${c.slug}`}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)] hover:border-[var(--accent)]/30 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </Link>
                    
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
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                        isJoined
                          ? 'border border-[var(--border)] hover:bg-[var(--surface-muted)] text-[var(--text)] hover:border-red-300 hover:text-red-500'
                          : 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white hover:shadow-lg hover:opacity-95'
                      } ${isJoinedLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isJoinedLoading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : isJoined ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Joined
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Join
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && list.length === 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] p-10 sm:p-16 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--accent-2)]/5 rounded-full blur-2xl" />
          
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[var(--surface-muted)] to-[var(--surface)] shadow-lg flex items-center justify-center border border-[var(--border)]">
              <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[var(--text)] mb-2">No communities found</h3>
            <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
              {q ? (
                <>
                  No communities match <span className="font-medium text-[var(--accent)]">"{q}"</span>.<br />Try a different search term or category.
                </>
              ) : selectedCategory ? (
                <>
                  No communities in <span className="font-medium text-[var(--accent)]">{selectedCategory}</span> category yet.<br />Be the first to create one!
                </>
              ) : (
                "No communities available yet. Be the first to create a community and start building your network!"
              )}
            </p>
            {(user && !q) && (
              <Link 
                to="/create-community" 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Community
              </Link>
            )}
            {q && (
              <button
                onClick={() => { setQ(''); setSelectedCategory(''); }}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
