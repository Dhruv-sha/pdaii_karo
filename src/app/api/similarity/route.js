import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { matchTopics } from "@/lib/similarity/matchTopics";
import { generateCoverage } from "@/lib/similarity/coverageEngine";

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

    // 1. Fetch syllabus
    const syllabus = await db
      .collection("syllabus_ir")
      .findOne({ projectId });

    if (!syllabus || !Array.isArray(syllabus.topics)) {
      return NextResponse.json(
        { error: "Upload a syllabus first" },
        { status: 400 }
      );
    }

    // 2. Fetch questions
    const questionsDoc = await db
      .collection("question_ir")
      .find({ projectId })
      .toArray();

    if (!questionsDoc.length) {
      return NextResponse.json(
        { error: "Upload question papers first" },
        { status: 400 }
      );
    }

    let allQuestions = [];

    questionsDoc.forEach(doc => {
      doc.questions.forEach(q => {
        allQuestions.push({
          ...q,
          year: doc.year,
        });
      });
    });

    // 3. Match topics
    const mapping = matchTopics(syllabus.topics, allQuestions);

    // 4. Coverage analysis
    const coverage = generateCoverage(mapping);

    return NextResponse.json({
      success: true,
      mapping,
      coverage,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Similarity engine failed" },
      { status: 500 }
    );
  }
}