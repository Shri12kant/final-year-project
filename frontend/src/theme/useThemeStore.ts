import { create } from 'zustand'
import { safeGetItem, safeSetItem } from '../lib/safeStorage'

export type ThemeMode = 'dark' | 'light'

type ThemeState = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const STORAGE_KEY = 'ch_theme'

function getInitialMode(): ThemeMode {
  const stored = safeGetItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: getInitialMode(),
  setMode: (mode) => {
    safeSetItem(STORAGE_KEY, mode)
    set({ mode })
  },
  toggle: () => {
    const next: ThemeMode = get().mode === 'dark' ? 'light' : 'dark'
    safeSetItem(STORAGE_KEY, next)
    set({ mode: next })
  },
}))

