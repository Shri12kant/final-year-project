import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '../auth/useAuthStore'
import { useThemeStore } from '../theme/useThemeStore'
import { ThemeProvider } from '../contexts/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders({ children }: PropsWithChildren) {
  const mode = useThemeStore((s) => s.mode)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', mode === 'dark')
  }, [mode])

  useEffect(() => {
    void useAuthStore.getState().hydrate()
  }, [])

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

