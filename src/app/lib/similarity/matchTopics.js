import { cosineSimilarity } from "./cosineSimilarity";

export function matchTopics(syllabusTopics, questions, threshold = 0.7) {
  const mapping = [];

  for (let topic of syllabusTopics) {
    let matchedQuestions = [];

    for (let q of questions) {
      const sim = cosineSimilarity(topic.embedding, q.embedding);

      if (sim > threshold) {
        matchedQuestions.push({
          question: q.question,
          similarity: sim,
          year: q.year,
        });
      }
    }

    mapping.push({
      topic: topic.topic,
      matches: matchedQuestions,
      matchCount: matchedQuestions.length,
    });
  }

  return mapping;
}