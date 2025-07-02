"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type Props = {
  onFilterChange: (filter: string) => void
}

export default function FilterBar({ onFilterChange }: Props) {
  const [value, setValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    onFilterChange(val)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">フィルター</h2>
      <Input
        placeholder="名前を入力"
        value={value}
        onChange={handleChange}
        className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  )
}
