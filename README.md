# DSA Pattern Finder

A production-grade, dual-engine algorithmic pattern classification platform. It analyzes Data Structures & Algorithms (DSA) problem statements or LeetCode problem URLs, classifies the core underlying pattern (e.g., Binary Search, Two Pointers, Sliding Window, Dynamic Programming, Graph, Backtracking, Greedy, Prefix Sum), computes pattern probability distributions, and provides step-by-step resolution guidance.

---

## 1. System Architecture

```
                               ┌──────────────────────────┐
                               │  Client (React + Vite)   │
                               └────────────┬─────────────┘
                                            │ HTTP POST /analyze
                                            ▼
                               ┌──────────────────────────┐
                               │       Express API        │
                               └────────────┬─────────────┘
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     │ Input Sanitization & URL Fetcher (GraphQL) │
                     └──────────────────────┬──────────────────────┘
                                            │ Normalized Problem Text
                                            ▼
             ┌──────────────────────────────────────────────────────────────┐
             │                   Hybrid Classification                      │
             │                                                              │
             │   ┌────────────────────────┐    ┌────────────────────────┐   │
             │   │ Declarative Heuristics │    │ TF-IDF ML Vectorizer   │   │
             │   │   (Rule Engine)        │    │  (Cosine Similarity)   │   │
             │   └───────────┬────────────┘    └───────────┬────────────┘   │
             │               │ (P_heur)                    │ (P_ml)         │
             │               └──────────────┬──────────────┘                │
             │                              ▼                               │
             │                   Ensemble Aggregator                        │
             │           P_hybrid = α*P_heur + (1-α)*P_ml                   │
             └──────────────────────────────┬───────────────────────────────┘
                                            │
                                            ▼
                               ┌──────────────────────────┐
                               │  JSON Analysis Response  │
                               └──────────────────────────┘
```

---

## 2. Key Design Decisions and Tradeoffs

### 2.1 Declarative Rule Configuration vs. Imperative Control Flow
* **Decision**: Refactored heuristic pattern matching out of nested `if` statements into a declarative JSON/JS configuration (`backend/src/config/patternsConfig.js`).
* **Tradeoff**: Offers $O(1)$ maintenance complexity when introducing new algorithmic patterns (requires adding an object definition without modifying control flow logic). The tradeoff is that complex multi-condition penalties require custom lambda evaluators within the rule definitions.

### 2.2 Hybrid Ensemble (Heuristics + ML) vs. Pure Deep Learning Model
* **Decision**: Combined rule-based heuristic scoring with a TF-IDF Cosine Similarity vector space model.
* **Tradeoff**: Heuristics provide deterministic, human-readable explanations (`why` triggers and `thinkingSteps`) with minimal latency (~4.7 ms). The TF-IDF ML layer handles phrasing variations and terminology outside explicit keyword lists (~32.7 ms). Fusing both yields high precision while preserving total explainability.

### 2.3 In-Memory Vectorizer vs. External Vector Database
* **Decision**: Implemented an in-memory TF-IDF vectorizer and cosine similarity engine trained on a curated DSA domain corpus.
* **Tradeoff**: Keeps the system self-contained with zero external database dependencies, sub-50ms execution times, and simple local testing. The tradeoff is linear vector search scaling $O(N \cdot D)$ relative to dataset size $N$ and feature dimension $D$.

---

## 3. Evaluation & Benchmark Results

The classification models were benchmarked against a curated dataset of **64 real LeetCode problems** spanning 8 algorithmic categories.

### 3.1 Model Comparison Summary

| Model Architecture | Accuracy | Macro Precision | Macro Recall | Macro F1 | Latency |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Rule-Based Heuristic Engine** | 93.75% | 0.95 | 0.94 | 0.94 | 4.74 ms |
| **TF-IDF Cosine Similarity ML Engine** | 100.00% | 1.00 | 1.00 | 1.00 | 32.77 ms |
| **Hybrid Ensemble Engine (Heuristics + ML)** | **95.31%** | **0.96** | **0.95** | **0.95** | **13.37 ms** |

### 3.2 Per-Pattern Breakdown (Hybrid Engine)

| Pattern | Ground Truth Count | Precision | Recall | F1 Score |
| :--- | :---: | :---: | :---: | :---: |
| **Binary Search** | 8 | 1.00 | 1.00 | 1.00 |
| **Dynamic Programming** | 8 | 1.00 | 1.00 | 1.00 |
| **Greedy** | 8 | 1.00 | 1.00 | 1.00 |
| **Two Pointers** | 8 | 0.89 | 1.00 | 0.94 |
| **Prefix Sum** | 8 | 1.00 | 0.88 | 0.94 |
| **Graph** | 8 | 0.89 | 1.00 | 0.94 |
| **Backtracking** | 8 | 0.89 | 1.00 | 0.94 |
| **Sliding Window** | 8 | 1.00 | 0.75 | 0.86 |

---

## 4. Known Limitations

1. **Vocabulary Dependencies in Heuristics**: Heuristic classification relies on keyword signal extraction. Problem descriptions with unconventional phrasing or non-standard variable names may reduce rule confidence.
2. **Bag-of-Words / TF-IDF Constraints**: TF-IDF unigrams and bigrams lack semantic embeddings. Synonymous terms not present in the training vocabulary will not contribute to similarity scores.
3. **LeetCode GraphQL API Rate Limits**: Remote problem retrieval relies on LeetCode's public GraphQL endpoint. High query volume without caching can lead to upstream rate limiting.

---

## 5. Architectural Recommendations for Scale

If scaling this system to handle millions of requests/day across thousands of problem categories, the following architecture changes should be implemented:

1. **Dense Semantic Embeddings & Vector DB**:
   * Replace TF-IDF with dense vector embeddings generated by a light transformer model (e.g., `all-MiniLM-L6-v2` or `text-embedding-3-small`).
   * Store and index vectors using a dedicated vector database (e.g., Qdrant or Pinecone) with HNSW indexing to achieve $O(\log N)$ approximate nearest neighbor retrieval.

2. **Distributed Caching Layer**:
   * Implement a Redis LRU cache in front of the classification pipeline, keyed by SHA-256 hash of normalized problem text or problem URL.
   * Eliminates re-computation for popular LeetCode URLs and drops p99 latency to < 2ms.

3. **Asynchronous Job Queue**:
   * Introduce a message queue (BullMQ or AWS SQS) for external URL fetching and heavy batch analysis, decoupling client request cycles from upstream HTTP timeouts.

4. **Containerization & Horizontal Autoscaling**:
   * Containerize the API service using Docker and deploy to Kubernetes or AWS ECS with Horizontal Pod Autoscaling (HPA) governed by CPU utilization and active request concurrency metrics.

---

## 6. API Reference

### `POST /analyze`
Analyzes problem statement text or fetches content via LeetCode URL.

#### Request Payload
```json
{
  "problem": "Given an array of integers nums and an integer k, return the maximum sum of any contiguous subarray of size k."
}
```

#### Response Payload (`200 OK`)
```json
{
  "input": "Given an array of integers nums and an integer k...",
  "analysis": {
    "signals": {
      "hasArray": true,
      "mentionsSubarray": true,
      "mentionsK": true
    },
    "hybrid": {
      "primaryPattern": "Sliding Window",
      "confidence": 0.85,
      "patternProbabilities": {
        "Sliding Window": 0.85,
        "Prefix Sum": 0.15
      },
      "why": [
        "Subarray or contiguous element phrase detected",
        "Window size K constraint detected"
      ],
      "thinkingSteps": [
        "Initialize window boundaries (left = 0, right = 0)",
        "Expand right pointer to grow window and accumulate state",
        "Shrink left pointer when window condition is violated"
      ]
    }
  }
}
```

---

## 7. Local Development & Testing

```bash
# Clone repository
git clone https://github.com/PRINCE-090/dsa-pattern-finder.git
cd dsa-pattern-finder

# Install backend dependencies
cd backend/src
npm install

# Run unit tests and API integration tests (Vitest)
npm test

# Run benchmark evaluation across 64 problem dataset
npm run evaluate

# Start development server
npm start
```
