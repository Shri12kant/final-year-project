import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { postsApi } from '../api/postsApi'
import { PostCard } from '../features/posts/PostCard'
import { filterPostsByQuery, type SortKey } from '../features/posts/sortPosts'

const SORTS: SortKey[] = ['hot', 'new', 'top']

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const setQ = (next: string) => {
    if (next) setSearchParams({ q: next })
    else setSearchParams({})
  }

  const [sortBy, setSortBy] = useState<SortKey>('hot')

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['posts', q, sortBy],
    queryFn: () => postsApi.fetchPosts(sortBy),
  });

  const filteredPosts = useMemo(() => 
    filterPostsByQuery(posts, q),
    [posts, q]
  );

  return (
    <div className="space-y-5">
      {/* Enhanced Header */}
      <div className="rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] to-[var(--surface-muted)] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home Feed
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Discover posts from your communities
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search posts..."
                className="min-w-[180px] sm:min-w-[220px] rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
            </div>
            
            {/* Sort Tabs */}
            <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1 text-xs sm:text-sm font-medium shadow-sm">
              {SORTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSortBy(s)}
                  className={`rounded-lg px-3 py-1.5 capitalize transition-all duration-200 ${
                    sortBy === s
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            
            {/* Create Post Button */}
            <Link
              to="/submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create post</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-3 text-[var(--text-muted)]">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">Loading posts...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 p-4 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Could not load posts. Please check your connection.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filteredPosts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            voteScore={(post.upvotes || 0) - (post.downvotes || 0)} 
          />
        ))}
      </div>

      {!isLoading && filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--surface-muted)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-[var(--text)] mb-2">No posts found</p>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Try a different search or create a new post
          </p>
          <Link 
            to="/submit" 
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first post
          </Link>
        </div>
      )}
    </div>
  )
}
