// app/history/page.tsx
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabaseClient"
import { Item } from "@/types/item"
import Link from "next/link"

export default function HistoryPage() {
  // データとローディング／エラー状態
  const [deletedItems, setDeletedItems] = useState<Item[]>([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)

  // 絞り込み用ステート
  const [filterName,    setFilterName]    = useState("")
  const [filterChecker, setFilterChecker] = useState("")
  const [filterDate,    setFilterDate]    = useState("") // YYYY-MM-DD

  // 初回マウント時に deleted=true のデータを取得
  useEffect(() => {
    const fetchDeleted = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("items")
        .select("id, name, unit, stock, checker, day, created_at, updated_at, deleted, user_id")
        .eq("deleted", true)
        .order("updated_at", { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setDeletedItems(data || [])
      }
      setLoading(false)
    }
    fetchDeleted()
  }, [])

  // 読み込み中／エラー時
  if (loading) return <p className="p-6">読み込み中…</p>
  if (error)   return <p className="p-6 text-red-600">取得失敗: {error}</p>
  if (deletedItems.length === 0)
    return <p className="p-6">削除済みのデータはありません。</p>

  // クライアント側フィルタリング
  const filtered = deletedItems.filter(item => {
    // 商品名フィルター
    if (filterName && !item.name.toLowerCase().includes(filterName.toLowerCase()))
      return false
    // チェック者フィルター
    if (filterChecker && !item.checker.toLowerCase().includes(filterChecker.toLowerCase()))
      return false
    // 日付フィルター（ISO文字列の先頭 YYYY-MM-DD 部分で比較）
    if (filterDate) {
      const itemDay = item.day ? item.day.split("T")[0] : ""
      if (itemDay !== filterDate) return false
    }
    return true
  })

  return (
    <main className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">削除履歴</h1>

      {/* フィルター入力欄 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1">商品名で絞り込む</label>
          <input
            type="text"
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            placeholder="商品名を入力…"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1">チェック者で絞り込む</label>
          <input
            type="text"
            value={filterChecker}
            onChange={e => setFilterChecker(e.target.value)}
            placeholder="チェック者を入力…"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1">チェック日で絞り込む</label>
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* テーブル表示 */}
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
          {filtered.map(item => (
            <tr
              key={item.id}
              className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
            >
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.unit}</td>
              <td className="p-2 border">{item.stock}</td>
              <td className="p-2 border">{item.checker}</td>
              <td className="p-2 border">{item.day ?? "—"}</td>
              <td className="p-2 border">
                {new Date(item.created_at).toLocaleString("ja-JP")}
              </td>
              <td className="p-2 border">
                {new Date(item.updated_at).toLocaleString("ja-JP")}
              </td>
              <td className="p-2 border">
                <Link
                  href={`/items/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  詳細へ
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
