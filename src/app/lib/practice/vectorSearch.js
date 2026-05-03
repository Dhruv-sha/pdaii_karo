import { cosineSimilarity } from "@/lib/similarity/cosineSimilarity";

export function vectorSearch(queryEmbedding, questions, topK = 5) {
  const scored = questions.map(q => ({
    ...q,
    similarity: cosineSimilarity(queryEmbedding, q.embedding),
  }));

  scored.sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, topK);
}