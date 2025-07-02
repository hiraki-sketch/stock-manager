'use client'
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

function NewItemForm() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = createClient()

  const [name, setName] = useState("")
  const [stock, setStock] = useState("")
  const [unit, setUnit] = useState("")
  const [checkedBy, setCheckedBy] = useState("")

  useEffect(() => {
    if (params) {
      setName(params.get("name") || "")
      setStock(params.get("stock") || "")
      setUnit(params.get("unit") || "")
      setCheckedBy(params.get("checker") || "")
    }
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    console.log("▶ INSERT前 user.id:", user?.id, " userError:", userError)

    if (!user || userError) {
      alert("ユーザー情報の取得に失敗しました: " + (userError?.message || "不明なエラー"))
      return
    }

    const { data: inserted, error: insertError } = await supabase
      .from("items")
      .insert({
        name,
        stock: Number(stock),
        unit,
        checker: checkedBy,
        user_id: user.id,
      })
      .select()
    console.log("▶ INSERT後 inserted:", inserted, " insertError:", insertError)

    if (insertError) {
      alert("登録に失敗しました: " + insertError.message)
      console.error("▶ insertError 詳細:", insertError)
      return
    }

    router.push("/items")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>商品名</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label>在庫数</Label>
        <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
      </div>
      <div>
        <Label>単位</Label>
        <Input value={unit} onChange={(e) => setUnit(e.target.value)} required />
      </div>
      <div>
        <Label>チェック者</Label>
        <Input value={checkedBy} onChange={(e) => setCheckedBy(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full sm:w-auto">登録</Button>
    </form>
  )
}

export default function NewItemPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-start justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-screen-sm bg-white dark:bg-gray-800 shadow rounded-md p-6">
        <h1 className="text-xl font-bold mb-4">新規商品登録</h1>
        <Suspense fallback={<p>読み込み中...</p>}>
          <NewItemForm />
        </Suspense>
      </div>
    </main>
  )
}
