// safeqr/src/app/page.tsx

"use client";

import { Camera } from "lucide-react";
import { useState } from "react";
import QrScanner from "@/components/QrScanner";
import UrlAnalysis from "@/components/UrlAnalysis";

export default function Home() {
  const [scannedUrl, setScannedUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              SafeQr
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Scan QR codes securely with AI-powered phishing detection
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            {!isScanning && !scannedUrl && (
              <button
                onClick={() => setIsScanning(true)}
                className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Start Scanning
              </button>
            )}

            {isScanning && (
              <QrScanner
                onResult={(result) => {
                  setScannedUrl(result);
                  setIsScanning(false);
                }}
                onClose={() => setIsScanning(false)}
              />
            )}

            {scannedUrl && (
              <UrlAnalysis 
                url={scannedUrl}
                onReset={() => {
                  setScannedUrl(null);
                  setIsScanning(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}