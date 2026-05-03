import { groq } from "./groqClient";

export async function generateIRFromText(text, docType) {
  let prompt = "";

  if (docType === "question_paper") {
    prompt = `
You are a strict academic parser.

Extract structured question data.

RULES:
- Do NOT hallucinate
- If unsure, leave fields empty
- Keep topic names SHORT and consistent
- Do NOT invent questions

Return ONLY JSON.

FORMAT:
{
  "subject": "",
  "year": "",
  "questions": [
    {
      "question": "",
      "topic": "",
      "subtopic": "",
      "type": "mcq/theory/numerical",
      "difficulty": "easy/medium/hard",
      "marks": number
    }
  ]
}

EXAMPLE:
Input: "Explain normalization in DBMS (10 marks)"
Output:
{
  "question": "Explain normalization in DBMS",
  "topic": "Normalization",
  "subtopic": "General",
  "type": "theory",
  "difficulty": "medium",
  "marks": 10
}

TEXT:
${text}
`;
  } else if (docType === "syllabus") {
    prompt = `
You are a strict academic parser.

Extract structured syllabus topics.

RULES:
- Do NOT hallucinate
- If unsure, leave fields empty
- Keep topic names SHORT and consistent
- Do NOT invent topics

Return ONLY JSON.

FORMAT:
{
  "subject": "",
  "year": "",
  "topics": [
    {
      "topic": "",
      "subtopics": ["", ""]
    }
  ]
}

TEXT:
${text}
`;
  } else {
    throw new Error(`Unsupported docType: ${docType}`);
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
}