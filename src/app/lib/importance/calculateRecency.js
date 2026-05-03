export function calculateRecency(questions) {
  const currentYear = new Date().getFullYear();
  const recencyMap = {};

  for (let q of questions) {
    const topic = q.topic;
    const year = q.year || currentYear;

    const recencyScore = 1 / (currentYear - year + 1);

    if (!recencyMap[topic]) {
      recencyMap[topic] = 0;
    }

    recencyMap[topic] += recencyScore;
  }

  return recencyMap;
}