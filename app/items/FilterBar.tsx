// app/items/FilterBar.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [checker, setChecker] = useState(searchParams.get("checker") || "");
  const [date, setDate] = useState(searchParams.get("date") || "");

  useEffect(() => {
    const params = new URLSearchParams();

    if (name.trim().length >= 2) {
      params.set("name", name);
    }

    if (checker.trim().length >= 2) {
      params.set("checker", checker);
    }

    if (date.length === 7) {
      params.set("date", date);
    }

    const query = params.toString();
    router.push(`/items${query ? `?${query}` : ""}`);
  }, [name, checker, date, router]);

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
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            チェック者で絞り込む
          </label>
          <Input
            placeholder="チェック者を入力"
            value={checker}
            onChange={(e) => setChecker(e.target.value)}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            チェック年月で絞り込む
          </label>
          <Input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
