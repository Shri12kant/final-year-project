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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--text)]">Home</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Your feed from communities — voting is local for now; posts sync from the API.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts…"
            className="min-w-[200px] rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
          />
          <div className="flex rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-0.5 text-xs font-medium">
            {SORTS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSortBy(s)}
                className={`rounded-md px-2 py-1 capitalize ${
                  sortBy === s
                    ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <Link
            to="/submit"
            className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Create post
          </Link>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-[var(--text-muted)]">Loading posts…</p>
      )}
      {error && (
        <p className="text-sm text-rose-600">
          Could not load posts. Is the backend running on port 8084?
        </p>
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
        <p className="text-sm text-[var(--text-muted)]">
          No posts match. Try a different search or{' '}
          <Link to="/submit" className="text-[var(--accent)] hover:underline">
            create one
          </Link>
          .
        </p>
      )}
    </div>
  )
}
