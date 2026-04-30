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
    <article className="flex overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-md hover:shadow-lg transition-all duration-300 hover:border-[var(--accent)]/30 hover:-translate-y-0.5">
      <VoteColumn postId={post.id} voteScore={voteScore} />
      <div className="min-w-0 flex-1 p-4">
        <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)]">
          {community && (
            <Link
              to={`/r/${community.slug}`}
              className="flex items-center gap-1 font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center text-white text-[10px]">
                {community.slug.charAt(0).toUpperCase()}
              </span>
              r/{community.slug}
            </Link>
          )}
          <span className="text-[var(--border-strong)]">·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            u/{post.username}
          </span>
        </div>
        <Link to={`/post/${post.id}`} className="block group">
          <h3
            className={`font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200 ${
              compact ? 'text-sm leading-snug' : 'text-base sm:text-lg'
            }`}
          >
            {post.title}
          </h3>
        </Link>
        {!compact && post.content && (
          <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)] leading-relaxed">{post.content}</p>
        )}
        {mediaUrl && (
          <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)] max-w-full">
            {post.mediaType === 'video' ? (
              <video
                src={mediaUrl}
                controls
                preload="metadata"
                className="h-44 w-full bg-black object-contain sm:h-56"
              />
            ) : (
              <img src={mediaUrl} alt="Post media" className="h-44 w-full object-cover sm:h-56 hover:scale-105 transition-transform duration-300" />
            )}
          </div>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-3 py-1.5 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] transition-all duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments
          </Link>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </article>
  )
}
