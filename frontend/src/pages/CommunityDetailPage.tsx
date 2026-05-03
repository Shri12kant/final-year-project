import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { postsApi } from '../api/postsApi'
import { PostCard } from '../features/posts/PostCard'
import { COMMUNITIES, getCommunity } from '../features/communities/communityData'
import { getPostMeta } from '../features/communities/postMeta'
import { filterPostsByQuery, sortPosts, type SortKey } from '../features/posts/sortPosts'
import { useJoinedCommunitiesStore } from '../features/communities/useJoinedCommunitiesStore'
import { getVoteDisplay, useVoteStore } from '../features/votes/useVoteStore'

const SORTS: SortKey[] = ['hot', 'new', 'top']

export function CommunityDetailPage() {
  const { slug } = useParams()
  const community = getCommunity(slug)
  const [sort, setSort] = useState<SortKey>('hot')
  const [q, setQ] = useState('')

  const joined = useJoinedCommunitiesStore((s) => s.joined)
  const join = useJoinedCommunitiesStore((s) => s.join)
  const leave = useJoinedCommunitiesStore((s) => s.leave)
  const isJoinedFn = useJoinedCommunitiesStore((s) => s.isJoined)
  const isJoined = Boolean(slug && isJoinedFn(slug))

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

  if (!community) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
        Unknown community.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className={`overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] bg-gradient-to-br ${community.accent} p-4`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
              r/{community.slug}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">{community.description}</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              ~{community.memberCount.toLocaleString()} members (demo) ·{' '}
              {joined.length} joined locally
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isJoined ? (
              <button
                type="button"
                onClick={() => leave(community.slug)}
                className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--surface-muted)]"
              >
                Joined
              </button>
            ) : (
              <button
                type="button"
                onClick={() => join(community.slug)}
                className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Join
              </button>
            )}
            <Link
              to={`/submit?community=${encodeURIComponent(community.slug)}`}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--surface-muted)]"
            >
              New post
            </Link>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface-solid)]/80 p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Rules
          </div>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-[var(--text-muted)]">
            {community.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
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

      <p className="text-xs text-[var(--text-muted)]">
        Other communities:{' '}
        {COMMUNITIES.filter((c) => c.slug !== community.slug)
          .slice(0, 4)
          .map((c) => (
            <span key={c.slug}>
              <Link to={`/r/${c.slug}`} className="text-[var(--accent)] hover:underline">
                r/{c.slug}
              </Link>{' '}
            </span>
          ))}
      </p>
    </div>
  )
}
