import React, { useState } from "react";
import { Phase4Data } from "../types";
import { Copy, Check, TestTube2, LineChart, ShieldCheck } from "lucide-react";

interface TestAndVerifyViewProps {
  phase4: Phase4Data;
}

export const TestAndVerifyView: React.FC<TestAndVerifyViewProps> = ({ phase4 }) => {
  const [copiedTest, setCopiedTest] = useState(false);
  const [copiedViz, setCopiedViz] = useState(false);

  const copyText = (text: string, type: "test" | "viz") => {
    navigator.clipboard.writeText(text);
    if (type === "test") {
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2000);
    } else {
      setCopiedViz(true);
      setTimeout(() => setCopiedViz(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Verification Points Checklist */}
      <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>数学的正当性検証の要件項目 (Validation Verification Points)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phase4.validationPoints.map((pt, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{pt}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pytest Code */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <TestTube2 className="w-4 h-4 text-emerald-400" />
              test_model.py (pytest ユニットテスト)
            </span>
            <button
              onClick={() => copyText(phase4.pytestCode, "test")}
              className="flex items-center gap-1 px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors border border-slate-700 cursor-pointer"
            >
              {copiedTest ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTest ? "コピー完了" : "テスト用コード"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-200 leading-relaxed overflow-x-auto max-h-[400px] overflow-y-auto bg-slate-950">
            {phase4.pytestCode}
          </pre>
        </div>

        {/* Visualization / Property Script */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <span className="font-mono text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-sky-400" />
              visualize_and_property_test.py (Matplotlib/プロパティ描画)
            </span>
            <button
              onClick={() => copyText(phase4.visualizationCode, "viz")}
              className="flex items-center gap-1 px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors border border-slate-700 cursor-pointer"
            >
              {copiedViz ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedViz ? "コピー完了" : "描画用コード"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-sky-200 leading-relaxed overflow-x-auto max-h-[400px] overflow-y-auto bg-slate-950">
            {phase4.visualizationCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
