import { Link } from 'react-router-dom'
import type { Post } from '../../api/postsApi'
import { getCommunity } from '../communities/communityData'
import { getPostMeta } from '../communities/postMeta'
import { VoteColumn } from '../votes/VoteColumn'
import { toMediaUrl } from '../../lib/mediaUrl'

type Props = {
  post: Post
  compact?: boolean
  voteScore?: number
}

export function PostCard({ post, compact, voteScore }: Props) {
  const meta = getPostMeta(post.id)
  const community = getCommunity(meta?.communitySlug) ?? getCommunity('general')
  const mediaUrl = toMediaUrl(post.mediaUrl)

  return (
    <article className="flex overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:border-[var(--border-strong)]">
      <VoteColumn postId={post.id} voteScore={voteScore} />
      <div className="min-w-0 flex-1 p-3">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[var(--text-muted)]">
          {community && (
            <Link
              to={`/r/${community.slug}`}
              className="font-semibold text-[var(--text)] hover:underline"
            >
              r/{community.slug}
            </Link>
          )}
          <span>·</span>
          <span>Posted by u/{post.username}</span>
        </div>
        <Link to={`/post/${post.id}`} className="block group">
          <h3
            className={`font-semibold text-[var(--text)] group-hover:text-[var(--accent)] ${
              compact ? 'text-sm leading-snug' : 'text-base'
            }`}
          >
            {post.title}
          </h3>
        </Link>
        {!compact && post.content && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--text-muted)]">{post.content}</p>
        )}
        {mediaUrl && (
          <div className="mt-2 overflow-hidden rounded-lg border border-[var(--border)] max-w-full">
            {post.mediaType === 'video' ? (
              <video
                src={mediaUrl}
                controls
                preload="metadata"
                className="h-40 w-full bg-black object-contain sm:h-48"
              />
            ) : (
              <img src={mediaUrl} alt="Post media" className="h-40 w-full object-cover sm:h-48" />
            )}
          </div>
        )}
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[var(--text-muted)]">
          <Link
            to={`/post/${post.id}`}
            className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 hover:bg-[var(--border)]"
          >
            💬 Comments
          </Link>
        </div>
      </div>
    </article>
  )
}
