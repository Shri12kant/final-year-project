import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { communitiesApi } from '../api/communitiesApi'
import { useAuthStore } from '../auth/useAuthStore'
import { toast } from 'sonner'

const ACCENT_OPTIONS = [
  { value: 'from-blue-500/20 to-cyan-500/20', label: 'Blue', color: 'bg-blue-500' },
  { value: 'from-indigo-500/20 to-purple-500/20', label: 'Indigo', color: 'bg-indigo-500' },
  { value: 'from-green-500/20 to-emerald-500/20', label: 'Green', color: 'bg-green-500' },
  { value: 'from-orange-500/20 to-red-500/20', label: 'Orange', color: 'bg-orange-500' },
  { value: 'from-pink-500/20 to-rose-500/20', label: 'Pink', color: 'bg-pink-500' },
  { value: 'from-violet-500/20 to-fuchsia-500/20', label: 'Violet', color: 'bg-violet-500' },
  { value: 'from-teal-500/20 to-cyan-500/20', label: 'Teal', color: 'bg-teal-500' },
  { value: 'from-slate-500/20 to-zinc-500/20', label: 'Slate', color: 'bg-slate-500' },
]

export function CreateCommunityPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    accent: ACCENT_OPTIONS[0].value,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createMutation = useMutation({
    mutationFn: communitiesApi.create,
    onSuccess: (data) => {
      toast.success('Community created successfully!')
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      navigate(`/r/${data.slug}`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create community'
      toast.error(message)
    },
  })

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to create a community')
      navigate('/login')
      return
    }

    if (!validate()) return

    createMutation.mutate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      rules: formData.rules.trim() || undefined,
      accent: formData.accent,
    })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">Create Community</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Build your own community and connect with like-minded people
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Community Name */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Community Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Web Development"
            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20'
            }`}
            style={{
              borderColor: errors.name ? '#ef4444' : 'var(--border)',
              background: 'var(--surface-solid)',
            }}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">
            This will be used to generate your community URL (e.g., r/web-development)
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what your community is about..."
            rows={4}
            className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all resize-none ${
              errors.description ? 'border-red-500 focus:border-red-500' : 'focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20'
            }`}
            style={{
              borderColor: errors.description ? '#ef4444' : 'var(--border)',
              background: 'var(--surface-solid)',
            }}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-[var(--muted)]">
            Minimum 10 characters. This helps people understand your community.
          </p>
        </div>

        {/* Rules */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Community Rules (Optional)
          </label>
          <textarea
            value={formData.rules}
            onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
            placeholder="e.g., Be respectful, No spam, Stay on topic..."
            rows={3}
            className="mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all resize-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface-solid)',
            }}
          />
        </div>

        {/* Accent Color */}
        <div>
          <label className="text-sm font-medium text-[var(--muted)] flex items-center gap-1.5 mb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Theme Color
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCENT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData({ ...formData, accent: option.value })}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                  formData.accent === option.value
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span className={`w-4 h-4 rounded-full ${option.color}`}></span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Community
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
