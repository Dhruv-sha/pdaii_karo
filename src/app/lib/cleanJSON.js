export function cleanJSON(text) {
  return text.replace(/```json|```/g, "").trim();
}