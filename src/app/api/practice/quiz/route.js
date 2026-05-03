import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateQuiz } from "@/lib/practice/generateQuiz";

export async function POST(req) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    const client = await connectDB();
    const db = client.db();

    // 🔹 get top topics
    const importance = await db
      .collection("importance_scores")
      .findOne({ projectId });

    if (!importance || !Array.isArray(importance.rankedTopics)) {
      return NextResponse.json(
        { error: "Run importance scoring first" },
        { status: 400 }
      );
    }

    const topTopics = importance.rankedTopics
      .slice(0, 5)
      .map(t => t.topic);

    // 🔹 generate quiz
    const quiz = await generateQuiz(topTopics);

    return NextResponse.json({
      success: true,
      quiz,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Quiz generation failed" },
      { status: 500 }
    );
  }
}