export function calculateCoverageWeight(coverage) {
  const weightMap = {};

  coverage.covered.forEach(topic => {
    weightMap[topic] = 1;
  });

  coverage.weak.forEach(topic => {
    weightMap[topic] = 1.5;
  });

  coverage.missing.forEach(topic => {
    weightMap[topic] = 2;
  });

  return weightMap;
}