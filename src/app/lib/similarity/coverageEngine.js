export function generateCoverage(mapping) {
  const covered = [];
  const missing = [];
  const weak = [];

  for (let item of mapping) {
    if (item.matchCount === 0) {
      missing.push(item.topic);
    } else if (item.matchCount < 3) {
      weak.push(item.topic);
    } else {
      covered.push(item.topic);
    }
  }

  return {
    covered,
    weak,
    missing,
  };
}