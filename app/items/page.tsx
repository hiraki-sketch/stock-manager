// app/items/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/items/columns";
import { Item } from "@/types/item";
import { useRouter } from "next/navigation";
import FilterBar from "./FilterBar";

export default function ItemsPage() {
  const [filter, setFilter] = useState<string>("");
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = items.filter((item) =>
    item.checker.toLowerCase().includes(filter.toLowerCase())
  );

  // 認証チェック
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        console.error("セッションの取得に失敗:", error?.message);
        router.push("/login");
        return;
      }
    };
    checkSession();
  }, [router]);

  // データ取得
  useEffect(() => {
    const fetchItems = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("deleted", false)               // ← 未削除のみ取得
        .order("updated_at", { ascending: false });

      console.log("▶️ fetchItems:", data);
      if (error) {
        setError(error.message);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">エラー: {error}</p>;
  if (items.length === 0) return <p>表示できる在庫データがありません。</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
      <h1 className="text-2xl font-bold mb-4">在庫一覧</h1>
      <FilterBar onFilterChange={setFilter} />
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <DataTable columns={columns} data={filteredItems} />
      </div>
    </div>
  );
}
