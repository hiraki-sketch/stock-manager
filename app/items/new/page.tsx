import { registerItem } from "@/app/items/actions";
import { createClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";

export default async function NewItemPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-start justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-screen-sm bg-white dark:bg-gray-800 shadow rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
          新規商品登録
        </h1>

        <form action={registerItem} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">商品名</label>
            <input
              name="name"
              required
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">在庫数</label>
            <input
              type="number"
              name="stock"
              required
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">単位</label>
            <input
              name="unit"
              required
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">チェック者</label>
            <input
              name="checker"
              required
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              登録する
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
