import { groq } from "@/lib/groqClient";

export async function generateQuiz(topics) {
  const prompt = `
Generate 5 MCQs for the following topics:

${topics.join(", ")}

Format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
]
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
  });

  return res.choices[0].message.content;
}