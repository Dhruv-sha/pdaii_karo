import { generateEmbedding } from "./generateEmbedding";

export async function generateBatchEmbeddings(textArray) {
  const results = [];

  for (let text of textArray) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
  }

  return results;
}