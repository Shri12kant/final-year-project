import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { postsApi } from '../api/postsApi'
import { communitiesApi } from '../api/communitiesApi'
import { PostCard } from '../features/posts/PostCard'
import { getPostMeta } from '../features/communities/postMeta'
import { filterPostsByQuery, sortPosts, type SortKey } from '../features/posts/sortPosts'
import { useJoinedCommunitiesStore } from '../features/communities/useJoinedCommunitiesStore'
import { getVoteDisplay, useVoteStore } from '../features/votes/useVoteStore'

const SORTS: SortKey[] = ['hot', 'new', 'top']

export function CommunityDetailPage() {
  const { slug } = useParams()
  const [sort, setSort] = useState<SortKey>('hot')
  const [q, setQ] = useState('')

  const join = useJoinedCommunitiesStore((s) => s.join)
  const leave = useJoinedCommunitiesStore((s) => s.leave)
  const isJoinedFn = useJoinedCommunitiesStore((s) => s.isJoined)
  const isJoined = Boolean(slug && isJoinedFn(slug))

  // Fetch community from backend
  const { data: community, isLoading: communityLoading, error: communityError } = useQuery({
    queryKey: ['community', slug],
    queryFn: () => communitiesApi.getBySlug(slug!),
    enabled: !!slug,
  })

  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.fetchPosts(),
  })

  const votes = useVoteStore((s) => s.votes)

  const filteredSorted = useMemo(() => {
    if (!slug) return []
    const list = postsQuery.data ?? []
    const inCommunity = list.filter((p) => getPostMeta(p.id)?.communitySlug === slug)
    let next = filterPostsByQuery(inCommunity, q)
    next = sortPosts(next, sort, (id) => getVoteDisplay(id, votes[id]))
    return next
  }, [postsQuery.data, slug, sort, q, votes])

  if (communityLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/20 animate-pulse" />
          <svg className="absolute inset-0 w-16 h-16 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2"></circle>
            <path className="opacity-75" fill="var(--accent)" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--text)]">Loading community...</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Please wait a moment</p>
        </div>
      </div>
    )
  }

  if (communityError || !community) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-rose-600/5 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-rose-200 mb-2">Community not found</h3>
        <p className="text-sm text-rose-300/80 mb-4">This community may have been removed or doesn't exist.</p>
        <Link 
          to="/communities" 
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500/20 px-4 py-2 text-sm font-medium text-rose-200 hover:bg-rose-500/30 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Communities
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--surface-muted)] shadow-lg">
        {/* Background gradient accent */}
        <div className={`absolute inset-0 bg-gradient-to-br ${community.accent} opacity-30`} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--accent-2)]/10 rounded-full blur-3xl" />
        
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              {/* Community Avatar */}
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${community.accent || 'from-blue-500/20 to-cyan-500/20'} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                  {community.name.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
                    r/{community.slug}
                  </h1>
                  {community.category && (
                    <span className="px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium border border-[var(--accent)]/20">
                      {community.category}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
                  {community.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium text-[var(--text)]">{community.memberCount.toLocaleString()}</span> members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Created by <span className="font-medium text-[var(--text)]">u/{community.createdBy}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              {isJoined ? (
                <button
                  type="button"
                  onClick={() => leave(community)}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)] hover:border-red-300 hover:text-red-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Joined
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => join(community)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Join Community
                </button>
              )}
              <Link
                to={`/submit?community=${encodeURIComponent(community.slug)}`}
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)] hover:border-[var(--accent)]/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                New Post
              </Link>
            </div>
          </div>
          
          {/* Rules Section */}
          {community.rules && (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]/60 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)] mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Community Rules
              </div>
              <div className="text-sm text-[var(--text-muted)] whitespace-pre-line leading-relaxed">
                {community.rules}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search in this community…"
          className="min-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
        />
        <div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-0.5 text-xs font-medium">
          {SORTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`rounded-md px-2 py-1 capitalize ${
                sort === s
                  ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {postsQuery.isLoading && (
        <p className="text-sm text-[var(--text-muted)]">Loading posts…</p>
      )}

      <div className="space-y-3">
        {filteredSorted.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {!postsQuery.isLoading && filteredSorted.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">
          No posts here yet.{' '}
          <Link
            to={`/submit?community=${encodeURIComponent(community.slug)}`}
            className="text-[var(--accent)] hover:underline"
          >
            Create the first
          </Link>
          .
        </p>
      )}

    </div>
  )
}
