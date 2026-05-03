import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateEmbedding } from "@/lib/embeddings/generateEmbedding";
import { vectorSearch } from "@/lib/practice/vectorSearch";
import { buildContext } from "@/lib/practice/buildContext";
import { generateAnswer } from "@/lib/practice/generateAnswer";

export async function POST(req) {
  try {
    const { projectId, query } = await req.json();

    if (!projectId || !query) {
      return NextResponse.json(
        { error: "Missing projectId or query" },
        { status: 400 }
      );
    }

    const client = await connectDB();
    const db = client.db();

    // 🔹 get all questions
    const docs = await db
      .collection("question_ir")
      .find({ projectId })
      .toArray();

    let questions = [];
    docs.forEach(doc => {
      doc.questions.forEach(q => questions.push(q));
    });

    if (!questions.length) {
      return NextResponse.json(
        { error: "No questions found for this project" },
        { status: 400 }
      );
    }

    // 🔹 embed query
    const queryEmbedding = await generateEmbedding(query);

    // 🔹 vector search
    const similar = vectorSearch(queryEmbedding, questions);

    // 🔹 build context
    const context = buildContext(similar);

    // 🔹 generate answer
    const answer = await generateAnswer(query, context);

    return NextResponse.json({
      success: true,
      answer,
      sources: similar,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}