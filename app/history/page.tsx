// app/history/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"
import { Item } from "@/types/item"
import Link from "next/link"
import { useDebounce } from "@/utils/useDebounce"

// HistoryPage 専用に必要なフィールドだけを抜き出した型
export type HistoryItem = Pick<
  Item,
  | "id"
  | "name"
  | "unit"
  | "stock"
  | "checker"
  | "day"
  | "created_at"
  | "updated_at"
>

export default function HistoryPage() {
  const [deletedItems, setDeletedItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterName, setFilterName] = useState("")
  const [filterChecker, setFilterChecker] = useState("")
  const [filterDate, setFilterDate] = useState("")  // YYYY-MM

  const debouncedName = useDebounce(filterName, 300)
  const debouncedChecker = useDebounce(filterChecker, 300)

  useEffect(() => {
    const fetchDeleted = async () => {
      setLoading(true)
      const supabase = createClient()

      // Base query: deleted=true の行を取得
      let query = supabase
        .from("items")
        .select(
          "id, name, unit, stock, checker, day, created_at, updated_at"
        )
        .eq("deleted", true)

      // チェック年月フィルタ (日付型に対して範囲指定)
      if (filterDate) {
        const [year, month] = filterDate.split("-").map(Number)
        const start = `${year}-${String(month).padStart(2, "0")}-01`
        const nextMonth = month === 12 ? 1 : month + 1
        const nextYear = month === 12 ? year + 1 : year
        const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`

        query = query
          .gte("day", start)
          .lt("day", end)
      }

      // 商品名フィルタ（3文字以上のみ）
      if (debouncedName && debouncedName.length >= 4) {
        query = query.ilike("name", `%${debouncedName}%`)
      }

      // チェック者フィルタ（3文字以上のみ）
      if (debouncedChecker && debouncedChecker.length >= 4) {
        query = query.ilike("checker", `%${debouncedChecker}%`)
      }

      // 実行 & ソート
      const { data, error } = await query.order("updated_at", { ascending: false })
      if (error) {
        setError(error.message)
        setDeletedItems([])
      } else {
        setError(null)
        setDeletedItems(data ?? [])
      }
      setLoading(false)
    }

    fetchDeleted()
  }, [filterDate, debouncedName, debouncedChecker])

  if (loading) return <p className="p-6">読み込み中…</p>
  if (error) return <p className="p-6 text-red-600">取得失敗: {error}</p>
  if (!deletedItems.length) return <p className="p-6">該当する削除履歴はありません。</p>

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 sm:px-6 py-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">削除履歴</h1>

        {/* フィルター入力 */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 text-black dark:text-white">商品名で絞り込む</label>
            <input
              type="text"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              placeholder="商品名を入力…"
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 text-black dark:text-white">チェック者で絞り込む</label>
            <input
              type="text"
              value={filterChecker}
              onChange={e => setFilterChecker(e.target.value)}
              placeholder="チェック者を入力…"
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-1 text-black dark:text-white">チェック年月で絞り込む</label>
            <input
              type="month"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
            />
          </div>
        </div>

        {/* テーブル表示 */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 border">商品名</th>
                <th className="p-2 border">単位</th>
                <th className="p-2 border">在庫数</th>
                <th className="p-2 border">チェック者</th>
                <th className="p-2 border">チェック日</th>
                <th className="p-2 border">登録日時</th>
                <th className="p-2 border">更新日時</th>
                <th className="p-2 border">操作</th>
              </tr>
            </thead>
            <tbody>
              {deletedItems.map(item => (
                <tr
                  key={item.id}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                >
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.unit}</td>
                  <td className="p-2 border">{item.stock}</td>
                  <td className="p-2 border">{item.checker}</td>
                  <td className="p-2 border">{item.day}</td>
                  <td className="p-2 border">{new Date(item.created_at).toLocaleString("ja-JP")}</td>
                  <td className="p-2 border">{new Date(item.updated_at).toLocaleString("ja-JP")}</td>
                  <td className="p-2 border">
                    <Link href={`/items/${item.id}`} className="text-blue-600 hover:underline">
                      詳細へ
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
