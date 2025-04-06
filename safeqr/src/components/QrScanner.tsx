// src/components/QrScanner.tsx

"use client";

import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X } from "lucide-react";

interface QrScannerProps {
  onResult: (result: string) => void;
  onClose: () => void;
}

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerRef.current.render(
      (decodedText) => {
        if (scannerRef.current) {
          scannerRef.current.clear();
          onResult(decodedText);
        }
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [onResult]);

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-2 rounded-full bg-gray-800/50 text-white hover:bg-gray-800/70 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div id="qr-reader" className="w-full" />
    </div>
  );
}