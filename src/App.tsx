import React, { useState } from "react";
import { PRESET_FORMULAS } from "./presets";
import { MathConversionResult, PresetFormula } from "./types";
import { LatexMath } from "./components/LatexMath";
import { SymbolTable } from "./components/SymbolTable";
import { PseudocodeView } from "./components/PseudocodeView";
import { ReflectionView } from "./components/ReflectionView";
import { CodeViewer } from "./components/CodeViewer";
import { TestAndVerifyView } from "./components/TestAndVerifyView";
import { InteractiveSandbox } from "./components/InteractiveSandbox";
import { PdfUploadModal } from "./components/PdfUploadModal";
import {
  Calculator,
  Sparkles,
  BookOpen,
  Code2,
  Cpu,
  FileCode2,
  FileText,
  Loader2,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Download,
  Terminal,
  ShieldAlert,
  ChevronRight,
  Layers,
  ArrowRight,
  Send,
} from "lucide-react";

export default function App() {
  const [latexInput, setLatexInput] = useState<string>(PRESET_FORMULAS[0].latex);
  const [paperContext, setPaperContext] = useState<string>(PRESET_FORMULAS[0].context);
  const [targetLanguage, setTargetLanguage] = useState<string>("Python / NumPy");
  const [activePresetCategory, setActivePresetCategory] = useState<string>("ALL");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MathConversionResult | null>(null);

  const [activeTab, setActiveTab] = useState<"phase1" | "phase2" | "phase3" | "phase4" | "sandbox">("phase1");
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Preset filter
  const categories = ["ALL", "AI/ML", "Finance", "Control/Signal", "Biology/Epidemiology", "Physics/Simulation"];

  const filteredPresets = PRESET_FORMULAS.filter(
    (p) => activePresetCategory === "ALL" || p.category === activePresetCategory
  );

  const handleSelectPreset = (preset: PresetFormula) => {
    setLatexInput(preset.latex);
    setPaperContext(preset.context);
  };

  const handleConvert = async () => {
    if (!latexInput.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/convert-math", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latexInput,
          paperContext,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "数式コード変換リクエストに失敗しました。");
      }

      const data: MathConversionResult = await response.json();
      setResult(data);
      setActiveTab("phase1");
    } catch (err: any) {
      setError(err?.message || "変換中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfExtracted = (extractedLatex: string, extractedContext: string, detectedTitle?: string) => {
    if (extractedLatex) setLatexInput(extractedLatex);
    if (extractedContext) setPaperContext(extractedContext);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-sky-600 to-indigo-600 rounded-xl text-white shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">数理モデル・論文数式コード変換器</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono border border-sky-500/30 font-medium">
                  v2.5 Gemini Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                LaTeX数式および論文PDFから記号辞書・数値安定性評価・堅牢実装・検証テストを段階的に生成
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/80 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-rose-400" />
              <span>論文PDFから数式抽出</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Preset Selector Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>論文・数理モデル・計算レシピ ライブラリ (Preset Equations)</span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActivePresetCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors font-medium whitespace-nowrap cursor-pointer ${
                    activePresetCategory === cat
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  latexInput === preset.latex
                    ? "bg-sky-50/80 border-sky-300 ring-2 ring-sky-500/20 shadow-xs"
                    : "bg-slate-50/50 border-slate-200 hover:bg-white hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-sky-700 bg-sky-100/70 px-1.5 py-0.5 rounded-md">
                      {preset.category}
                    </span>
                    {latexInput === preset.latex && <CheckCircle className="w-3.5 h-3.5 text-sky-600" />}
                  </div>
                  <h4 className="font-semibold text-slate-800 line-clamp-1 mb-1">{preset.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{preset.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Equation & Context Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-sky-600" />
                  <h2 className="text-sm font-bold text-slate-800">1. 対象数式 (LaTeX形式) & 論文補足文脈の入力</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">出力対象:</span>
                  <select
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-slate-50 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="Python / NumPy">Python / NumPy</option>
                    <option value="Python / SciPy">Python / SciPy</option>
                    <option value="PyTorch">PyTorch (Tensor/CUDA)</option>
                    <option value="JAX">JAX (jax.numpy)</option>
                  </select>
                </div>
              </div>

              {/* LaTeX Input Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  LaTeX 数式文字列 (Mathematical Formulation)
                </label>
                <textarea
                  rows={3}
                  value={latexInput}
                  onChange={(e) => setLatexInput(e.target.value)}
                  placeholder="例: \sigma_t^2 = \omega + \alpha \epsilon_{t-1}^2 + \beta \sigma_{t-1}^2"
                  className="w-full text-xs font-mono p-3 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed text-slate-900"
                />
              </div>

              {/* Real-time LaTeX Preview */}
              <div className="bg-slate-900 rounded-xl p-4 text-white text-center border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-1">
                  リアルタイム LaTeX レンダリング プレビュー
                </div>
                <div className="py-2 overflow-x-auto text-sky-300">
                  <LatexMath math={latexInput || "\\text{数式を入力してください}"} block />
                </div>
              </div>

              {/* Paper Context Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  論文の背景・次元定義・補足コンテキスト (Optional Context)
                </label>
                <input
                  type="text"
                  value={paperContext}
                  onChange={(e) => setPaperContext(e.target.value)}
                  placeholder="例: 行列 Q の形状は [Batch, N, d_k]、時間ステップ t における条件付き分散..."
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleConvert}
                disabled={loading || !latexInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>4フェーズ堅牢コード変換を計算実行中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-sky-200" />
                    <span>フェーズ1〜4の解析および堅牢コード生成を実行</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Phase Workflow & System Persona Card */}
          <div className="space-y-4">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-5 text-white border border-slate-800 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Cpu className="w-5 h-5 text-sky-400" />
                <h3 className="text-xs font-bold tracking-wider uppercase text-slate-200">
                  エキスパートエンジニア変換ワークフロー
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 font-mono font-bold text-[10px]">
                    Phase 1
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200">構造化・記号化・解析</div>
                    <div className="text-[11px] text-slate-400">数式辞書 (Symbol Dictionary) と擬似コード生成</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px]">
                    Phase 2
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200">実装上の課題分析 (リフレクション)</div>
                    <div className="text-[11px] text-slate-400">数値的安定性・ベクトル化・特異点事前評価</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 font-mono font-bold text-[10px]">
                    Phase 3
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200">堅牢実装コードの生成</div>
                    <div className="text-[11px] text-slate-400">LaTeX docstring・形状コメント・例外処理組み込み</div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px]">
                    Phase 4
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200">数学的正当性の検証コード</div>
                    <div className="text-[11px] text-slate-400">pytest ユニットテスト & Matplotlib 可視化</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <div className="font-bold">変換処理エラー</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Title & Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-sky-700 font-mono mb-1">
                  【変換結果】 {result.title}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">{result.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed">{result.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-medium">生成形式:</span>
                <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 font-mono text-xs rounded-lg font-semibold">
                  {targetLanguage}
                </span>
              </div>
            </div>

            {/* Navigation Phase Tabs */}
            <div className="flex border-b border-slate-200 gap-1 overflow-x-auto bg-white px-2 rounded-xl border">
              <button
                onClick={() => setActiveTab("phase1")}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "phase1"
                    ? "border-sky-600 text-sky-600 bg-sky-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px]">
                  P1
                </span>
                <span>Phase 1: 構造化 & 記号辞書</span>
              </button>

              <button
                onClick={() => setActiveTab("phase2")}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "phase2"
                    ? "border-amber-600 text-amber-600 bg-amber-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">
                  P2
                </span>
                <span>Phase 2: 実装課題リフレクション</span>
              </button>

              <button
                onClick={() => setActiveTab("phase3")}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "phase3"
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">
                  P3
                </span>
                <span>Phase 3: 生産実装コード</span>
              </button>

              <button
                onClick={() => setActiveTab("phase4")}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeTab === "phase4"
                    ? "border-emerald-600 text-emerald-600 bg-emerald-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">
                  P4
                </span>
                <span>Phase 4: 検証・テストコード</span>
              </button>

              {result.interactiveParams && result.interactiveParams.length > 0 && (
                <button
                  onClick={() => setActiveTab("sandbox")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors ${
                    activeTab === "sandbox"
                      ? "border-purple-600 text-purple-600 bg-purple-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px]">
                    S
                  </span>
                  <span>パラメータ感度サンドボックス</span>
                </button>
              )}
            </div>

            {/* Tab Views Content */}
            <div className="space-y-6">
              {activeTab === "phase1" && (
                <div className="space-y-6">
                  <SymbolTable symbols={result.phase1.symbolDictionary} />
                  <PseudocodeView
                    pseudocode={result.phase1.pseudocode}
                    steps={result.phase1.algorithmSteps}
                  />
                </div>
              )}

              {activeTab === "phase2" && <ReflectionView phase2={result.phase2} />}

              {activeTab === "phase3" && <CodeViewer phase3={result.phase3} />}

              {activeTab === "phase4" && <TestAndVerifyView phase4={result.phase4} />}

              {activeTab === "sandbox" && result.interactiveParams && (
                <InteractiveSandbox params={result.interactiveParams} title={result.title} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>数理モデル・論文数式コード変換器 — Powered by Google AI Studio & Gemini Models</p>
      </footer>

      {/* PDF Upload Modal */}
      <PdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onExtracted={handlePdfExtracted}
      />
    </div>
  );
}
