import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { postsApi } from '../api/postsApi'
import { useAuthStore } from '../auth/useAuthStore'
import { getCommunity } from '../features/communities/communityData'
import { getPostMeta } from '../features/communities/postMeta'
import { VoteColumn } from '../features/votes/VoteColumn'
import { toMediaUrl } from '../lib/mediaUrl'

export function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const postId = useMemo(() => {
    const n = Number(id)
    return Number.isFinite(n) ? n : NaN
  }, [id])

  const postQuery = useQuery({
    queryKey: ['post', postId],
    queryFn: () => postsApi.getPost(postId),
    enabled: Number.isFinite(postId),
    retry: 1,
    retryDelay: 1000,
  })

  const meta = postQuery.data ? getPostMeta(postQuery.data.id) : undefined
  const community = getCommunity(meta?.communitySlug) ?? getCommunity('general')
  const mediaUrl = toMediaUrl(postQuery.data?.mediaUrl)

  const commentsQuery = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => postsApi.listComments(postId),
    enabled: Number.isFinite(postId),
  })

  const commentSchema = useMemo(
    () =>
      z.object({
        text: z.string().min(1),
      }),
    [],
  )

  type CommentForm = z.infer<typeof commentSchema>

  const commentForm = useForm<CommentForm>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: '',
    },
  })

  useEffect(() => {
    commentForm.reset({ text: '' })
  }, [user, commentForm])

  const addComment = useMutation({
    mutationFn: (values: CommentForm) => postsApi.addComment(postId, { text: values.text }),
    onSuccess: async () => {
      toast.success('Comment added')
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      commentForm.reset({
        text: '',
      })
    },
    onError: () => toast.error('Failed to add comment'),
  })

  const deletePost = useMutation({
    mutationFn: () => {
      console.log('DEBUG Frontend: Calling deletePost for id:', postId)
      return postsApi.deletePost(postId)
    },
    onSuccess: async () => {
      console.log('DEBUG Frontend: Delete success, invalidating queries')
      toast.success('Post deleted')
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      await queryClient.refetchQueries({ queryKey: ['posts'] })
      console.log('DEBUG Frontend: Queries invalidated, navigating home')
      navigate('/', { replace: true })
    },
    onError: (error: any) => {
      console.error('DEBUG Frontend: Delete error:', error)
      console.error('DEBUG Frontend: Error response:', error.response)
      console.error('DEBUG Frontend: Error message:', error.message)
      const message = error.response?.data?.error || error.message || 'Failed to delete post'
      toast.error(message)
    },
  })

  if (!Number.isFinite(postId)) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Invalid post id.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        className="flex overflow-hidden rounded-xl border"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <VoteColumn postId={postId} className="self-stretch" />
        <div className="min-w-0 flex-1 p-4">
          {postQuery.isLoading && (
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              Loading post…
            </div>
          )}

          {postQuery.isError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              <div className="mb-3">
                <strong>Post Not Found</strong>
              </div>
              <div className="mb-3">
                This post may have been deleted or doesn't exist.
              </div>
              <div>
                <Link 
                  to="/" 
                  className="inline-flex items-center rounded-lg border border-red-500/30 bg-red-500/20 px-3 py-1.5 text-xs transition hover:bg-red-500/30"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}

          {postQuery.data && (
            <>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--muted)' }}>
                {community && (
                  <Link
                    to={`/r/${community.slug}`}
                    className="font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    r/{community.slug}
                  </Link>
                )}
                <span>·</span>
                <span>u/{postQuery.data.username}</span>
                <span>·</span>
                <span>{new Date(postQuery.data.createdAt).toLocaleString()}</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{postQuery.data.title}</h1>
              <p className="mt-3 whitespace-pre-wrap text-sm" style={{ color: 'var(--text)' }}>
                {postQuery.data.content}
              </p>
              {mediaUrl && (
                <div className="mt-3 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
                  {postQuery.data.mediaType === 'video' ? (
                    <video
                      src={mediaUrl}
                      controls
                      preload="metadata"
                      className="max-h-[520px] w-full bg-black object-contain"
                    />
                  ) : (
                    <img src={mediaUrl} alt="Post media" className="max-h-[520px] w-full object-cover" />
                  )}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-1.5 text-xs transition hover:bg-black/5 dark:hover:bg-white/10"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  disabled
                >
                  Local votes only (API later)
                </button>

                <button
                  type="button"
                  className="ml-auto rounded-lg border px-3 py-1.5 text-sm text-red-200 transition hover:bg-red-500/10"
                  style={{ borderColor: 'rgba(248, 113, 113, 0.35)' }}
                  onClick={() => {
                    if (confirm('Delete this post?')) deletePost.mutate()
                  }}
                  disabled={
                    deletePost.isPending ||
                    !user ||
                    user.username !== postQuery.data.username
                  }
                >
                  {deletePost.isPending ? 'Deleting…' : 'Delete post'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="font-medium">Comments</div>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
          Backend: <span className="font-mono">GET /api/posts/{postId}/comments</span>
        </p>

        {!user ? (
          <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
            Comment karne ke liye login karein.
          </div>
        ) : (
          <form
            className="mt-4 space-y-3"
            onSubmit={commentForm.handleSubmit((values) => addComment.mutate(values))}
          >
            <div>
              <label className="text-xs" style={{ color: 'var(--muted)' }}>
                Comment
              </label>
              <textarea
                rows={4}
                className="mt-1 w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface-solid)',
                }}
                {...commentForm.register('text')}
              />
              {commentForm.formState.errors.text && (
                <div className="mt-1 text-xs text-red-300">
                  {commentForm.formState.errors.text.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={addComment.isPending}
              className="rounded-lg border px-3 py-2 text-sm font-medium text-white transition hover:opacity-95 disabled:opacity-60"
              style={{
                borderColor:
                  'color-mix(in srgb, var(--accent) 55%, var(--border))',
                background:
                  'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 60%, var(--accent)))',
              }}
            >
              {addComment.isPending ? 'Posting…' : 'Add comment'}
            </button>
          </form>
        )}

        <div className="mt-6 space-y-2">
          {commentsQuery.isLoading && (
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              Loading comments…
            </div>
          )}

          {commentsQuery.isError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              Failed to load comments.
            </div>
          )}

          {!commentsQuery.isLoading &&
            !commentsQuery.isError &&
            commentsQuery.data?.length === 0 && (
              <div className="text-sm" style={{ color: 'var(--muted)' }}>
                No comments yet — be the first.
              </div>
            )}

          {commentsQuery.data?.map((c) => (
            <div
              key={c.id}
              className="rounded-lg border p-3 text-sm"
              style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}
            >
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                @{c.username} • {new Date(c.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 whitespace-pre-wrap">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
