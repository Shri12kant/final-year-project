import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-zinc-300">The page you’re looking for doesn’t exist.</p>
      <Link
        to="/"
        className="inline-block rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm hover:bg-zinc-800"
      >
        Go home
      </Link>
    </div>
  )
}

