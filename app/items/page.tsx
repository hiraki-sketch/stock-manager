"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/items/columns";
import { Item } from "@/types/item";
import { useRouter } from "next/navigation";
import FilterBar from "./FilterBar";
import { useDebounce } from "@/utils/useDebounce";

export function ItemsPage() {
  const [filters, setFilters] = useState({ name: "", checker: "", date: "" });
  const debouncedName = useDebounce(filters.name, 300);
  const debouncedChecker = useDebounce(filters.checker, 300);
  const debouncedDate = useDebounce(filters.date, 300);
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // データ取得（サーバー側フィルタリング）
  useEffect(() => {
  const fetchItems = async () => {
    const supabase = createClient();
    let query = supabase
      .from("items")
      .select("*")
      .eq("deleted", false);

    if (debouncedName.trim().length >= 4) {
      query = query.ilike("name", `%${debouncedName}%`);
    }

    if (debouncedChecker.trim().length >= 4) {
      query = query.ilike("checker", `%${debouncedChecker}%`);
    }

    if (debouncedDate.trim().length === 7) {
      const [year, month] = debouncedDate.split("-");
      const start = `${year}-${month}-01`;
      const nextMonth = month === "12" ? "01" : String(Number(month) + 1).padStart(2, "0");
      const nextYear = month === "12" ? String(Number(year) + 1) : year;
      const end = `${nextYear}-${nextMonth}-01`;
      query = query.gte("day", start).lt("day", end);
    }

    const { data, error } = await query.order("updated_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  fetchItems();
}, [debouncedName, debouncedChecker, debouncedDate]);
  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
        <p>読み込み中...</p>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
        <p className="text-red-500">エラー: {error}</p>
      </main>
    );

  if (items.length === 0)
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
        <p>表示できる在庫データがありません。</p>
      </main>
    );

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 sm:px-6 py-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">在庫一覧</h1>
        <FilterBar onFilterChange={setFilters} />
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto">
          <DataTable columns={columns} data={items} />
        </div>
      </div>
    </main>
  );
}

export default ItemsPage;
