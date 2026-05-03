export function buildSchedule(sessions, days, hoursPerDay) {
  const schedule = [];
  let sessionIndex = 0;

  for (let day = 1; day <= days; day++) {
    let remainingHours = hoursPerDay;
    let dayPlan = [];

    while (
      remainingHours > 0 &&
      sessionIndex < sessions.length
    ) {
      const session = sessions[sessionIndex];

      if (session.duration <= remainingHours) {
        dayPlan.push(session);
        remainingHours -= session.duration;
        sessionIndex++;
      } else {
        // split session
        dayPlan.push({
          topic: session.topic,
          duration: remainingHours,
        });

        sessions[sessionIndex].duration -= remainingHours;
        remainingHours = 0;
      }
    }

    // 🔥 Add revision slot
    dayPlan.push({
      topic: "Revision",
      duration: 0.5,
    });

    schedule.push({
      day,
      plan: dayPlan,
    });
  }

  return schedule;
}