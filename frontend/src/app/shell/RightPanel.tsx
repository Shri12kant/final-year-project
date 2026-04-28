import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { postsApi } from '../../api/postsApi'

export function RightPanel() {
  const postsQuery = useQuery({
    queryKey: ['posts'],
    queryFn: () => postsApi.fetchPosts(),
  })

  const trending = (postsQuery.data ?? []).slice(0, 5)

  return (
    <aside className="hidden w-80 shrink-0 xl:block">
      <div className="sticky top-[72px] space-y-3">
        <section
          className="rounded-xl border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="text-sm font-semibold">About CommunityHub</div>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            A Reddit-style academic community for posts, threaded discussions,
            and voting.
          </p>
          <div className="mt-3 flex gap-2">
            <Link
              to="/communities"
              className="rounded-lg border px-3 py-1.5 text-sm transition hover:bg-black/5 dark:hover:bg-white/10"
              style={{ borderColor: 'var(--border)' }}
            >
              Explore
            </Link>
            <Link
              to="/login"
              className="rounded-lg border px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-95"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--accent) 55%, var(--border))',
                background:
                  'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 60%, var(--accent)))',
              }}
            >
              Sign in
            </Link>
          </div>
        </section>

        <section
          className="rounded-xl border p-4"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div className="text-sm font-semibold">Trending</div>
          <div className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
            Pulled from <span className="font-mono">GET /api/posts</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {postsQuery.isLoading && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                Loading…
              </div>
            )}

            {postsQuery.isError && (
              <div className="text-xs text-red-200">Could not load posts.</div>
            )}

            {!postsQuery.isLoading && !postsQuery.isError && trending.length === 0 && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                No posts yet.
              </div>
            )}

            {trending.map((p) => (
              <Link
                key={p.id}
                to={`/post/${p.id}`}
                className="block rounded-lg px-3 py-2 transition hover:bg-black/5 dark:hover:bg-white/10"
              >
                <div className="line-clamp-2">{p.title}</div>
                <div className="mt-0.5 text-xs" style={{ color: 'var(--muted)' }}>
                  @{p.username} • open thread
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}

