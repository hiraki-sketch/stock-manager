"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/serverActionClient";

export async function registerItem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  // ✅ ここだけでOK：ログインしてなければ /login に遷移
  if (authError || !user) {
    redirect("/login");
  }

  const name = formData.get("name") as string;
  const stock = Number(formData.get("stock"));
  const unit = formData.get("unit") as string;
  const checker = formData.get("checker") as string;

  const { error } = await supabase.from("items").insert([
    {
      name,
      stock,
      unit,
      checker,
      user_id: user.id,
    },
  ]);

  if (error) {
    throw new Error("登録に失敗しました: " + error.message);
  }

  redirect("/items");
}
