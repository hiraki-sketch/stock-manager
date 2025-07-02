"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"

type Props = {
  onFilterChange: (filters: {
    name: string
    checker: string
    date: string
  }) => void
}

export default function FilterBar({ onFilterChange }: Props) {
  const [name, setName] = useState("")
  const [checker, setChecker] = useState("")
  const [date, setDate] = useState("")

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setName(val)
    onFilterChange({ name: val, checker, date })
  }

  const handleCheckerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setChecker(val)
    onFilterChange({ name, checker: val, date })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDate(val)
    onFilterChange({ name, checker, date: val })
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            商品名で絞り込む
          </label>
          <Input
            placeholder="商品名を入力"
            value={name}
            onChange={handleNameChange}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            チェック者で絞り込む
          </label>
          <Input
            placeholder="チェック者を入力"
            value={checker}
            onChange={handleCheckerChange}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            チェック年月で絞り込む
          </label>
          <Input
            type="month"
            value={date}
            onChange={handleDateChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
