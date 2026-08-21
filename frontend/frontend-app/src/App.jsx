import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [problem, setProblem] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!problem.trim() && !url.trim()) {
      setError("Enter problem or paste URL");
      return;
    }

    if (url && !url.includes("leetcode.com")) {
      setError("Enter valid LeetCode URL");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await axios.post(`${API_BASE_URL}/analyze`, {
        problem: problem.trim(),
        url: url.trim(),
      });

      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea, #764ba2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px",
      fontFamily: "Segoe UI",
      color: "#fff",
    },

    title: {
      fontSize: "42px",
      marginBottom: "25px",
      fontWeight: "bold",
    },

    textarea: {
      width: "520px",
      padding: "14px",
      borderRadius: "10px",
      border: "none",
      fontSize: "15px",
      marginBottom: "10px",
      outline: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },

    input: {
      width: "520px",
      padding: "12px",
      borderRadius: "10px",
      border: "none",
      marginBottom: "10px",
      outline: "none",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    },

    button: {
      padding: "12px 25px",
      background: "#ff7a18",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      marginTop: "10px",
      transition: "0.2s",
    },

    card: {
      marginTop: "30px",
      padding: "25px",
      width: "450px",
      background: "rgba(255,255,255,0.15)",
      backdropFilter: "blur(10px)",
      borderRadius: "15px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
      color: "#fff",
    },

    pattern: {
      color: "#00ffcc",
      fontWeight: "bold",
      fontSize: "20px",
    },

    row: {
      display: "flex",
      justifyContent: "space-between",
      margin: "5px 0",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>DSA Pattern Finder</h1>

      <textarea
        style={styles.textarea}
        placeholder="Enter DSA problem..."
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
      />

      <input
        type="text"
        placeholder="Paste LeetCode URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
      />

      <button
        style={styles.button}
        onClick={handleAnalyze}
        disabled={loading}
        onMouseOver={(e) => (e.target.style.opacity = 0.8)}
        onMouseOut={(e) => (e.target.style.opacity = 1)}
        onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p style={{ color: "#ffb3b3" }}>{error}</p>}

      {loading && <p>Processing...</p>}

      {result && (
        <div style={styles.card}>
          <h2 style={{ marginBottom: "10px" }}>Analysis Result</h2>
          <hr style={{ marginBottom: "15px", opacity: 0.3 }} />

          {/* Pattern */}
          <p>
            <b>Pattern:</b>{" "}
            <span style={styles.pattern}>
              {result.analysis.decision.primaryPattern}
            </span>
          </p>

          {/* Confidence */}
          <p>
            <b>Confidence:</b>{" "}
            {result.analysis.decision.confidence}
          </p>

          {/* Confidence Bar */}
          <div style={{ marginBottom: "15px" }}>
            <div style={{ height: "10px", background: "#ddd", borderRadius: "5px" }}>
              <div
                style={{
                  width: `${result.analysis.decision.confidence * 100}%`,
                  height: "100%",
                  background: "#00ffcc",
                  borderRadius: "5px",
                }}
              ></div>
            </div>
          </div>

          {/* Probabilities */}
          <h3 style={{ marginTop: "20px" }}>Probabilities</h3>
          {Object.entries(
            result.analysis.decision.patternProbabilities
          ).map(([pattern, value]) => (
            <div key={pattern} style={{ marginBottom: "6px" }}>
              <div style={styles.row}>
                <span
                  style={{
                    color:
                      pattern ===
                      result.analysis.decision.primaryPattern
                        ? "#00ffcc"
                        : "#fff",
                  }}
                >
                  {pattern}
                </span>
                <span>{value}</span>
              </div>

              <div style={{ height: "6px", background: "#ccc" }}>
                <div
                  style={{
                    width: `${value * 100}%`,
                    height: "100%",
                    background: "#00ffcc",
                  }}
                ></div>
              </div>
            </div>
          ))}

          {/* WHY */}
          <h3 style={{ marginTop: "20px" }}>Why this pattern?</h3>
          <ul>
            {result.analysis.decision.why?.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>

          {/* HOW */}
          <h3 style={{ marginTop: "20px" }}>How to solve?</h3>
          <ol>
            {result.analysis.decision.thinkingSteps?.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;