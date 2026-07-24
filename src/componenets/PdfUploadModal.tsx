import React, { useState } from "react";
import { Upload, X, FileText, Loader2, Check, FileCheck, ShieldAlert } from "lucide-react";

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (latex: string, context: string, title?: string) => void;
}

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({ isOpen, onClose, onExtracted }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        setFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!fileBase64 || !selectedFile) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileBase64: fileBase64,
          mimeType: selectedFile.type || (selectedFile.name.endsWith(".pdf") ? "application/pdf" : "image/png"),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "PDFドキュメントの解析に失敗しました。");
      }

      const data = await response.json();
      onExtracted(data.extractedLatex || "", data.paperContext || "", data.detectedTitle);
      onClose();
    } catch (err: any) {
      setError(err?.message || "PDF解析処理中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">論文 PDF ドキュメントから数式抽出</h3>
              <p className="text-[11px] text-slate-500">Gemini 3.6 Flash PDF 解析エンジン</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            論文の PDF ファイル（または数式スキャン画像）をアップロードしてください。Gemini が PDF 内のメイン数式（LaTeX形式）、式番号、各変数の定義、次元、前提条件を自動的に一括抽出します。
          </p>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-6 text-center bg-slate-50/50 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept=".pdf,application/pdf,image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <FileCheck className="w-8 h-8 text-rose-600 shrink-0" />
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || "PDF Document"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-sky-600 transition-colors" />
                <p className="text-xs font-semibold text-slate-700">クリックまたは PDF ファイルをドラッグ＆ドロップ</p>
                <p className="text-[11px] text-slate-400">PDF (.pdf) または数式画像 (PNG, JPG) 対応</p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              キャンセル
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!fileBase64 || loading}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>PDFを解析中...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>PDFから数式を抽出</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
