'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/serverActionClient'

export async function registerItem(formData: FormData) {
  const supabase = await createClient() // ✅ ここを修正

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error("認証情報が無効です")
  }

  const name = formData.get("name") as string
  const stock = Number(formData.get("stock"))
  const unit = formData.get("unit") as string
  const checker = formData.get("checker") as string

  const { error } = await supabase
    .from("items")
    .insert([
      {
        name,
        stock,
        unit,
        checker,
        user_id: user.id,
      },
    ])

  if (error) {
    throw new Error("登録に失敗しました: " + error.message)
  }

  redirect("/items")
}
