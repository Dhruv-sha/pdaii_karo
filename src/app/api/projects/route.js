import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db();

    // Get unique projectIds from both collections
    const [qIds, sIds] = await Promise.all([
      db.collection("question_ir").distinct("projectId"),
      db.collection("syllabus_ir").distinct("projectId"),
    ]);

    // Merge and deduplicate
    const all = [...new Set([...qIds, ...sIds])].filter(Boolean).sort();

    return NextResponse.json({ projectIds: all });
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return NextResponse.json({ projectIds: [] }, { status: 500 });
  }
}
