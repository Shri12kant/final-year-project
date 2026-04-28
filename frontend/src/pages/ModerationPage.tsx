import { Link } from 'react-router-dom'

/** Placeholder for moderator tools — demonstrates product thinking for viva. */
export function ModerationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-[var(--text)]">Moderation</h1>
      <p className="text-sm text-[var(--text-muted)]">
        Future work: report queue, remove posts, ban users — would call secured admin APIs.
      </p>
      <ul className="list-inside list-disc space-y-2 text-sm text-[var(--text-muted)]">
        <li>Review reported content</li>
        <li>Audit log of mod actions</li>
        <li>Auto-spam heuristics</li>
      </ul>
      <Link to="/" className="inline-block text-sm text-[var(--accent)] hover:underline">
        ← Back to home
      </Link>
    </div>
  )
}
