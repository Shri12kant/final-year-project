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
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      {/* Logo Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Welcome back</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Sign in to your CommunityHub account
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 sm:p-8 shadow-xl"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
      >

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
            <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Email
            </label>
            <input
              className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 ${
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
            <label className="text-sm font-medium flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>
            <input
              type="password"
              className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 ${
                loginError || form.formState.errors.password ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="Enter your password"
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
            className="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:opacity-95 transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              borderColor: 'transparent',
              background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign in
          </button>
        </form>

        <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            New to CommunityHub?{' '}
            <Link to="/register" className="font-semibold text-[var(--accent)] hover:underline transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

