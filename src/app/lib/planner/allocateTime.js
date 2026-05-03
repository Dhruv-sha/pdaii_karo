export function allocateTime(rankedTopics, totalHours) {
  const totalScore = rankedTopics.reduce(
    (sum, t) => sum + t.score,
    0
  );

  return rankedTopics.map(topic => {
    const allocatedHours =
      (topic.score / totalScore) * totalHours;

    return {
      ...topic,
      allocatedHours: Number(allocatedHours.toFixed(2)),
    };
  });
}