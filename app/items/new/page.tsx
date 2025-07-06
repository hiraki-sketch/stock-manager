import { registerItem } from "@/app/items/actions"
import { createClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"

export default async function NewItemPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  
  if (error || !user) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-start justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-screen-sm bg-white dark:bg-gray-800 shadow rounded-md p-6">
        <h1 className="text-xl font-bold mb-4">新規商品登録</h1>
        <form action={registerItem} className="space-y-4">
          <div>
            <label className="block mb-1">商品名</label>
            <input name="name" required className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800 " />
          </div>

          <div>
            <label className="block mb-1">在庫数</label>
            <input type="number" name="stock" required className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800" />
          </div>

          <div>
            <label className="block mb-1">単位</label>
            <input name="unit" required className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800" />
          </div>

          <div>
            <label className="block mb-1">チェック者</label>
            <input name="checker" required className="w-full border px-3 py-2 rounded text-black dark:text-white bg-white dark:bg-gray-800" />
          </div>

          <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            登録する
          </button>
        </form>
      </div>
    </main>
  )
}
