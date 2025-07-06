'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/serverActionClient'

export async function updateItem(id: string, formData: FormData) {
  const supabase = await createClient() 

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error("認証失敗")

  const name = formData.get("name") as string
  const stock = Number(formData.get("stock"))
  const checker = formData.get("checker") as string
  const day = formData.get("day") as string

  if (!name || !checker || !stock || !day) {
    throw new Error("すべての項目を入力してください")
  }

  const { error: updateError } = await supabase
    .from("items")
    .update({
      name,
      stock,
      checker,
      day,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id) 
  if (updateError) {
    throw new Error(updateError.message)
  }

  redirect("/items")
}
