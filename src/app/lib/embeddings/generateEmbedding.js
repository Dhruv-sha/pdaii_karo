export async function generateEmbedding(text) {
  try {
    const JINA_API_KEY = process.env.JINA_API_KEY;
    if (!JINA_API_KEY) {
      console.warn("Missing JINA_API_KEY in .env");
      return [];
    }

    const res = await fetch("https://api.jina.ai/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JINA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "jina-embeddings-v2-base-en",
        input: [text],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Jina Embedding failed: ${res.status} - ${err}`);
    }

    const data = await res.json();
    const values = data?.data?.[0]?.embedding;

    return Array.isArray(values) ? values : [];
  } catch (err) {
    console.error("Embedding error:", err);
    return [];
  }
}