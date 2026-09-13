/**
 * Constraint Detector
 * Extracts upper bounds (e.g. N <= 20, N <= 10^5), duplicate rules, and sign properties
 * to resolve pattern tie-breakers (e.g. Backtracking N <= 20 vs O(N) Sliding Window).
 */

export function detectConstraints(text) {
  const constraints = {
    nUpperBound: null,
    duplicatesAllowed: null,
    valuesPositive: null
  };

  // Match n <= X or N <= 10^5 or N <= 100000
  const boundMatches = [...text.matchAll(/\bn\s*(<=|<)\s*(\d+|\d+\^\d+)/gi)];
  if (boundMatches.length > 0) {
    const values = boundMatches.map(m => {
      const valStr = m[2];
      if (valStr.includes("^")) {
        const [base, exp] = valStr.split("^").map(Number);
        return Math.pow(base, exp);
      }
      return Number(valStr);
    }).filter(n => !isNaN(n));

    if (values.length > 0) {
      constraints.nUpperBound = Math.max(...values);
    }
  }

  if (/duplicates?\s+(are\s+|is\s+)?allowed/i.test(text)) {
    constraints.duplicatesAllowed = true;
  } else if (/no duplicates|distinct (elements|values|integers|numbers)/i.test(text)) {
    constraints.duplicatesAllowed = false;
  }

  if (/non-negative/i.test(text)) {
    constraints.valuesPositive = null;
  } else if (/positive (integers|values|numbers)/i.test(text)) {
    constraints.valuesPositive = true;
  } else if (/negative (integers|values|numbers)/i.test(text)) {
    constraints.valuesPositive = false;
  }

  return constraints;
}
