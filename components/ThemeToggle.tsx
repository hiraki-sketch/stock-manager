'use client'

import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    if (localStorage.theme === "dark") {
      root.classList.add("dark")
      setIsDark(true)
    } else {
      root.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.remove("dark")
      localStorage.theme = "light"
      setIsDark(false)
    } else {
      root.classList.add("dark")
      localStorage.theme = "dark"
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition"
    >
      {isDark ? "ライトモード" : "ダークモード"}
    </button>
  )
}
