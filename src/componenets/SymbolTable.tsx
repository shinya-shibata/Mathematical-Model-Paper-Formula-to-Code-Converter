import React, { useState } from "react";
import { SymbolItem } from "../types";
import { LatexMath } from "./LatexMath";
import { Search, Filter, Hash, Database, Code, ShieldAlert } from "lucide-react";

interface SymbolTableProps {
  symbols: SymbolItem[];
}

export const SymbolTable: React.FC<SymbolTableProps> = ({ symbols }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const types = Array.from(new Set(symbols.map((s) => s.type.toLowerCase())));

  const filteredSymbols = symbols.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.varName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || item.type.toLowerCase() === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeBadgeClass = (typeStr: string) => {
    const t = typeStr.toLowerCase();
    if (t.includes("scalar")) return "bg-sky-50 text-sky-700 border-sky-200";
    if (t.includes("vector")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (t.includes("matrix")) return "bg-violet-50 text-violet-700 border-violet-200";
    if (t.includes("tensor")) return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-800">数式辞書 (Symbol Dictionary)</h3>
          <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-medium">
            {symbols.length} 記号
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 sm:flex-initial min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="記号・意味・コード名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg py-1.5 px-2 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">すべての型</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-medium">
              <th className="py-2.5 px-4 w-28">記号 (LaTeX)</th>
              <th className="py-2.5 px-4">数学的・物理的意味</th>
              <th className="py-2.5 px-4 w-24">データ型</th>
              <th className="py-2.5 px-4 w-28">次元・形状</th>
              <th className="py-2.5 px-4 w-32">コード変数名</th>
              <th className="py-2.5 px-4">定義域・制約条件</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredSymbols.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  該当する記号が見つかりませんでした
                </td>
              </tr>
            ) : (
              filteredSymbols.map((item, idx) => (
                <tr key={idx} className="hover:bg-sky-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 bg-slate-50/30">
                    <LatexMath math={item.symbol} />
                  </td>
                  <td className="py-3 px-4 font-normal text-slate-800">{item.meaning}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-medium ${getTypeBadgeClass(item.type)}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.dimension}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-sky-700 font-semibold bg-sky-50/50 rounded-md">
                    <div className="flex items-center gap-1">
                      <Code className="w-3 h-3 text-sky-500 shrink-0" />
                      <span>{item.varName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="flex items-center gap-1 text-[11px] bg-amber-50/60 text-amber-900 border border-amber-200/60 rounded-md px-2 py-0.5 w-fit">
                      <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{item.domain}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
