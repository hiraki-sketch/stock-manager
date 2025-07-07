"use server";

import { createClient } from "@/lib/supabase/serverActionClient";

export async function restoreItem(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("認証エラー");

  const { error: updateError } = await supabase
    .from("items")
    .update({ deleted: false, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);
}
