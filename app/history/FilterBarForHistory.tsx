// File: app/history/FilterBarForHistory.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Input } from "@/components/ui/input";

export default function FilterBarForHistory() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [checker, setChecker] = useState(searchParams.get("checker") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  // クエリを更新する関数（transition付き）
  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const newUrl = `${pathname}?${params.toString()}`;

    startTransition(() => {
      router.push(newUrl);
    });
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            商品名で絞り込む
          </label>
          <Input
            placeholder="商品名を入力"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              updateQuery("name", e.target.value);
            }}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            チェック者で絞り込む
          </label>
          <Input
            placeholder="チェック者を入力"
            value={checker}
            onChange={(e) => {
              setChecker(e.target.value);
              updateQuery("checker", e.target.value);
            }}
            className="w-full"
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            チェック年月で絞り込む
          </label>
          <Input
            type="month"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              updateQuery("date", e.target.value);
            }}
            className="w-full"
          />
        </div>
      </div>

      {isPending && <p className="text-sm text-gray-400 mt-2">検索中...</p>}
    </div>
  );
}
