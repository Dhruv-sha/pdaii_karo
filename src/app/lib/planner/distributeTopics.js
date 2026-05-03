export function distributeTopics(topicsWithTime) {
  const sessions = [];

  for (let topic of topicsWithTime) {
    let remaining = topic.allocatedHours;

    while (remaining > 0) {
      const sessionTime = Math.min(2, remaining); // max 2 hrs/session

      sessions.push({
        topic: topic.topic,
        duration: Number(sessionTime.toFixed(2)),
      });

      remaining -= sessionTime;
    }
  }

  return sessions;
}