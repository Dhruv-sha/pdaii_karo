// lib/preprocessText.js

export function preprocessText(text) {
  return text
    .replace(/\n+/g, "\n") // remove extra newlines
    .replace(/[^\x00-\x7F]/g, "") // remove weird chars
    .replace(/\s+/g, " ") // normalize spaces
    .trim();
}


export function splitQuestions(text) {
  return text.split(/\d+\.\s+/); // basic pattern: "1. 2. 3."
}