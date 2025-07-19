"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type Props = {
  onScanAction: (data: { name: string; stock: number; unit: string; checker: string }) => void;
};

export default function QRCodeReader({ onScanAction }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraOptions, setCameraOptions] = useState<{ id: string; label: string }[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>();
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // モバイル判定
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // カメラ一覧を取得
  useEffect(() => {
    (async () => {
      const { Html5Qrcode } = await import("html5-qrcode");
      const cameras = await Html5Qrcode.getCameras();
      setCameraOptions(cameras);
      setSelectedCameraId(cameras[0]?.id);
    })();
  }, []);

  const startScanner = async () => {
    if (!ref.current || isCameraActive || !selectedCameraId) return;

    const { Html5Qrcode } = await import("html5-qrcode");
    const html5QrCode = new Html5Qrcode(ref.current.id);
    html5QrCodeRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        selectedCameraId,
        { fps: 10, qrbox: 250 },
        (decodedText: string) => {
          // スマホ版でのみデバッグ情報を表示
          if (isMobile) {
            console.log("読み取り内容:", decodedText);
            alert("読み取り内容: " + decodedText);
          }

          let data: { name: string; stock: number; unit: string; checker: string } | null = null;

          try {
            const parsed = JSON.parse(decodedText);
            if (
              typeof parsed.name === "string" &&
              typeof parsed.stock === "number" &&
              typeof parsed.unit === "string" &&
              typeof parsed.checker === "string"
            ) {
              data = parsed;
            }
          } catch {
            const parts = decodedText.split(",");
            if (parts.length === 4) {
              data = {
                name: parts[0],
                stock: Number(parts[1]),
                unit: parts[2],
                checker: parts[3],
              };
            } else if (/^\d{8,}$/.test(decodedText)) {
              data = {
                name: decodedText,
                stock: 1,
                unit: "個",
                checker: "",
              };
            }
          }

          if (data) {
            onScanAction(data);
            stopScanner(); // 自動停止（必要なければコメントアウト）
          }
        },
        () => {
          // 読み取り失敗時は無視
        }
      );

      setIsCameraActive(true);
    } catch (err) {
      console.error("カメラ起動エラー:", err);
      alert("カメラの使用が許可されていないか、起動に失敗しました。設定を確認してください。");
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn("カメラ停止失敗:", err);
      }
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="mb-2">
        <label className="mr-2">カメラ選択:</label>
        <select
          value={selectedCameraId}
          onChange={e => setSelectedCameraId(e.target.value)}
          disabled={isCameraActive}
          className="border rounded px-2 py-1"
        >
          {cameraOptions.map(cam => (
            <option key={cam.id} value={cam.id}>
              {cam.label || `カメラ${cam.id}`}
            </option>
          ))}
        </select>
      </div>
      <div id="qr-reader" ref={ref} style={{ width: 300, height: 300 }} />
      <button
        onClick={isCameraActive ? stopScanner : startScanner}
        className={`px-4 py-2 rounded text-white ${isCameraActive ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
      >
        {isCameraActive ? "カメラ停止" : "カメラ起動"}
      </button>
    </div>
  );
}
