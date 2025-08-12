export const getReputationColor = (score: number): string => {
  if (score >= 70) return "#4CAF50"; // Green
  if (score >= 30) return "#8BC34A"; // Light Green
  if (score >= 0) return "#FFC107"; // Yellow
  if (score >= -30) return "#FF9800"; // Orange
  return "#F44336"; // Red
};
