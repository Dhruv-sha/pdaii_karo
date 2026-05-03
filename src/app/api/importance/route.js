import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { calculateFrequency } from "@/lib/importance/calculateFrequency";
import { calculateRecency } from "@/lib/importance/calculateRecency";
import { calculateCoverageWeight } from "@/lib/importance/calculateCoverageWeight";
import { scoreTopics } from "@/lib/importance/scoreTopics";
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

    // 🔹 Fetch syllabus
    const syllabus = await db
      .collection("syllabus_ir")
      .findOne({ projectId });

    if (!syllabus || !Array.isArray(syllabus.topics)) {
      return NextResponse.json(
        { error: "Upload a syllabus first" },
        { status: 400 }
      );
    }

    // 🔹 Fetch questions
    const questionDocs = await db
      .collection("question_ir")
      .find({ projectId })
      .toArray();

    if (!questionDocs.length) {
      return NextResponse.json(
        { error: "Upload question papers first" },
        { status: 400 }
      );
    }

    let questions = [];

    questionDocs.forEach(doc => {
      doc.questions.forEach(q => {
        questions.push({
          ...q,
          year: doc.year,
        });
      });
    });

    // 🔹 Similarity mapping
    const mapping = matchTopics(syllabus.topics, questions);

    // 🔹 Coverage
    const coverage = generateCoverage(mapping);

    // 🔹 Calculations
    const freqMap = calculateFrequency(questions);
    const recencyMap = calculateRecency(questions);
    const coverageMap = calculateCoverageWeight(coverage);

    // 🔹 Final scores
    const rankedTopics = scoreTopics(
      freqMap,
      recencyMap,
      coverageMap
    );

    await db.collection("importance_scores").updateOne(
      { projectId },
      {
        $set: {
          projectId,
          rankedTopics,
          coverage,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      rankedTopics,
      coverage,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Importance scoring failed" },
      { status: 500 }
    );
  }
}