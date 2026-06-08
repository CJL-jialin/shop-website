import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
}

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
  }
  return 'light'
}

function applyTheme(theme: Theme) {
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }
}

const initial = getInitialTheme()
applyTheme(initial)

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: initial,

  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    applyTheme(next)
    set({ theme: next })
  },
}))
