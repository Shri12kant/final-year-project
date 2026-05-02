import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { postsApi } from '../api/postsApi'
import { communitiesApi, type Community } from '../api/communitiesApi'
import { uploadImage } from '../api/imagesApi'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(1, 'Content is required'),
  communitySlug: z.string().min(1, 'Please select a community'),
})

type FormValues = z.infer<typeof schema>

export function SubmitPostPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [params] = useSearchParams()
  const defaultSlug = params.get('community') ?? 'general'
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const previewUrl = useMemo(() => {
    if (!mediaFile) return null
    return URL.createObjectURL(mediaFile)
  }, [mediaFile])

  // Fetch communities from API
  const { data: communities = [], isLoading: communitiesLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: communitiesApi.fetchAll,
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      communitySlug: defaultSlug,
    },
  })

  // Update default community when communities load
  useEffect(() => {
    if (communities.length > 0) {
      const validSlug = communities.some((c: Community) => c.slug === defaultSlug)
        ? defaultSlug
        : communities[0]?.slug || 'general'
      form.setValue('communitySlug', validSlug)
    }
  }, [communities, defaultSlug, form])

  const selectedCommunity = communities.find((c: Community) => c.slug === form.watch('communitySlug'))

  const create = useMutation({
    mutationFn: async (values: FormValues) => {
      if (isSubmitting) {
        throw new Error('Already submitting')
      }
      setIsSubmitting(true)

      try {
        let imageUrl: string | undefined = undefined

        // Upload image to Cloudinary if present
        if (mediaFile) {
          const uploadResult = await uploadImage(mediaFile)
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || 'Image upload failed')
          }
          imageUrl = uploadResult.url
        }

        // Create post with Cloudinary URL
        return postsApi.createPost({
          title: values.title,
          content: values.content,
          communitySlug: values.communitySlug,
          imageUrl,
        })
      } finally {
        setIsSubmitting(false)
      }
    },
    onSuccess: async (_post) => {
      toast.success('Post created successfully!')
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Navigate to home page
      navigate('/', { replace: true })
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.message || 'Could not create post — are you logged in?'
      toast.error(message)
    },
  })

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.community-dropdown')) {
        setShowCommunityDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const removeMedia = () => {
    setMediaFile(null)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">Create Post</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Share your thoughts with the community
        </p>
      </div>

      <form
        className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm"
        onSubmit={form.handleSubmit((v) => create.mutate(v))}
      >
        {/* Community Selection */}
        <div className="community-dropdown relative">
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Choose a community *
          </label>
          
          {communitiesLoading ? (
            <div className="flex items-center gap-2 text-sm text-[var(--muted)] py-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading communities...
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
                className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                  form.formState.errors.communitySlug 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'hover:border-[var(--border-strong)]'
                }`}
                style={{ borderColor: form.formState.errors.communitySlug ? '#f87171' : 'var(--border)', background: 'var(--surface-solid)' }}
              >
                <div className="flex items-center gap-3">
                  {selectedCommunity ? (
                    <>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedCommunity.accent || 'from-blue-500/20 to-cyan-500/20'} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-sm font-bold text-[var(--text)]">
                          {selectedCommunity.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[var(--text)] text-sm">{selectedCommunity.name}</div>
                        <div className="text-xs text-[var(--muted)]">r/{selectedCommunity.slug}</div>
                      </div>
                    </>
                  ) : (
                    <span className="text-[var(--muted)] text-sm">Select a community</span>
                  )}
                </div>
                <svg className={`w-5 h-5 text-[var(--muted)] transition-transform ${showCommunityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {form.formState.errors.communitySlug && (
                <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {form.formState.errors.communitySlug.message}
                </p>
              )}

              {/* Dropdown */}
              {showCommunityDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg max-h-60 overflow-auto">
                  {communities.length === 0 ? (
                    <div className="p-4 text-center text-sm text-[var(--muted)]">
                      <p>No communities found.</p>
                      <Link to="/create-community" className="text-[var(--accent)] hover:underline mt-1 inline-block">
                        Create one?
                      </Link>
                    </div>
                  ) : (
                    <div className="py-1">
                      {communities.map((community: Community) => (
                        <button
                          key={community.slug}
                          type="button"
                          onClick={() => {
                            form.setValue('communitySlug', community.slug)
                            setShowCommunityDropdown(false)
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--surface-muted)] transition-colors ${
                            form.watch('communitySlug') === community.slug ? 'bg-[var(--accent)]/10' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${community.accent || 'from-blue-500/20 to-cyan-500/20'} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-sm font-bold text-[var(--text)]">
                              {community.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text)] text-sm truncate">{community.name}</div>
                            <div className="text-xs text-[var(--muted)]">r/{community.slug} · {community.memberCount?.toLocaleString() || 0} members</div>
                          </div>
                          {form.watch('communitySlug') === community.slug && (
                            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          
          <input type="hidden" {...form.register('communitySlug')} />
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Title *
          </label>
          <input
            placeholder="What's on your mind?"
            className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
              form.formState.errors.title 
                ? 'border-red-400 focus:border-red-500' 
                : 'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20'
            }`}
            style={{ 
              borderColor: form.formState.errors.title ? '#f87171' : 'var(--border)',
              background: 'var(--surface-solid)',
              color: 'var(--text)'
            }}
            {...form.register('title')}
          />
          {form.formState.errors.title && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Content *
          </label>
          <textarea
            rows={6}
            placeholder="Write something interesting..."
            className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all ${
              form.formState.errors.content 
                ? 'border-red-400 focus:border-red-500' 
                : 'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20'
            }`}
            style={{ 
              borderColor: form.formState.errors.content ? '#f87171' : 'var(--border)',
              background: 'var(--surface-solid)',
              color: 'var(--text)'
            }}
            {...form.register('content')}
          />
          {form.formState.errors.content && (
            <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        {/* Media Upload */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Media (Optional)
          </label>
          
          {!mediaFile ? (
            <div className="relative">
              <input
                type="file"
                id="media-upload"
                accept="image/*,video/mp4,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  if (!file) return
                  
                  const isImage = file.type.startsWith('image/')
                  const isVideo = file.type === 'video/mp4' || file.type === 'video/webm'
                  
                  if (!isImage && !isVideo) {
                    toast.error('Only images or MP4/WEBM videos are allowed')
                    e.currentTarget.value = ''
                    return
                  }
                  
                  const maxBytes = 50 * 1024 * 1024
                  if (file.size > maxBytes) {
                    toast.error('File too large (max 50MB)')
                    e.currentTarget.value = ''
                    return
                  }
                  
                  setMediaFile(file)
                }}
                className="hidden"
              />
              <label
                htmlFor="media-upload"
                className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--surface-solid)] cursor-pointer hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
              >
                <svg className="w-8 h-8 text-[var(--muted)] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-[var(--muted)]">Click to upload image or video</p>
                <p className="text-xs text-[var(--muted)] mt-1">JPG, PNG, WEBP, GIF, MP4, WEBM (max 50MB)</p>
              </label>
            </div>
          ) : (
            <div className="relative rounded-xl border border-[var(--border)] overflow-hidden">
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {previewUrl && (
                <>
                  {mediaFile.type.startsWith('video/') ? (
                    <video src={previewUrl} controls className="w-full max-h-80 bg-black object-contain" />
                  ) : (
                    <img src={previewUrl} alt="Preview" className="w-full max-h-80 object-cover" />
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border)]">
          <button
            type="submit"
            disabled={create.isPending || isSubmitting || communitiesLoading}
            className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {create.isPending || isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Post
              </>
            )}
          </button>
          <Link
            to="/"
            className="rounded-xl border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--muted)] hover:bg-[var(--surface-muted)] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
