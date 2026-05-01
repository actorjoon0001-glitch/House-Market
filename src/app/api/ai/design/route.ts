import { NextResponse } from "next/server";
import { generateFloorPlan } from "@/lib/ai/design";
import type { DesignRequirements } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as { requirements?: DesignRequirements };
  if (!body.requirements) {
    return NextResponse.json(
      { error: "requirements is required" },
      { status: 400 },
    );
  }
  const plan = await generateFloorPlan(body.requirements);
  return NextResponse.json({ plan, usingMock: !process.env.ANTHROPIC_API_KEY });
}
