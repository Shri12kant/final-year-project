import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { toast } from 'sonner'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../auth/useAuthStore'

const schema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await authApi.register({
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      })
      setSession({ user: res.user, tokens: { accessToken: res.accessToken } })
      toast.success('Account created')
      navigate('/', { replace: true })
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const msg =
          (e.response?.data as { message?: string } | undefined)?.message ??
          'Registration failed'
        toast.error(String(msg))
        return
      }
      toast.error('Registration failed')
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div
        className="rounded-2xl border p-6 shadow-xl"
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <h1 className="text-xl font-semibold tracking-tight">Register</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
          Create your account to start posting.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div>
            <label className="text-sm" style={{ color: 'var(--muted)' }}>
              Username
            </label>
            <input
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="yourname"
              {...form.register('username')}
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-solid)',
              }}
            />
            {form.formState.errors.username && (
              <div className="mt-1 text-xs text-red-300">
                {form.formState.errors.username.message}
              </div>
            )}
          </div>

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

          <div>
            <label className="text-sm" style={{ color: 'var(--muted)' }}>
              Confirm password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2"
              placeholder="••••••••"
              {...form.register('confirmPassword')}
              style={{
                borderColor: 'var(--border)',
                background: 'var(--surface-solid)',
              }}
            />
            {form.formState.errors.confirmPassword && (
              <div className="mt-1 text-xs text-red-300">
                {form.formState.errors.confirmPassword.message}
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
            Create account
          </button>
        </form>

        <div className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}

