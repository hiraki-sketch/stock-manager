"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"

export default function ScanPage() {
  const qrRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!qrRef.current) return

    const html5QrCode = new Html5Qrcode("reader")
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        console.log("✅ QRコード:", decodedText)

        try {
          const data = JSON.parse(decodedText)
          const query = new URLSearchParams({
            name: data.name || "",
            unit: data.unit || "",
            stock: String(data.stock || ""),
            checker: data.checker || "",
          }).toString()

          router.push(`/items/new?${query}`)

        } catch (err) {
          alert("QRコードの形式が不正です（JSONを想定）")
          console.error("❌ JSON parse error:", err)
        }
      },
      (err) => {
        console.warn("❌ 読み取り失敗:", err)
      }
    )

    return () => {
      html5QrCode.stop().catch(console.error)
    }
  }, [router])

  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">📷 QRコードスキャン</h1>
      <div id="reader" className="w-full max-w-md mx-auto border rounded" ref={qrRef}></div>
    </main>
  )
}
