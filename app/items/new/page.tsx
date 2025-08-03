"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCodeReader from "@/components/QRCodeReader";
import { registerItem } from "@/app/items/actions";
import { createClient } from "@/lib/supabase/browserClient";

export default function NewItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    stock: "",
    unit: "",
    checker: "",
  });

  // モバイル判定
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  // モーダルの開閉状態
  const [showQRModal, setShowQRModal] = useState(false);

  // ログイン状態をチェック
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push("/login");
        return;
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleScan = (data: { name: string; barcode: string }) => {
    setForm({
      name: data.name,
      stock: "1",
      unit: "個",
      checker: "",
    });
    setShowQRModal(false); // スキャン後にモーダルを閉じる
  };

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">読み込み中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex items-start justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-screen-sm bg-white dark:bg-gray-800 shadow rounded-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">新規商品登録</h1>
        {/* モバイル版でのみQRコードリーダーモーダルを表示 */}
        {isMobile && (
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              onClick={() => setShowQRModal(true)}
            >
              QRコードで自動入力
            </button>
            {/* モーダル */}
            {showQRModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative w-full max-w-xs mx-auto">
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-xl"
                    onClick={() => setShowQRModal(false)}
                  >
                    ×
                  </button>
                  <QRCodeReader onScanAction={handleScan} />
                </div>
              </div>
            )}
          </div>
        )}
        {!isMobile && (
          <div className="mb-6 text-center p-4 bg-White-100 rounded">
            <p>QRコード読み取りはモバイル端末でご利用ください。</p>
          </div>
        )}
        <form action={registerItem} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">商品名</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">在庫数</label>
            <input
              type="number"
              name="stock"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">単位</label>
            <input
              name="unit"
              required
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">チェック者</label>
            <input
              name="checker"
              required
              value={form.checker}
              onChange={(e) => setForm({ ...form, checker: e.target.value })}
              className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              登録する
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
