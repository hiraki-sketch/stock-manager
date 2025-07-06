// File: app/items/page.tsx
import { createClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/items/columns"
import FilterBar from "./FilterBar"


type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function ItemsPage(props: unknown) {
  const { searchParams } = props as Props

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  
  let query = supabase
    .from("items")
    .select("*")
    .eq("deleted", false)

  const name = typeof searchParams.name === "string" ? searchParams.name.trim() : undefined
  const checker = typeof searchParams.checker === "string" ? searchParams.checker.trim() : undefined
  const date = typeof searchParams.date === "string" ? searchParams.date.trim() : undefined

  if (name && name.length >= 2) {
    query = query.ilike("name", `%${name}%`)
  }

  if (checker && checker.length >= 2) {
    query = query.ilike("checker", `%${checker}%`)
  }

  if (date && date.length === 7) {
    const [year, month] = date.split("-")
    const start = `${year}-${month}-01`
    const nextMonth = month === "12" ? "01" : String(Number(month) + 1).padStart(2, "0")
    const nextYear = month === "12" ? String(Number(year) + 1) : year
    const end = `${nextYear}-${nextMonth}-01`
    query = query.gte("day", start).lt("day", end)
  }

  const { data: items, error: fetchError } = await query.order("updated_at", { ascending: false })

  if (fetchError) {
    return <p className="p-6 text-red-600">データ取得エラー: {fetchError.message}</p>
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 sm:px-6 py-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">在庫一覧</h1>
        <FilterBar />
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          {items.length > 0 ? (
            <DataTable columns={columns} data={items} />
          ) : (
            <p className="text-gray-500">一致する在庫データがありません。</p>
          )}
        </div>
      </div>
    </main>
  )
}
