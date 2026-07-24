import React, { useState } from "react";
import { Phase3Data } from "../types";
import { Copy, Check, Code, Sparkles, Terminal } from "lucide-react";

interface CodeViewerProps {
  phase3: Phase3Data;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ phase3 }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(phase3.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = phase3.code.split("\n");

  return (
    <div className="space-y-4">
      {/* Key Highlights */}
      <div className="bg-slate-900 rounded-xl p-4 text-xs text-slate-200 border border-slate-800">
        <div className="flex items-center gap-2 text-sky-400 font-semibold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>堅牢化コードの実装設計ポイント (Key Design Architecture)</span>
        </div>
        <p className="text-slate-300 leading-relaxed mb-3">{phase3.explanation}</p>

        <div className="flex flex-wrap gap-2">
          {phase3.keyHighlights.map((hl, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-sky-300 border border-slate-700 rounded-md text-[11px]"
            >
              <Terminal className="w-3 h-3 text-sky-400" />
              {hl}
            </span>
          ))}
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="ml-2 font-mono text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-sky-400" />
              model_implementation.py ({phase3.language})
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors border border-slate-700 font-medium cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">コピー完了</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>コードをコピー</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-100 max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => {
                const isComment = line.trim().startsWith("#") || line.trim().startsWith('"""');
                const isShapeComment = line.includes("# [") || line.includes("#(");
                const isDocstringMath = line.includes("$") || line.includes("LaTeX") || line.includes("Equation");

                return (
                  <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                    <td className="pr-4 text-right text-slate-600 select-none font-mono text-[11px] w-8 shrink-0">
                      {i + 1}
                    </td>
                    <td className="pl-2 text-slate-200 whitespace-pre">
                      {isShapeComment ? (
                        <span className="text-amber-300 font-semibold">{line}</span>
                      ) : isDocstringMath ? (
                        <span className="text-emerald-300 italic">{line}</span>
                      ) : isComment ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : (
                        line
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
