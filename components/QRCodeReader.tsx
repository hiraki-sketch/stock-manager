"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRCodeReaderProps {
  onScanAction: (data: { name: string; barcode: string }) => void;
}

interface ScanResult {
  name: string;
  barcode: string;
}

export default function QRCodeReader({ onScanAction }: QRCodeReaderProps) {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  // デバイス判定
  const isMobile = typeof window !== 'undefined' && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // カメラ一覧取得
  const fetchCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    setCameras(videoDevices);
    const backCamera = videoDevices.find(device =>
      device.label.toLowerCase().includes('back') ||
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('環境')
    );
    if (backCamera) setSelectedCamera(backCamera.deviceId);
    else if (videoDevices.length > 0) setSelectedCamera(videoDevices[0].deviceId);
  };

  // QRコード読み取り処理
  const parseQRData = (decodedText: string): ScanResult => {
    try {
      const jsonData = JSON.parse(decodedText);
      if (jsonData.name && jsonData.barcode) {
        return {
          name: jsonData.name,
          barcode: jsonData.barcode
        };
      }
    } catch {}
    if (decodedText.includes(',')) {
      const parts = decodedText.split(',');
      if (parts.length >= 2) {
        return {
          name: parts[0].trim(),
          barcode: parts[1].trim()
        };
      }
    }
    if (/^\d+$/.test(decodedText)) {
      return {
        name: `商品_${decodedText}`,
        barcode: decodedText
      };
    }
    return {
      name: decodedText,
      barcode: decodedText
    };
  };

  // カメラON
  const startCamera = async () => {
    if (!selectedCamera || !qrRef.current) return;
    if (html5QrCodeRef.current) {
      try {
        await (html5QrCodeRef.current as Html5Qrcode).stop();
      } catch {}
      try {
        await (html5QrCodeRef.current as Html5Qrcode).clear();
      } catch {}
    }
    html5QrCodeRef.current = new Html5Qrcode(qrRef.current.id);
    await (html5QrCodeRef.current as Html5Qrcode).start(
      { deviceId: { exact: selectedCamera } },
      { fps: 10, qrbox: 250 },
      (decodedText: string) => {
        const scanResult = parseQRData(decodedText);
        if (isMobile) {
          alert(`読み取り成功: ${scanResult.name}`);
        }
        onScanAction(scanResult);
        stopCamera();
      },
      () => {} // エラーコールバック（何もしない）
    );
    setIsCameraOn(true);
  };

  // カメラOFF
  const stopCamera = async () => {
    if (html5QrCodeRef.current) {
      try {
        await (html5QrCodeRef.current as Html5Qrcode).stop();
      } catch {}
      try {
        await (html5QrCodeRef.current as Html5Qrcode).clear();
      } catch {}
      html5QrCodeRef.current = null;
    }
    setIsCameraOn(false);
  };

  // カメラ切り替え
  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    if (isCameraOn) {
      stopCamera().then(() => startCamera());
    }
  };

  // アンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isMobile) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">QRコード読み取りはモバイルデバイスでのみ利用できます。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* カメラ一覧取得ボタン */}
      <button
        type="button"
        className="mb-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={fetchCameras}
      >
        カメラ一覧を取得
      </button>
      {/* カメラ選択 */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-700">
          カメラを選択:
        </label>
        <select
          value={selectedCamera}
          onChange={e => handleCameraChange(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
          disabled={isCameraOn}
        >
          {cameras.map((camera, idx) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label
                ? camera.label
                : `カメラ${idx + 1}（${camera.deviceId.slice(0, 8)}...）`}
            </option>
          ))}
        </select>
      </div>
      {/* カメラON/OFFボタン */}
      <button
        onClick={isCameraOn ? stopCamera : startCamera}
        className={`w-full py-2 px-4 rounded-md font-medium ${
          isCameraOn
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isCameraOn ? 'カメラOFF' : 'カメラON'}
      </button>
      {/* QRコード読み取りエリア */}
      <div ref={qrRef} id="qr-reader" className="w-full" />
      {/* 使用方法 */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="font-medium text-gray-900 mb-2">使用方法:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 「カメラ一覧を取得」ボタンでカメラを取得</li>
          <li>• カメラを選択して「カメラON」を押してください</li>
          <li>• QRコードまたはバーコードを枠内に配置してください</li>
          <li>• 自動で読み取られ、商品情報が入力されます</li>
        </ul>
      </div>
    </div>
  );
}
