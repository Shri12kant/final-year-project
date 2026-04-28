import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../auth/useAuthStore'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
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
          'Login failed'
        toast.error(String(msg))
        return
      }
      toast.error('Login failed')
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
          <div>
            <label className="text-sm" style={{ color: 'var(--muted)' }}>
              Email
            </label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="you@example.com"
              {...form.register('email')}
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-solid)',
              }}
            />
            {form.formState.errors.email && (
              <div className="mt-1 text-xs text-red-300">
                {form.formState.errors.email.message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm" style={{ color: 'var(--muted)' }}>
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="••••••••"
              {...form.register('password')}
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-solid)',
              }}
            />
            {form.formState.errors.password && (
              <div className="mt-1 text-xs text-red-300">
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

