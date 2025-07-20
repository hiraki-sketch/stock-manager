"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

interface QRCodeReaderProps {
  onScanAction: (data: { name: string; barcode: string }) => void;
}

interface ScanResult {
  name: string;
  barcode: string;
}

export default function QRCodeReader({ onScanAction }: QRCodeReaderProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [isCameraOn, setIsCameraOn] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // デバイス判定
  const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // カメラ一覧を取得
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setCameras(videoDevices);
        
        // 背面カメラを優先選択
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("環境")
        );
        
        if (backCamera) {
          setSelectedCamera(backCamera.deviceId);
        } else if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("カメラ取得エラー:", error);
        if (isMobile) {
          alert("カメラの取得に失敗しました。カメラの許可を確認してください。");
        }
      }
    };

    getCameras();
    // クリーンアップでカメラ停止
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      setIsScanning(false);
      setIsCameraOn(false);
    };
  }, [isMobile]);

  // QRコード読み取り処理
  const parseQRData = (decodedText: string): ScanResult => {
    // JSON形式の場合
    try {
      const jsonData = JSON.parse(decodedText);
      if (jsonData.name && jsonData.barcode) {
        return {
          name: jsonData.name,
          barcode: jsonData.barcode
        };
      }
    } catch {
      // JSONでない場合は次へ
    }

    // カンマ区切りの場合
    if (decodedText.includes(",")) {
      const parts = decodedText.split(",");
      if (parts.length >= 2) {
        return {
          name: parts[0].trim(),
          barcode: parts[1].trim()
        };
      }
    }

    // 数値のみの場合（バーコード）
    if (/^\d+$/.test(decodedText)) {
      return {
        name: `商品_${decodedText}`,
        barcode: decodedText
      };
    }

    // その他の場合
    return {
      name: decodedText,
      barcode: decodedText
    };
  };

  // スキャン開始
  const startScan = () => {
    if (!selectedCamera || !containerRef.current) return;

    try {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // スキャン成功時の処理
          const scanResult = parseQRData(decodedText);
          
          if (isMobile) {
            alert(`読み取り成功: ${scanResult.name}`);
          }
          
          onScanAction(scanResult);
          stopScan();
        },
        (error) => {
          // エラーは無視（継続スキャン）
          console.log("スキャンエラー:", error);
        }
      );

      setIsScanning(true);
      setIsCameraOn(true);
    } catch (error) {
      console.error("スキャン開始エラー:", error);
      if (isMobile) {
        alert("スキャンの開始に失敗しました。");
      }
    }
  };

  // スキャン停止
  const stopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
    setIsCameraOn(false);
  };

  // カメラ切り替え
  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (isScanning) {
      stopScan();
      setTimeout(() => startScan(), 500);
    }
  };

  // カメラON/OFF切り替え
  const toggleCamera = () => {
    if (isCameraOn) {
      stopScan();
    } else {
      startScan();
    }
  };

  if (!isMobile) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">QRコード読み取りはモバイルデバイスでのみ利用できます。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* カメラ選択 */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          カメラを選択:
        </label>
        <select
          value={selectedCamera}
          onChange={(e) => handleCameraChange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
          disabled={isScanning}
        >
          {cameras.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `カメラ ${camera.deviceId.slice(0, 8)}...`}
            </option>
          ))}
        </select>
      </div>

      {/* カメラON/OFFボタン */}
      <button
        onClick={toggleCamera}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          isCameraOn
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isCameraOn ? "カメラOFF" : "カメラON"}
      </button>

      {/* QRコード読み取りエリア */}
      <div ref={containerRef} className="relative">
        <div id="qr-reader" className="w-full"></div>
        
        {/* スキャンガイド */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="flex items-center justify-center h-full">
              <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50 bg-opacity-50">
                <p className="text-blue-700 font-medium">QRコードを枠内に配置してください</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 使用方法 */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">使用方法:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• カメラを選択して「カメラON」を押してください</li>
          <li>• QRコードまたはバーコードを枠内に配置してください</li>
          <li>• 自動で読み取られ、商品情報が入力されます</li>
        </ul>
      </div>
    </div>
  );
}
