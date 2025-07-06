// File: app/items/[id]/page.tsx
import { createClient } from "@/lib/supabase/serverActionClient"
import { redirect } from "next/navigation"
import { updateItem } from "./updateItem"

export default async function EditItemPage(props: unknown) {
  const { params } = props as { params: { id: string } }

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) redirect("/login")

  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("*")
    .eq("id", params.id)
    .single()

  if (fetchError || !item) {
    return <p className="p-8 text-red-600">在庫データの取得に失敗しました</p>
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 sm:px-6 py-8">
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-2xl font-bold mb-6">在庫編集</h1>

        <form action={updateItem.bind(null, params.id)} className="space-y-4">
          <div>
            <label className="block mb-1">商品名</label>
            <input
              name="name"
              defaultValue={item.name}
              className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block mb-1">在庫数</label>
            <input
              type="number"
              name="stock"
              defaultValue={item.stock}
              className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block mb-1">チェック者</label>
            <input
              name="checker"
              defaultValue={item.checker}
              className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block mb-1">チェック日</label>
            <input
              type="date"
              name="day"
              defaultValue={item.day || ""}
              className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            更新する
          </button>
        </form>
      </div>
    </main>
  )
}
