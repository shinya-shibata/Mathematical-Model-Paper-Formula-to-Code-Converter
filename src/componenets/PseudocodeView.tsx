import React from "react";
import { ListOrdered, ArrowRight } from "lucide-react";

interface PseudocodeViewProps {
  pseudocode: string;
  steps: string[];
}

export const PseudocodeView: React.FC<PseudocodeViewProps> = ({ pseudocode, steps }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Algorithm Flow Steps */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <ListOrdered className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-semibold text-slate-800">依存関係と計算順序 (Algorithm Steps)</h3>
        </div>
        <ol className="space-y-2.5">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-semibold text-[11px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1">
                <span className="leading-relaxed">{step}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Pseudocode Editor Display */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner flex flex-col">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
          <span className="text-[11px] font-sans tracking-wide uppercase text-slate-400 flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            アルゴリズム擬似コード (Pseudocode)
          </span>
          <span className="text-[10px] text-slate-500">Phase 1 Output</span>
        </div>
        <pre className="text-slate-200 leading-relaxed font-mono whitespace-pre-wrap flex-1 bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
          {pseudocode}
        </pre>
      </div>
    </div>
  );
};
