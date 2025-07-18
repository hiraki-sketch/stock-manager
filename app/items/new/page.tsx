"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCodeReader from "@/components/QRCodeReader";

export default function NewItemPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    stock: "",
    unit: "",
    checker: "",
  });

  const handleScan = (data: { name: string; stock: number; unit: string; checker: string }) => {
    setForm({
      name: data.name,
      stock: String(data.stock),
      unit: data.unit,
      checker: data.checker,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("登録失敗");

      alert("登録完了！");
      setForm({ name: "", stock: "", unit: "", checker: "" });
      router.push("/items");
    } catch (err) {
      console.error("登録失敗:", err);
      alert("登録に失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-start justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-screen-sm bg-white dark:bg-gray-800 shadow rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">新規商品登録</h1>
        <div className="mb-6 flex justify-center">
          <QRCodeReader onScanAction={handleScan} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "stock", "unit", "checker"].map((field, i) => (
            <div key={i}>
              <label className="block mb-1 text-sm font-medium">
                {field === "name" ? "商品名" : field === "stock" ? "在庫数" : field === "unit" ? "単位" : "チェック者"}
              </label>
              <input
                type={field === "stock" ? "number" : "text"}
                name={field}
                required
                value={form[field as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
              />
            </div>
          ))}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              登録する
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
