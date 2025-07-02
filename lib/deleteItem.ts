import { createClient } from "./supabaseClient";

export async function deleteItemById(id: string) {
  const supabase = createClient();
  // ← .select() を入れて、更新後のレコードを戻り値で受け取る
  const { data, error } = await supabase
    .from("items")
    .update({
      deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()     // ← ここがポイント
    .single();    // ← もし 1 レコードだけ返したいなら .single()

  console.log("[deleteItemById] data:", data, "error:", error);
  if (error) throw error;
  return data;   // 呼び出し元で必要ならこれを使える
}