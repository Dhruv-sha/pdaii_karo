export function calculateFrequency(questions) {
  const freqMap = {};

  for (let q of questions) {
    const topic = q.topic;

    if (!freqMap[topic]) {
      freqMap[topic] = 0;
    }

    freqMap[topic] += 1;
  }

  return freqMap;
}