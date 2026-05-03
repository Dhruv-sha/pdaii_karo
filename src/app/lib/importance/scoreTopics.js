export function scoreTopics(freqMap, recencyMap, coverageMap) {
  const scores = [];

  const topics = new Set([
    ...Object.keys(freqMap),
    ...Object.keys(recencyMap),
    ...Object.keys(coverageMap),
  ]);

  for (let topic of topics) {
    const frequency = freqMap[topic] || 0;
    const recency = recencyMap[topic] || 0;
    const coverage = coverageMap[topic] || 1;

    const score =
      (frequency * 0.5) +
      (recency * 0.3) +
      (coverage * 0.2);

    scores.push({
      topic,
      frequency,
      recency,
      coverage,
      score: Number(score.toFixed(3)),
    });
  }

  // sort descending
  scores.sort((a, b) => b.score - a.score);

  return scores;
}