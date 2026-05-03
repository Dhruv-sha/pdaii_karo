export function buildContext(similarQuestions) {
  return similarQuestions
    .map(
      (q, i) =>
        `Q${i + 1}: ${q.question} (Topic: ${q.topic})`
    )
    .join("\n");
}