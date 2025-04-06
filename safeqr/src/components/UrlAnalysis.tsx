// src/components/UrlAnalysis.tsx

"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, RotateCcw, Loader2 } from "lucide-react";

interface AnalysisResult {
  isSafe: boolean;
  explanation: string;
  score: number;
}

interface UrlAnalysisProps {
  url: string;
  onReset: () => void;
}

export default function UrlAnalysis({ url, onReset }: UrlAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
        });
        const data = await response.json();

        // Définir un seuil pour la sécurité (ex. 60)
        const isSafe = data.score >= 60;

        setAnalysis({
          isSafe,
          explanation: data.finalReport,
          score: data.score
        });
      } catch (error) {
        setAnalysis({
          isSafe: false,
          explanation: "Erreur lors de l'analyse.",
          score: 0
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalysis();
  }, [url]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg break-all">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Scanned URL:</p>
        <p className="mt-1 font-mono text-sm">{url}</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-6">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Analyzing URL and website...</p>
        </div>
      ) : analysis && (
        <div className={`p-4 rounded-lg ${analysis.isSafe 
            ? "bg-green-50 dark:bg-green-900/20" 
            : "bg-red-50 dark:bg-red-900/20"}`}>
          <div className="flex items-start gap-3">
            {analysis.isSafe ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <div>
              <h3 className={`font-medium ${analysis.isSafe 
                  ? "text-green-800 dark:text-green-200" 
                  : "text-red-800 dark:text-red-200"}`}>
                {analysis.isSafe ? "Site appears safe" : "Warning: Suspicious site detected"} (Score: {analysis.score})
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {analysis.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Scan Another QR Code
      </button>
    </div>
  );
}
