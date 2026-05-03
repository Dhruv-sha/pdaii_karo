// lib/normalizeTopic.js

// 1. Base mapping (you will keep expanding this)
const topicMap = {
  "db normalization": "Normalization",
  "database normalization": "Normalization",
  "normal forms": "Normalization",
  "1nf": "Normalization",
  "2nf": "Normalization",
  "3nf": "Normalization",

  "sql joins": "Joins",
  "joins in sql": "Joins",
  "inner join": "Joins",
  "outer join": "Joins",

  "er model": "ER Model",
  "entity relationship model": "ER Model",

  "indexing": "Indexing",
  "db indexing": "Indexing",

  "transactions": "Transactions",
  "database transactions": "Transactions"
};

// 2. Cleaning helper
function cleanText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ");
}

// 3. Fuzzy fallback (very basic)
function fuzzyMatch(input) {
  const keys = Object.keys(topicMap);

  for (let key of keys) {
    if (input.includes(key) || key.includes(input)) {
      return topicMap[key];
    }
  }

  return null;
}

// 4. Main function
export function normalizeTopic(topic) {
  if (!topic) return "Unknown";

  const cleaned = cleanText(topic);

  // Direct match
  if (topicMap[cleaned]) {
    return topicMap[cleaned];
  }

  // Fuzzy match
  const fuzzy = fuzzyMatch(cleaned);
  if (fuzzy) return fuzzy;

  // Default → capitalize nicely
  return topic
    .trim()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}