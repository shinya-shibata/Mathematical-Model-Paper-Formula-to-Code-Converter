import React, { useState, useEffect } from "react";
import { InteractiveParam } from "../types";
import { Sliders, RefreshCw, Play, BarChart2 } from "lucide-react";

interface InteractiveSandboxProps {
  params: InteractiveParam[];
  title: string;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({ params, title }) => {
  const [paramValues, setParamValues] = useState<Record<string, number>>({});
  const [plotData, setPlotData] = useState<{ x: number; y: number }[]>([]);

  // Initialize parameter values
  useEffect(() => {
    const initial: Record<string, number> = {};
    params.forEach((p) => {
      initial[p.key] = p.defaultVal;
    });
    setParamValues(initial);
  }, [params]);

  // Recalculate simulation data points based on parameter sliders
  useEffect(() => {
    if (Object.keys(paramValues).length === 0) return;

    const points: { x: number; y: number }[] = [];
    const N = 100;

    // Standard simulation curves based on common parameters or fallback dampening function
    for (let i = 0; i <= N; i++) {
      const x = i / 10;
      let y = 0;

      // Check if parameters resemble GARCH, Lotka-Volterra, Attention, Black-Scholes, or SIR
      const alpha = paramValues["alpha"] ?? paramValues["a"] ?? 0.1;
      const beta = paramValues["beta"] ?? paramValues["b"] ?? 0.5;
      const gamma = paramValues["gamma"] ?? paramValues["g"] ?? 0.2;
      const temp = paramValues["temperature"] ?? paramValues["d_k"] ?? 1.0;
      const sigma = paramValues["sigma"] ?? 0.2;

      // Flexible math simulation curve calculation
      if (paramValues["omega"] !== undefined) {
        // GARCH-like volatility curve
        const omega = paramValues["omega"] ?? 0.01;
        y = Math.sqrt(omega + alpha * Math.pow(Math.sin(x), 2) + beta * Math.cos(x / 2) * Math.cos(x / 2));
      } else if (paramValues["S"] !== undefined || paramValues["K"] !== undefined) {
        // Black Scholes style option curve
        const S = paramValues["S"] ?? x * 10;
        const K = paramValues["K"] ?? 50;
        y = Math.max(0, S * (1 + 0.1 * sigma * x) - K * Math.exp(-0.05 * x));
      } else if (paramValues["beta"] !== undefined && paramValues["gamma"] !== undefined) {
        // SIR model I(t) curve approximation
        const R0 = alpha > 0 ? alpha / beta : beta / gamma;
        y = (100 * Math.exp(R0 * x * 0.1)) / (1 + Math.exp(R0 * x * 0.1) * 0.2);
      } else {
        // Generic damped oscillator or parameterized function
        y = Math.exp(-0.05 * x * gamma) * Math.sin(x * alpha * 2 + beta) * Math.cos(x / (temp || 1));
      }

      points.push({ x, y: Number.isNaN(y) ? 0 : y });
    }

    setPlotData(points);
  }, [paramValues]);

  const handleSliderChange = (key: string, val: number) => {
    setParamValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    params.forEach((p) => {
      initial[p.key] = p.defaultVal;
    });
    setParamValues(initial);
  };

  // Min & Max Y for scaling SVG plot
  const yValues = plotData.map((p) => p.y);
  const minY = Math.min(...(yValues.length ? yValues : [0]));
  const maxY = Math.max(...(yValues.length ? yValues : [1]));
  const yRange = maxY - minY || 1;

  const width = 600;
  const height = 220;
  const padding = 30;

  const pathD = plotData.reduce((acc, pt, idx) => {
    const px = padding + (idx / (plotData.length - 1)) * (width - 2 * padding);
    const py = height - padding - ((pt.y - minY) / yRange) * (height - 2 * padding);
    return idx === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`;
  }, "");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-semibold text-slate-800">インタラクティブ・パラメータ調整サンドボックス</h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>リセット</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel */}
        <div className="space-y-3 lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-4">
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>パラメータ制御 (Live Sliders)</span>
          </div>

          {params.map((p) => (
            <div key={p.key} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>{p.label}</span>
                <span className="font-mono text-sky-700 font-bold">{paramValues[p.key] ?? p.defaultVal}</span>
              </div>
              <input
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={paramValues[p.key] ?? p.defaultVal}
                onChange={(e) => handleSliderChange(p.key, parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              {p.description && <p className="text-[10px] text-slate-500 leading-snug">{p.description}</p>}
            </div>
          ))}
        </div>

        {/* SVG Live Simulation Plot */}
        <div className="lg:col-span-2 flex flex-col justify-center bg-slate-900 rounded-xl p-3 border border-slate-800 relative">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 px-2">
            <span className="font-mono text-sky-400">f(x, \theta) - シミュレーション挙動感度曲線</span>
            <span className="text-emerald-400 font-mono">y_min: {minY.toFixed(2)}, y_max: {maxY.toFixed(2)}</span>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeDasharray="3 3" />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#334155"
              strokeDasharray="3 3"
            />

            {/* Path */}
            <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Gradient Area under curve */}
            <path
              d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
              fill="url(#skyGradient)"
              opacity="0.25"
            />

            <defs>
              <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <div className="mt-2 text-center text-[11px] text-slate-400 font-mono">
            パラメータの変更に伴う数値シミュレーション特性曲線の即時アップデート
          </div>
        </div>
      </div>
    </div>
  );
};
