// app/api/process/route.js

import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/extractText";
import { generateBatchEmbeddings } from "@/lib/embeddings/batchEmbedding";
import { connectDB } from "@/lib/db";
import { generateWithRetry } from "@/lib/generateWithRetry";
import { normalizeTopic } from "@/lib/normalizeTopic";
import { preprocessText } from "@/lib/preprocessText";

export async function POST(req) {
  try {
    const { fileUrl, docType, projectId } = await req.json();

    // 🔹 Validation
    if (!fileUrl || !docType || !projectId) {
      return NextResponse.json(
        { error: "Missing fileUrl, docType or projectId" },
        { status: 400 }
      );
    }

    if (!["question_paper", "syllabus"].includes(docType)) {
      return NextResponse.json(
        { error: "Unsupported docType" },
        { status: 400 }
      );
    }

    const client = await connectDB();
    const db = client.db();

    // 🔹 1. Extract text
    let text = await extractTextFromFile(fileUrl);

    if (!text || text.length < 50) {
      throw new Error("Text extraction failed or too short");
    }

    // 🔹 2. Preprocess text (IMPORTANT)
    text = preprocessText(text);

    // 🔹 3. Generate IR via Groq + validation
    const parsedIR = await generateWithRetry(text, docType);

    // 🔹 4. Normalize topics (question papers only)
    if (docType === "question_paper") {
      parsedIR.questions = parsedIR.questions.map(q => ({
        ...q,
        topic: normalizeTopic(q.topic),
      }));
    }

    // 🔹 5. Generate embeddings (BATCHED)
    if (docType === "question_paper") {
      const inputs = parsedIR.questions.map(
        q => `${q.question} ${q.topic}`
      );

      const embeddings = await generateBatchEmbeddings(inputs);

      parsedIR.questions = parsedIR.questions.map((q, i) => ({
        ...q,
        embedding: embeddings[i] || [],
      }));
    }

    if (docType === "syllabus") {
      const inputs = parsedIR.topics.map(
        t => `${t.topic} ${(t.subtopics || []).join(" ")}`
      );

      const embeddings = await generateBatchEmbeddings(inputs);

      parsedIR.topics = parsedIR.topics.map((t, i) => ({
        ...t,
        embedding: embeddings[i] || [],
      }));
    }

    // 🔹 6. Attach metadata
    const finalDoc = {
      ...parsedIR,
      projectId,
      fileUrl,
      createdAt: new Date(),
    };

    // 🔹 7. Store in DB
    const collectionName =
      docType === "question_paper" ? "question_ir" : "syllabus_ir";

    const result = await db.collection(collectionName).insertOne(finalDoc);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    });

  } catch (err) {
    console.error("PROCESS ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Processing failed" },
      { status: 500 }
    );
  }
}