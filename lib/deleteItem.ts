"use server";

import { createClient } from "./supabase/serverActionClient";

export async function deleteItemById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("items")
    .update({
      deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  console.log("[deleteItemById] data:", data, "error:", error);
  if (error) throw error;
  return data;
}
