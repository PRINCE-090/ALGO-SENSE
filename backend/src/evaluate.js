import { EVALUATION_DATASET } from "./data/evaluationDataset.js";
import { extractSignals } from "./extractSignals.js";
import { scorePatterns } from "./patternScorer.js";
import { buildDecision } from "./decisionEngine.js";
import { mlClassifier } from "./ml/mlClassifier.js";
import { analyzeHybrid } from "./hybridEngine.js";
import { performance } from "perf_hooks";

export function evaluateEngine(predictFn) {
  const patternsList = [
    "Sliding Window",
    "Two Pointers",
    "Prefix Sum",
    "Binary Search",
    "Dynamic Programming",
    "Graph",
    "Backtracking",
    "Greedy"
  ];

  const stats = {};
  for (const p of patternsList) {
    stats[p] = { tp: 0, fp: 0, fn: 0 };
  }

  let totalCorrect = 0;
  const totalCount = EVALUATION_DATASET.length;

  const start = performance.now();
  for (const sample of EVALUATION_DATASET) {
    const predicted = predictFn(sample.text);
    const actual = sample.pattern;

    const isMatch = predicted === actual;

    if (isMatch) {
      totalCorrect++;
      if (stats[actual]) stats[actual].tp++;
    } else {
      if (stats[actual]) stats[actual].fn++;
      if (stats[predicted]) stats[predicted].fp++;
    }
  }
  const duration = performance.now() - start;

  const accuracy = Number(((totalCorrect / totalCount) * 100).toFixed(2));

  let sumPrecision = 0;
  let sumRecall = 0;
  let sumF1 = 0;

  const perPatternMetrics = {};

  for (const p of patternsList) {
    const { tp, fp, fn } = stats[p];
    const precision = tp + fp === 0 ? 0 : Number((tp / (tp + fp)).toFixed(2));
    const recall = tp + fn === 0 ? 0 : Number((tp / (tp + fn)).toFixed(2));
    const f1 = precision + recall === 0 ? 0 : Number(((2 * precision * recall) / (precision + recall)).toFixed(2));

    perPatternMetrics[p] = { tp, fp, fn, precision, recall, f1Score: f1 };

    sumPrecision += precision;
    sumRecall += recall;
    sumF1 += f1;
  }

  return {
    totalSamples: totalCount,
    totalCorrect,
    accuracy,
    macroPrecision: Number((sumPrecision / patternsList.length).toFixed(2)),
    macroRecall: Number((sumRecall / patternsList.length).toFixed(2)),
    macroF1: Number((sumF1 / patternsList.length).toFixed(2)),
    executionTimeMs: Number(duration.toFixed(2)),
    perPatternMetrics
  };
}

export function runFullComparison() {
  // Train ML model on full set
  mlClassifier.train();

  // 1. Rule Engine Predictor
  const heuristicReport = evaluateEngine((text) => {
    const signals = extractSignals(text);
    const ranked = scorePatterns(signals);
    const decision = buildDecision(signals, ranked);
    return decision.primaryPattern;
  });

  // 2. ML Classifier Predictor
  const mlReport = evaluateEngine((text) => {
    return mlClassifier.predict(text).primaryPattern;
  });

  // 3. Hybrid Engine Predictor
  const hybridReport = evaluateEngine((text) => {
    return analyzeHybrid(text, 0.5).primaryPattern;
  });

  return {
    heuristicReport,
    mlReport,
    hybridReport
  };
}

if (process.argv[1] && process.argv[1].endsWith("evaluate.js")) {
  const comparison = runFullComparison();

  console.log("==========================================================================");
  console.log("       DSA PATTERN FINDER: HEURISTIC VS ML VS HYBRID ENGINE BENCHMARK      ");
  console.log("==========================================================================\n");

  console.table({
    "Rule-Based Heuristic Engine": {
      Accuracy: `${comparison.heuristicReport.accuracy}%`,
      "Macro Precision": comparison.heuristicReport.macroPrecision,
      "Macro Recall": comparison.heuristicReport.macroRecall,
      "Macro F1": comparison.heuristicReport.macroF1,
      "Latency (ms)": `${comparison.heuristicReport.executionTimeMs} ms`
    },
    "TF-IDF Cosine Similarity ML Engine": {
      Accuracy: `${comparison.mlReport.accuracy}%`,
      "Macro Precision": comparison.mlReport.macroPrecision,
      "Macro Recall": comparison.mlReport.macroRecall,
      "Macro F1": comparison.mlReport.macroF1,
      "Latency (ms)": `${comparison.mlReport.executionTimeMs} ms`
    },
    "Hybrid Ensemble Engine (Heuristic + ML)": {
      Accuracy: `${comparison.hybridReport.accuracy}%`,
      "Macro Precision": comparison.hybridReport.macroPrecision,
      "Macro Recall": comparison.hybridReport.macroRecall,
      "Macro F1": comparison.hybridReport.macroF1,
      "Latency (ms)": `${comparison.hybridReport.executionTimeMs} ms`
    }
  });

  console.log("\n--- Hybrid Engine Per-Pattern Breakdown ---");
  console.table(comparison.hybridReport.perPatternMetrics);
}
