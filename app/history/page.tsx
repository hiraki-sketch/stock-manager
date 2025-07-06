// File: app/history/page.tsx
import { createClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import FilterBarForHistory from "./FilterBarForHistory"
import { RestoreButtonWrapper } from "./RestoreButtonWrapper"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function HistoryPage(props: unknown) {
  const { searchParams } = props as Props

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) redirect("/login")

  let query = supabase
    .from("items")
    .select("id, name, unit, stock, checker, day, created_at, updated_at,user_id")
    .eq("deleted", true)

  const name = typeof searchParams.name === "string" ? searchParams.name.trim() : undefined
  const checker = typeof searchParams.checker === "string" ? searchParams.checker.trim() : undefined
  const date = typeof searchParams.date === "string" ? searchParams.date.trim() : undefined

  if (name && name.length >= 1) query = query.ilike("name", `%${name}%`)
  if (checker && checker.length >= 1) query = query.ilike("checker", `%${checker}%`)
  if (date && date.length === 7) {
    const [year, month] = date.split("-")
    const start = `${year}-${month}-01`
    const nextMonth = month === "12" ? "01" : String(Number(month) + 1).padStart(2, "0")
    const nextYear = month === "12" ? String(Number(year) + 1) : year
    const end = `${nextYear}-${nextMonth}-01`
    query = query.gte("day", start).lt("day", end)
  }

  const { data: deletedItems, error: fetchError } = await query.order("updated_at", { ascending: false })

  if (fetchError) {
    return <p className="p-6 text-red-600">取得失敗: {fetchError.message}</p>
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 sm:px-6 py-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">削除履歴</h1>
        <FilterBarForHistory />
        {deletedItems.length === 0 ? (
          <p className="p-6">該当する削除履歴はありません。</p>
        ) : (
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
                {deletedItems.map((item) => (
                  <tr key={item.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700">
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.unit}</td>
                    <td className="p-2 border">{item.stock}</td>
                    <td className="p-2 border">{item.checker}</td>
                    <td className="p-2 border">{item.day}</td>
                    <td className="p-2 border">{new Date(item.created_at).toLocaleString("ja-JP")}</td>
                    <td className="p-2 border">{new Date(item.updated_at).toLocaleString("ja-JP")}</td>
                    <td className="p-2 border">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Link href={`/items/${item.id}`} className="text-blue-600 hover:underline">
                          詳細へ
                        </Link>
                        {/* ✅ 自分が登録したデータだけに復元ボタンを表示 */}
                        {item.user_id === user.id && (
                        <RestoreButtonWrapper id={item.id} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
