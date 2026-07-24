export interface SymbolItem {
  symbol: string;
  meaning: string;
  type: string; // scalar, vector, matrix, tensor
  dimension: string;
  varName: string;
  domain: string;
}

export interface Phase1Data {
  symbolDictionary: SymbolItem[];
  pseudocode: string;
  algorithmSteps: string[];
}

export interface Phase2Data {
  numericalStability: string[];
  computationalEfficiency: string[];
  singularitiesAndBoundaries: string[];
  reflectionSummary: string;
}

export interface Phase3Data {
  language: string;
  code: string;
  explanation: string;
  keyHighlights: string[];
}

export interface Phase4Data {
  pytestCode: string;
  visualizationCode: string;
  validationPoints: string[];
}

export interface InteractiveParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultVal: number;
  description?: string;
}

export interface MathConversionResult {
  title: string;
  summary: string;
  phase1: Phase1Data;
  phase2: Phase2Data;
  phase3: Phase3Data;
  phase4: Phase4Data;
  interactiveParams?: InteractiveParam[];
}

export interface PresetFormula {
  id: string;
  name: string;
  category: "AI/ML" | "Finance" | "Physics/Simulation" | "Biology/Epidemiology" | "Control/Signal";
  latex: string;
  context: string;
  description: string;
}
