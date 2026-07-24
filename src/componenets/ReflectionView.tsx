import React from "react";
import { Phase2Data } from "../types";
import { AlertTriangle, Zap, Ban, CheckCircle2, ShieldCheck } from "lucide-react";

interface ReflectionViewProps {
  phase2: Phase2Data;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({ phase2 }) => {
  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
            Phase 2: 実装上の事前リフレクション評価 (Pre-implementation Reflection)
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">{phase2.reflectionSummary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Numerical Stability */}
        <div className="bg-white rounded-xl border border-rose-100 shadow-xs p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-rose-700 border-b border-rose-100 pb-2">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <h4 className="text-xs font-bold text-slate-800">1. 数値的安定性 (Stability)</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 flex-1">
            {phase2.numericalStability.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-rose-50/50 p-2 rounded-lg border border-rose-100/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 2. Computational Efficiency */}
        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-sky-700 border-b border-sky-100 pb-2">
            <Zap className="w-4 h-4 text-sky-500 shrink-0" />
            <h4 className="text-xs font-bold text-slate-800">2. 計算効率 & ベクトル化</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 flex-1">
            {phase2.computationalEfficiency.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-sky-50/50 p-2 rounded-lg border border-sky-100/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Singularities & Boundary Conditions */}
        <div className="bg-white rounded-xl border border-amber-100 shadow-xs p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-amber-700 border-b border-amber-100 pb-2">
            <Ban className="w-4 h-4 text-amber-500 shrink-0" />
            <h4 className="text-xs font-bold text-slate-800">3. 特異点 & 境界条件</h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 flex-1">
            {phase2.singularitiesAndBoundaries.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
