'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Hydration hatasını önlemek için client-side kontrolü
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Temayı değiştir"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-900" />
      ) : (
        <Moon className="h-5 w-5 text-black" />
      )}
    </button>
  )
}
