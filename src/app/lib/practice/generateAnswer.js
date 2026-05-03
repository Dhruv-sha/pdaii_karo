import { groq } from "@/lib/groqClient";

export async function generateAnswer(question, context) {
  const prompt = `
You are a helpful tutor.

Use the context of past exam questions to answer.

Context:
${context}

Student Question:
${question}

Answer clearly and concisely.
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return res.choices[0].message.content;
}