import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { postsApi } from '../api/postsApi'
import { COMMUNITIES } from '../features/communities/communityData'
import { setPostMeta } from '../features/communities/postMeta'

const schema = z.object({
  title: z.string().min(3, 'Title is too short'),
  content: z.string().min(1, 'Body required'),
  communitySlug: z.string().min(1),
})

type FormValues = z.infer<typeof schema>

export function SubmitPostPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const defaultSlug = params.get('community') ?? 'general'
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const previewUrl = useMemo(() => {
    if (!mediaFile) return null
    return URL.createObjectURL(mediaFile)
  }, [mediaFile])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      communitySlug: COMMUNITIES.some((c) => c.slug === defaultSlug)
        ? defaultSlug
        : 'general',
    },
  })

  const create = useMutation({
    mutationFn: (values: FormValues) => {
      if (mediaFile) {
        return postsApi.createPostWithMedia({
          title: values.title,
          content: values.content,
          file: mediaFile,
        })
      }
      return postsApi.createPost({ title: values.title, content: values.content })
    },
    onSuccess: async (post, variables) => {
      setPostMeta(post.id, { communitySlug: variables.communitySlug })
      toast.success('Post created')
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate(`/post/${post.id}`, { replace: true })
    },
    onError: () => toast.error('Could not create post — are you logged in?'),
  })

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text)]">Create post</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Community is stored in the browser for now. You can also attach one image or video.
        </p>
      </div>

      <form
        className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
        onSubmit={form.handleSubmit((v) => create.mutate(v))}
      >
        <div>
          <label className="text-xs font-medium text-[var(--text-muted)]">Community</label>
          <select
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            {...form.register('communitySlug')}
          >
            {COMMUNITIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                r/{c.slug} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--text-muted)]">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-rose-500">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--text-muted)]">Body</label>
          <textarea
            rows={8}
            className="mt-1 w-full resize-y rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            {...form.register('content')}
          />
          {form.formState.errors.content && (
            <p className="mt-1 text-xs text-rose-500">{form.formState.errors.content.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-[var(--text-muted)]">
            Media (optional: image/video)
          </label>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              if (!file) {
                setMediaFile(null)
                return
              }
              const isImage = file.type.startsWith('image/')
              const isVideo = file.type === 'video/mp4' || file.type === 'video/webm'
              if (!isImage && !isVideo) {
                toast.error('Only image or MP4/WEBM video is allowed')
                e.currentTarget.value = ''
                setMediaFile(null)
                return
              }
              const maxBytes = 50 * 1024 * 1024
              if (file.size > maxBytes) {
                toast.error('File too large (max 50MB)')
                e.currentTarget.value = ''
                setMediaFile(null)
                return
              }
              setMediaFile(file)
            }}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded file:border-0 file:bg-[var(--accent)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
          />
          <p className="mt-1 text-xs text-[var(--text-muted)]">Supported: JPG/PNG/WEBP/GIF/MP4/WEBM</p>
          {previewUrl && (
            <div className="mt-3 overflow-hidden rounded-lg border border-[var(--border)]">
              {mediaFile?.type.startsWith('video/') ? (
                <video src={previewUrl} controls className="max-h-80 w-full bg-black object-contain" />
              ) : (
                <img src={previewUrl} alt="Preview" className="max-h-80 w-full object-cover" />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {create.isPending ? 'Posting…' : 'Post'}
          </button>
          <Link
            to="/"
            className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
