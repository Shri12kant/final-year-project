import type { PostDto } from '../../types/communityhub'
import { getPostMeta } from '../communities/postMeta'
import { scoreFromVote, type PostVoteState } from '../votes/useVoteStore'

export type SortKey = 'hot' | 'new' | 'top'

export function sortPosts(
  posts: PostDto[],
  sort: SortKey,
  getVote: (postId: number) => PostVoteState,
): PostDto[] {
  const next = [...posts]
  if (sort === 'new') {
    next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } else if (sort === 'top') {
    next.sort(
      (a, b) =>
        scoreFromVote(getVote(b.id)) - scoreFromVote(getVote(a.id)),
    )
  } else {
    next.sort((a, b) => {
      const sa = scoreFromVote(getVote(a.id))
      const sb = scoreFromVote(getVote(b.id))
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      const ha = sa / Math.pow((Date.now() - ta) / 3600000 + 2, 1.5)
      const hb = sb / Math.pow((Date.now() - tb) / 3600000 + 2, 1.5)
      return hb - ha
    })
  }
  return next
}

export function filterPostsByQuery(posts: PostDto[], q: string): PostDto[] {
  const term = q.trim().toLowerCase()
  if (!term) return posts
  return posts.filter((p) => {
    const meta = getPostMeta(p.id)
    const comm = meta?.communitySlug ?? ''
    return (
      p.title.toLowerCase().includes(term) ||
      p.content.toLowerCase().includes(term) ||
      p.username.toLowerCase().includes(term) ||
      comm.includes(term)
    )
  })
}
