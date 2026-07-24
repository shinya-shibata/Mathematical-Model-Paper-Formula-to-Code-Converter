import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit for image data URLs
app.use(express.json({ limit: "20mb" }));

// Initialize Gemini SDK
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// System instructions for the 4-Phase Conversion
const SYSTEM_INSTRUCTION = `あなたは「数理モデルおよび論文の数式を堅牢な計算コードへ変換するエキスパートエンジニア」です。
ユーザーから提示された数式（LaTeX形式）または論文内容を解析し、以下の4つのフェーズに従って高品質な構造化JSONデータを生成してください。

【出力要件】
1. Phase 1: 構造化・記号化・解析
   - Symbol Dictionary（数式辞書）: 全記号の「記号」「数学的意味」「型 (scalar, vector, matrix, tensor)」「次元・形状」「コード上の変数名」「定義域/制約条件」
   - アルゴリズムステップと擬似コード（Pseudocode）

2. Phase 2: コンピュータ実装上の課題分析（リフレクション）
   - 数値的安定性（桁落ち、オーバーフロー/アンダーフロー、Log-Sum-Exp等の安定化手法）
   - 計算効率（ベクトル化、ブロードキャスト、オーダー削滅）
   - 特異点・境界条件（0除算、非正則行列、定義域外ハンドリング）

3. Phase 3: 実装コードの生成
   - 指定された言語・ライブラリ（Python / NumPy, SciPy, PyTorch, JAX 等）による厳密で堅牢な生産コード。
   - 各関数・クラスの docstring に対応する LaTeX 数式・式番号を明記。
   - 形状コメント（例: # [Batch, N, D]）および数値安定化ロジックを含める。

4. Phase 4: 数学的正当性の検証コード（テスト）
   - ユニットテストコード (pytest 形式の既知理論値・限界値検証)
   - プロパティベーステスト/可視化 (Matplotlib/Seaborn 描画コードおよび不変条件アサーション)

必ず各フェーズの項目を漏れなく記述し、JSONオブジェクトとして返却してください。`;

// Endpoint: Convert Math Formula / Paper Text
app.post("/api/convert-math", async (req, res) => {
  try {
    const { latexInput, paperContext, targetLanguage = "Python / NumPy" } = req.body;

    if (!latexInput || typeof latexInput !== "string") {
      return res.status(400).json({ error: "latexInput is required and must be a string." });
    }

    const ai = getAiClient();

    const prompt = `以下の数式・論文テキストを解析し、${targetLanguage} を想定した4フェーズの解析・コード・検証スクリプトを出力してください。

【コンテキスト・補足】
${paperContext || "特になし（数式から文脈を自動判別）"}

【数式/論文テキスト (LaTeX)】
${latexInput}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "モデルまたは数式の簡潔なタイトル" },
            summary: { type: Type.STRING, description: "数理モデルの数学的意義・概要" },
            phase1: {
              type: Type.OBJECT,
              properties: {
                symbolDictionary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      symbol: { type: Type.STRING, description: "LaTeX表記の記号" },
                      meaning: { type: Type.STRING, description: "数学的・物理的意味" },
                      type: { type: Type.STRING, description: "scalar, vector, matrix, tensor など" },
                      dimension: { type: Type.STRING, description: "次元・形状 (例: (N,), (N, M))" },
                      varName: { type: Type.STRING, description: "コード中の推奨変数名" },
                      domain: { type: Type.STRING, description: "定義域・制約条件 (例: x > 0)" },
                    },
                    required: ["symbol", "meaning", "type", "dimension", "varName", "domain"],
                  },
                },
                pseudocode: { type: Type.STRING, description: "ステップ分解されたアルゴリズムの擬似コード" },
                algorithmSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "計算の順序付きステップ",
                },
              },
              required: ["symbolDictionary", "pseudocode", "algorithmSteps"],
            },
            phase2: {
              type: Type.OBJECT,
              properties: {
                numericalStability: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "数値的安定性のリスクと対策",
                },
                computationalEfficiency: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "ベクトル化・ブロードキャスト・計算量削減対策",
                },
                singularitiesAndBoundaries: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "特異点・0除算・定義域外の処理方針",
                },
                reflectionSummary: { type: Type.STRING, description: "リフレクション全体の要約" },
              },
              required: ["numericalStability", "computationalEfficiency", "singularitiesAndBoundaries", "reflectionSummary"],
            },
            phase3: {
              type: Type.OBJECT,
              properties: {
                language: { type: Type.STRING, description: "使用言語/ライブラリ" },
                code: { type: Type.STRING, description: "堅牢なPython/JAX/PyTorch実装コード" },
                explanation: { type: Type.STRING, description: "実装コードのポイント解説" },
                keyHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "コード内の注目工夫点",
                },
              },
              required: ["language", "code", "explanation", "keyHighlights"],
            },
            phase4: {
              type: Type.OBJECT,
              properties: {
                pytestCode: { type: Type.STRING, description: "pytest等によるユニットテスト・限界値検証コード" },
                visualizationCode: { type: Type.STRING, description: "Matplotlib描画・理論値比較・プロパティ検証スクリプト" },
                validationPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "検証における確認指標",
                },
              },
              required: ["pytestCode", "visualizationCode", "validationPoints"],
            },
            interactiveParams: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  label: { type: Type.STRING },
                  min: { type: Type.NUMBER },
                  max: { type: Type.NUMBER },
                  step: { type: Type.NUMBER },
                  defaultVal: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                },
                required: ["key", "label", "min", "max", "step", "defaultVal"],
              },
              description: "インタラクティブシミュレーション用のパラメータ定義リスト",
            },
          },
          required: ["title", "summary", "phase1", "phase2", "phase3", "phase4"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      return res.status(500).json({ error: "No response text received from Gemini API." });
    }

    const jsonOutput = JSON.parse(resultText);
    res.json(jsonOutput);
  } catch (error: any) {
    console.error("Error in /api/convert-math:", error);
    res.status(500).json({
      error: error?.message || "Failed to convert mathematical model.",
    });
  }
});

// Endpoint: PDF / Document Analysis to extract LaTeX formula and context from uploaded paper PDF
app.post("/api/analyze-pdf", async (req, res) => {
  try {
    const { fileBase64, mimeType = "application/pdf" } = req.body;
    if (!fileBase64) {
      return res.status(400).json({ error: "fileBase64 is required." });
    }

    const ai = getAiClient();
    // Strip data url prefix if present
    const cleanBase64 = fileBase64.replace(/^data:(application\/pdf|image\/\w+);base64,/, "");

    const prompt = `添付された論文ドキュメント (PDFまたは画像) を解析し、以下の情報を正確に読み取って抽出してください。
1. 論文内で中心となる主要な数式をLaTeX形式で記述 (extractedLatex)
2. 変数の定義、次元、物理・数学的コンテキスト、前提条件 (paperContext)
3. 推定される論文・定理のタイトル (detectedTitle)

出力形式 (JSON):
{
  "extractedLatex": "LaTeX形式の数式 (例: \\\\sigma_t^2 = \\\\omega + \\\\alpha \\\\epsilon_{t-1}^2 + \\\\beta \\\\sigma_{t-1}^2)",
  "paperContext": "解釈されたドキュメントの文脈・変数定義・次元・定義域",
  "detectedTitle": "数式/定理/論文モデルの推定名称"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Failed to extract content from PDF." });
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error in /api/analyze-pdf:", error);
    res.status(500).json({ error: error?.message || "PDF analysis failed." });
  }
});

// Express + Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Math Model Engine Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
