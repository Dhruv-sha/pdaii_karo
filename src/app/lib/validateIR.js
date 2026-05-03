export function validateIR(ir, docType) {
  if (docType === "question_paper") {
    if (!Array.isArray(ir.questions)) return false;

    for (let q of ir.questions) {
      if (!q.question || q.question.length < 5) return false;

      if (!q.topic) q.topic = "Unknown";
      if (!q.type) q.type = "theory";
      if (!q.difficulty) q.difficulty = "medium";
    }
  }

  if (docType === "syllabus") {
    if (!Array.isArray(ir.topics)) return false;

    ir.topics = ir.topics.filter(t => t.topic);
  }

  return true;
}