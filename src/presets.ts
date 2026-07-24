import { PresetFormula } from "./types";

export const PRESET_FORMULAS: PresetFormula[] = [
  {
    id: "transformer-attention",
    name: "Scaled Dot-Product Attention (Transformer)",
    category: "AI/ML",
    description: "Vaswani et al. (2017) 論文の基本アテンション機構。d_kでのスケール除算とSoftmaxのオーバーフロー防止が必須。",
    latex: "\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V",
    context: "クエリ行列 Q [Batch, N, d_k]、キー行列 K [Batch, M, d_k]、バリュー行列 V [Batch, M, d_v] からの多次元アテンション重み計算。"
  },
  {
    id: "garch-11",
    name: "GARCH(1,1) 条件付き分散モデル",
    category: "Finance",
    description: "Bollerslev (1986) による金融時系列のボラティリティ予測数理モデル。ω > 0, α + β < 1 の定常性制約が必要。",
    latex: "\\sigma_t^2 = \\omega + \\alpha \\epsilon_{t-1}^2 + \\beta \\sigma_{t-1}^2",
    context: "時刻 t における条件付き分散 σ_t^2 の再帰計算。過去の残差自乗 ε_{t-1}^2 と過去分散 σ_{t-1}^2 の加重和。"
  },
  {
    id: "black-scholes",
    name: "Black-Scholes 欧州コールオプション評価式",
    category: "Finance",
    description: "Black & Scholes (1973) 論文。累積標準正規分布関数 N(d) の数値高精度計算と T - t → 0 での特異点回避。",
    latex: "C(S, t) = S N(d_1) - K e^{-r(T-t)} N(d_2), \\quad d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)(T-t)}{\\sigma\\sqrt{T-t}}, \\quad d_2 = d_1 - \\sigma\\sqrt{T-t}",
    context: "株価 S, 権利行使価格 K, 無リスク金利 r, ボラティリティ σ, 残存期間 T-t におけるオプション理論価格。"
  },
  {
    id: "kalman-filter",
    name: "カルマンゲイン及び状態更新方程式",
    category: "Control/Signal",
    description: "Kalman (1960) フィルタの観測更新ステップ。イノベーション共分散 (H P H^T + R) の行列逆演算の数値正則化。",
    latex: "K_k = P_k^- H^T \\left(H P_k^- H^T + R\\right)^{-1}, \\quad \\hat{x}_k = \\hat{x}_k^- + K_k \\left(z_k - H \\hat{x}_k^-\\right), \\quad P_k = (I - K_k H) P_k^-",
    context: "事前状態推定値 x_k^- と事前誤差共分散 P_k^- から、観測値 z_k を用いて事後推定値 x_k を最小分散更新する。"
  },
  {
    id: "lotka-volterra",
    name: "Lotka-Volterra 捕食者・被食者微分方程式系",
    category: "Biology/Epidemiology",
    description: "2種の非線形相互作用常微分方程式系。Runge-Kutta 4階（RK4）等の数値積分ステップと非負保存制約。",
    latex: "\\frac{dx}{dt} = \\alpha x - \\beta x y, \\quad \\frac{dy}{dt} = \\delta x y - \\gamma y",
    context: "被食者数 x(t) と捕食者数 y(t) の個体数変動。α:自然増殖率, β:捕食率, δ:効率, γ:自然死亡率。"
  },
  {
    id: "sir-model",
    name: "SIR 感染症動態モデル ($R_0$ 解析)",
    category: "Biology/Epidemiology",
    description: "Kermack-McKendrick 感染症モデル。S + I + R = N (全人口保存則) の不変量維持と基本再生産数 R_0 = β / γ。",
    latex: "\\frac{dS}{dt} = -\\frac{\\beta S I}{N}, \\quad \\frac{dI}{dt} = \\frac{\\beta S I}{N} - \\gamma I, \\quad \\frac{dR}{dt} = \\gamma I",
    context: "感受性者 S, 感染者 I, 回復・隔離者 R の全人口 N における動態推移。β: 感染率, γ: 回復率。"
  },
  {
    id: "log-sum-exp",
    name: "Log-Sum-Exp 数値安定化表現",
    category: "AI/ML",
    description: "極小・極大指数関数計算におけるオーバーフロー・アンダーフロー防止。x_max の引算による安定化手法。",
    latex: "\\text{LSE}(x_1, \\dots, x_N) = x_{\\max} + \\ln\\left(\\sum_{i=1}^N \\exp(x_i - x_{\\max})\\right), \\quad x_{\\max} = \\max_{i} x_i",
    context: "確率的推論、マルチクラス分類のパーティション関数 Z の対数計算における数値安定アルゴリズム。"
  },
  {
    id: "egfrd-diffusion",
    name: "3次元粒子自由拡散の確率密度関数 (eGFRD)",
    category: "Physics/Simulation",
    description: "細胞内粒子・ブラウン運動シミュレーションにおける Green 関数。4Dt → 0 での特異点とサンプリング境界値。",
    latex: "p(\\mathbf{r}, t \\mid \\mathbf{r}_0) = \\frac{1}{(4\\pi D t)^{3/2}} \\exp\\left(-\\frac{\\|\\mathbf{r} - \\mathbf{r}_0\\|^2}{4 D t}\\right)",
    context: "拡散係数 D, 時間ステップ t における初期位置 r_0 から位置 r への遷移確率密度。"
  }
];
