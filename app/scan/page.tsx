"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { createClient } from "@/lib/supabase/browserClient";

export default function ScanPage() {
  const qrRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (!qrRef.current || isLoading) return;

    const html5QrCode = new Html5Qrcode("reader");
    setIsScanning(true);

    html5QrCode.start(
      { facingMode: "environment" },
      { 
        fps: 10, 
        qrbox: { 
          width: Math.min(250, window.innerWidth * 0.8), 
          height: Math.min(250, window.innerWidth * 0.8) 
        } 
      },
      (decodedText) => {
        console.log("✅ QRコード:", decodedText);

        try {
          const data = JSON.parse(decodedText);
          const query = new URLSearchParams({
            name: data.name || "",
            unit: data.unit || "",
            stock: String(data.stock || ""),
            checker: data.checker || "",
          }).toString();

          router.push(`/items/new?${query}`);
        } catch (err) {
          alert("QRコードの形式が不正です（JSONを想定）");
          console.error("❌ JSON parse error:", err);
        }
      },
      (err) => {
        console.warn("❌ 読み取り失敗:", err);
      },
    );

    return () => {
      setIsScanning(false);
      html5QrCode.stop().catch(console.error);
    };
  }, [router, isLoading]);

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
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          📷 QRコードスキャン
        </h1>
        
        <div className="mb-6">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4">
            QRコードをカメラに映して商品情報を読み取ります
          </p>
          {isScanning && (
            <div className="text-sm text-blue-600 dark:text-blue-400">
              🔍 スキャン中...
            </div>
          )}
        </div>

        <div className="relative">
          <div
            id="reader"
            className="w-full max-w-sm sm:max-w-md mx-auto border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg"
            ref={qrRef}
            style={{
              minHeight: '300px',
              maxHeight: '400px'
            }}
          ></div>
          
          {/* スキャンガイド */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-blue-500 rounded-lg opacity-50"></div>
          </div>
        </div>

        <div className="mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <p>• QRコードを枠内に合わせてください</p>
          <p>• 明るい場所で読み取りしてください</p>
          <p>• カメラの許可が必要です</p>
        </div>
      </div>
    </main>
  );
}
