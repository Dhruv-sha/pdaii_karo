const cache = new Map();

export function getCachedEmbedding(text) {
  return cache.get(text);
}

export function setCachedEmbedding(text, embedding) {
  cache.set(text, embedding);
}