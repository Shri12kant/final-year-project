import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="relative group z-50">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg border transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        <span className="text-lg">
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
        <span className="ml-2 text-xs font-medium">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      </button>
    </div>
  )
}
