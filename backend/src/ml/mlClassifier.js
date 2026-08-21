import { EVALUATION_DATASET } from "../data/evaluationDataset.js";

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
  "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were",
  "will", "with", "you", "your", "given", "return", "find", "length", "number",
  "using", "such", "that", "each", "can", "if", "or", "so", "where"
]);

export class TfIdfClassifier {
  constructor() {
    this.vocabulary = new Set();
    this.documents = [];
    this.idf = {};
    this.docVectors = [];
    this.isTrained = false;
  }

  tokenize(text) {
    const rawTokens = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    const filtered = rawTokens.filter(t => !STOP_WORDS.has(t) && t.length > 1);
    
    // Add bigrams for key multi-word phrases
    const bigrams = [];
    for (let i = 0; i < filtered.length - 1; i++) {
      bigrams.push(`${filtered[i]}_${filtered[i + 1]}`);
    }

    return [...filtered, ...bigrams];
  }

  train(dataset = EVALUATION_DATASET) {
    this.documents = dataset;
    this.vocabulary.clear();
    const docTermFreqs = [];
    const docCount = dataset.length;
    const docFreq = {};

    // Build vocabulary and term frequencies
    for (const doc of dataset) {
      const tokens = this.tokenize(doc.text);
      const tfMap = {};
      const uniqueTokens = new Set(tokens);

      for (const token of tokens) {
        tfMap[token] = (tfMap[token] || 0) + 1;
        this.vocabulary.add(token);
      }

      for (const token of uniqueTokens) {
        docFreq[token] = (docFreq[token] || 0) + 1;
      }

      docTermFreqs.push({ doc, tokens, tfMap });
    }

    // Compute IDF
    for (const term of this.vocabulary) {
      const df = docFreq[term] || 1;
      this.idf[term] = Math.log((docCount + 1) / (df + 1)) + 1;
    }

    // Build document TF-IDF vectors
    this.docVectors = docTermFreqs.map(({ doc, tfMap, tokens }) => {
      const vector = {};
      let totalTerms = tokens.length || 1;

      for (const term in tfMap) {
        const tf = tfMap[term] / totalTerms;
        vector[term] = tf * (this.idf[term] || 1);
      }

      return {
        doc,
        pattern: doc.pattern,
        vector,
        norm: this.vectorNorm(vector)
      };
    });

    this.isTrained = true;
  }

  vectorNorm(vector) {
    let sumSq = 0;
    for (const term in vector) {
      sumSq += vector[term] * vector[term];
    }
    return Math.sqrt(sumSq) || 1;
  }

  vectorizeText(text) {
    const tokens = this.tokenize(text);
    const tfMap = {};
    const totalTerms = tokens.length || 1;

    for (const token of tokens) {
      tfMap[token] = (tfMap[token] || 0) + 1;
    }

    const vector = {};
    for (const term in tfMap) {
      if (this.vocabulary.has(term)) {
        const tf = tfMap[term] / totalTerms;
        vector[term] = tf * (this.idf[term] || 1);
      }
    }

    return { vector, norm: this.vectorNorm(vector) };
  }

  cosineSimilarity(v1, norm1, v2, norm2) {
    let dotProduct = 0;
    for (const term in v1) {
      if (v2[term]) {
        dotProduct += v1[term] * v2[term];
      }
    }
    return dotProduct / (norm1 * norm2);
  }

  predict(text) {
    if (!this.isTrained) {
      this.train();
    }

    const { vector: queryVec, norm: queryNorm } = this.vectorizeText(text);
    const patternScores = {};
    const patternCounts = {};

    for (const docItem of this.docVectors) {
      const sim = this.cosineSimilarity(queryVec, queryNorm, docItem.vector, docItem.norm);
      const p = docItem.pattern;

      if (!patternScores[p]) {
        patternScores[p] = 0;
        patternCounts[p] = 0;
      }

      // Weight top matching documents higher
      patternScores[p] += sim;
      patternCounts[p] += 1;
    }

    // Average top similarities per pattern
    const rawScores = {};
    for (const p in patternScores) {
      rawScores[p] = patternScores[p] / patternCounts[p];
    }

    // Compute Softmax probabilities
    const expScores = {};
    let sumExp = 0;
    for (const p in rawScores) {
      const expVal = Math.exp(rawScores[p] * 5); // Scale temperature
      expScores[p] = expVal;
      sumExp += expVal;
    }

    const probabilities = {};
    let topPattern = "Unknown";
    let maxProb = -1;

    const rankedPatterns = Object.keys(rawScores)
      .map(pattern => {
        const prob = sumExp === 0 ? 0 : Number((expScores[pattern] / sumExp).toFixed(2));
        probabilities[pattern] = prob;
        if (prob > maxProb) {
          maxProb = prob;
          topPattern = pattern;
        }
        return { pattern, score: Number(rawScores[pattern].toFixed(4)), probability: prob };
      })
      .sort((a, b) => b.score - a.score);

    return {
      primaryPattern: topPattern,
      confidence: maxProb,
      patternProbabilities: probabilities,
      rankedPatterns
    };
  }
}

export const mlClassifier = new TfIdfClassifier();
