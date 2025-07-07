"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/serverActionClient";

export async function registerItem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("認証エラー");
  }

  const name = formData.get("name") as string;
  const stock = Number(formData.get("stock"));
  const unit = formData.get("unit") as string;
  const checker = formData.get("checker") as string;

  if (!name || !stock || !unit || !checker) {
    throw new Error("全ての項目を入力してください");
  }

  const { error: insertError } = await supabase.from("items").insert({
    name,
    stock,
    unit,
    checker,
    user_id: user.id,
  });

  if (insertError) {
    throw new Error(insertError.message);
  }

  redirect("/items");
}
