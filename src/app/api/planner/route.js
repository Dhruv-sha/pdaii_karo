import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { allocateTime } from "@/lib/planner/allocateTime";
import { distributeTopics } from "@/lib/planner/distributeTopics";
import { buildSchedule } from "@/lib/planner/buildSchedule";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const client = await connectDB();
    const db = client.db();

    const plan = await db
      .collection("study_plans")
      .findOne({ projectId }, { sort: { createdAt: -1 } });

    if (!plan) {
      return NextResponse.json({ schedule: null });
    }

    return NextResponse.json({
      schedule: plan.schedule,
      days: plan.days,
      hoursPerDay: plan.hoursPerDay,
      createdAt: plan.createdAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load plan" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { projectId, days, hoursPerDay } =
      await req.json();

    const parsedDays = Number(days);
    const parsedHours = Number(hoursPerDay);

    if (!projectId || !parsedDays || !parsedHours) {
      return NextResponse.json(
        { error: "Missing inputs" },
        { status: 400 }
      );
    }

    const client = await connectDB();
    const db = client.db();

    // 🔹 Get ranked topics
    const importanceData = await db
      .collection("importance_scores")
      .findOne({ projectId });

    if (!importanceData) {
      return NextResponse.json(
        { error: "Run importance engine first" },
        { status: 400 }
      );
    }

    const rankedTopics = importanceData.rankedTopics;

    // 🔹 Total hours
    const totalHours = parsedDays * parsedHours;

    // 🔹 Step 1: allocate time
    const topicsWithTime = allocateTime(
      rankedTopics,
      totalHours
    );

    // 🔹 Step 2: distribute into sessions
    const sessions = distributeTopics(topicsWithTime);

    // 🔹 Step 3: build schedule
    const schedule = buildSchedule(
      sessions,
      parsedDays,
      parsedHours
    );

    // 🔹 Store
    await db.collection("study_plans").insertOne({
      projectId,
      schedule,
      days: parsedDays,
      hoursPerDay: parsedHours,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      schedule,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Planner failed" },
      { status: 500 }
    );
  }
}