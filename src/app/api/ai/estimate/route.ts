import { NextResponse } from "next/server";
import { estimateProject } from "@/lib/ai/estimate";
import type { DesignRequirements, FloorPlan } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    requirements?: DesignRequirements;
    plan?: FloorPlan;
  };
  if (!body.requirements || !body.plan) {
    return NextResponse.json(
      { error: "requirements and plan are required" },
      { status: 400 },
    );
  }
  const estimate = estimateProject(body.requirements, body.plan);
  return NextResponse.json({ estimate });
}
