import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useState } from 'react'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../auth/useAuthStore'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const [loginError, setLoginError] = useState<string>('')

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setLoginError('')
    try {
      const res = await authApi.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
      setSession({ user: res.user, tokens: { accessToken: res.accessToken } })
      toast.success('Login successful')

      const from = (location.state as { from?: string } | null)?.from
      navigate(from || '/', { replace: true })
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          'Invalid email or password'
        setLoginError(String(msg))
        toast.error(`❌ ${String(msg)}`, { duration: 5000 })
        return
      }
      setLoginError('Login failed. Please try again.')
      toast.error('❌ Login failed. Please try again.', { duration: 5000 })
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div
        className="rounded-2xl border p-6 shadow-xl"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
      >
        <h1 className="text-xl font-semibold tracking-tight">Login</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Sign in to join communities and post.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Error Alert */}
          {loginError && (
            <div 
              className="rounded-lg border p-3 sm:p-4 text-sm sm:text-base"
              style={{ 
                borderColor: '#ef4444', 
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444'
              }}
            >
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium break-words leading-relaxed">{loginError}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              Email
            </label>
            <input
              className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 transition-colors ${
                loginError || form.formState.errors.email ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="you@example.com"
              {...form.register('email')}
              style={{
                borderColor: loginError || form.formState.errors.email ? '#ef4444' : 'var(--border)',
                background: 'var(--surface-solid)',
              }}
            />
            {form.formState.errors.email && (
              <div className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {form.formState.errors.email.message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium" style={{ color: 'var(--muted)' }}>
              Password
            </label>
            <input
              type="password"
              className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 transition-colors ${
                loginError || form.formState.errors.password ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="••••••••"
              {...form.register('password')}
              style={{
                borderColor: loginError || form.formState.errors.password ? '#ef4444' : 'var(--border)',
                background: 'var(--surface-solid)',
              }}
            />
            {form.formState.errors.password && (
              <div className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {form.formState.errors.password.message}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded border px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95"
            style={{
              borderColor:
                'color-mix(in srgb, var(--accent) 55%, var(--border))',
              background:
                'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent-2) 60%, var(--accent)))',
            }}
          >
            Sign in
          </button>
        </form>

        <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
          New here?{' '}
          <Link to="/register" className="font-medium underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}

