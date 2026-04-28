import { useState } from 'react'
import { Link } from 'react-router-dom'
import { COMMUNITIES } from '../features/communities/communityData'
import { useJoinedCommunitiesStore } from '../features/communities/useJoinedCommunitiesStore'

export function CommunitiesPage() {
  const [q, setQ] = useState('')
  const joined = useJoinedCommunitiesStore((s) => s.joined)

  const list = COMMUNITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.slug.toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Communities</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Join locally; post metadata is stored in the browser until the API grows a community
            field.
          </p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter…"
          className="max-w-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
        />
      </div>

      {joined.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-muted)]">
          Joined:{' '}
          {joined.map((slug) => (
            <Link key={slug} to={`/r/${slug}`} className="ml-2 font-medium text-[var(--accent)] hover:underline">
              r/{slug}
            </Link>
          ))}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {list.map((c) => (
          <Link
            key={c.slug}
            to={`/r/${c.slug}`}
            className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] bg-gradient-to-br p-4 transition hover:border-[var(--border-strong)] hover:shadow-md ${c.accent}`}
          >
            <div className="font-semibold text-[var(--text)]">r/{c.slug}</div>
            <div className="mt-1 text-sm text-[var(--text-muted)]">{c.description}</div>
            <div className="mt-3 text-xs text-[var(--text-muted)]">
              ~{c.memberCount.toLocaleString()} members
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-sm text-[var(--text-muted)]">No communities match your filter.</p>
      )}
    </div>
  )
}
