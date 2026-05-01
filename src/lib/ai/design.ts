import Anthropic from "@anthropic-ai/sdk";
import type { DesignRequirements, FloorPlan } from "@/lib/types";
import { PYEONG_TO_M2 } from "@/lib/types";

const SYSTEM_PROMPT = `당신은 한국 주거 건축의 콘셉트 평면 설계를 돕는 AI 보조 설계자입니다.
사용자의 요구사항을 받아 단일 층의 평면도를 JSON으로 생성합니다.

규칙:
- 모든 좌표/치수 단위는 미터(m), 좌상단 원점, x: 우측, y: 하단.
- 방은 직사각형. 겹치지 않고, 외벽 안에서 벽 두께를 고려해 0.1m 이상 떨어지게.
- 거실/주방은 남향(아래쪽)으로 배치 시도, 화장실/현관은 북측.
- 침실 최소 9㎡, 거실 최소 16㎡, 주방 최소 6㎡, 화장실 최소 3㎡.
- doors/windows는 방의 외측 벽 중앙에 배치.
- 한국 주거 평균: 1평 ≈ 3.3058㎡.

응답은 반드시 다음 JSON 스키마만 출력 (코드블록 없이 순수 JSON):
{
  "width": number,
  "depth": number,
  "totalAreaM2": number,
  "rooms": [{"id": string, "name": string, "x": number, "y": number, "w": number, "h": number}],
  "doors": [{"x": number, "y": number, "rotation": 0|90, "width": number}],
  "windows": [{"x": number, "y": number, "rotation": 0|90, "width": number}],
  "notes": string
}`;

export async function generateFloorPlan(
  req: DesignRequirements,
): Promise<FloorPlan> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return mockFloorPlan(req);
  }

  const client = new Anthropic({ apiKey });
  const userPrompt = formatRequirements(req);

  try {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = res.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const json = extractJson(text);
    return validatePlan(json);
  } catch (err) {
    console.error("[ai/design] Claude call failed, falling back to mock:", err);
    return mockFloorPlan(req);
  }
}

function formatRequirements(r: DesignRequirements): string {
  return [
    `총 면적: ${r.totalAreaPyeong}평 (${(r.totalAreaPyeong * PYEONG_TO_M2).toFixed(1)}㎡)`,
    `층수: ${r.floors}층`,
    `침실: ${r.bedrooms}개, 욕실: ${r.bathrooms}개`,
    `스타일: ${r.style}`,
    r.budgetWon ? `예산: ${r.budgetWon.toLocaleString()}원` : null,
    r.notes ? `요청사항: ${r.notes}` : null,
    "",
    "위 요구사항으로 1층 평면도 JSON을 생성하세요.",
  ]
    .filter(Boolean)
    .join("\n");
}

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("no JSON in response");
  return JSON.parse(text.slice(start, end + 1));
}

function validatePlan(raw: unknown): FloorPlan {
  if (typeof raw !== "object" || raw === null) throw new Error("invalid plan");
  const p = raw as Partial<FloorPlan>;
  if (!Array.isArray(p.rooms) || !p.width || !p.depth) {
    throw new Error("plan missing required fields");
  }
  return {
    width: Number(p.width),
    depth: Number(p.depth),
    totalAreaM2: Number(p.totalAreaM2 ?? p.width * p.depth),
    rooms: p.rooms,
    doors: p.doors ?? [],
    windows: p.windows ?? [],
    notes: p.notes,
  };
}

/** Deterministic-ish mock plan when no API key is set. */
export function mockFloorPlan(req: DesignRequirements): FloorPlan {
  const targetM2 = req.totalAreaPyeong * PYEONG_TO_M2;
  const ratio = 1.4;
  const depth = Math.sqrt(targetM2 / ratio);
  const width = depth * ratio;

  const margin = 0.2;
  const w = Number(width.toFixed(2));
  const d = Number(depth.toFixed(2));

  const livingW = w * 0.55;
  const livingH = d * 0.55;
  const kitchenW = w - livingW - margin;
  const bathW = w * 0.3;
  const bathH = d * 0.25;
  const entryW = w - bathW - margin;
  const entryH = bathH;

  const rooms: FloorPlan["rooms"] = [
    { id: "living", name: "거실", x: 0, y: d - livingH, w: livingW, h: livingH },
    {
      id: "kitchen",
      name: "주방/식당",
      x: livingW + margin,
      y: d - livingH,
      w: kitchenW,
      h: livingH,
    },
    { id: "bath", name: "욕실", x: 0, y: 0, w: bathW, h: bathH },
    {
      id: "entry",
      name: "현관",
      x: bathW + margin,
      y: 0,
      w: entryW,
      h: entryH,
    },
  ];

  const remainingW = w;
  const remainingH = d - livingH - bathH - margin * 2;
  const bedCount = Math.max(1, req.bedrooms);
  const bedW = (remainingW - margin * (bedCount - 1)) / bedCount;
  for (let i = 0; i < bedCount; i++) {
    rooms.push({
      id: `bed${i + 1}`,
      name: i === 0 ? "안방" : `침실${i}`,
      x: i * (bedW + margin),
      y: bathH + margin,
      w: bedW,
      h: remainingH,
    });
  }

  return {
    width: w,
    depth: d,
    totalAreaM2: Number((w * d).toFixed(2)),
    rooms,
    doors: [
      { x: bathW + margin + entryW / 2, y: 0, rotation: 0, width: 0.9 },
    ],
    windows: [
      { x: livingW / 2, y: d, rotation: 0, width: 2.4 },
      { x: livingW + margin + kitchenW / 2, y: d, rotation: 0, width: 1.8 },
    ],
    notes: `[mock] ${req.totalAreaPyeong}평 ${req.style} 콘셉트 — 실제 AI 응답을 받으려면 ANTHROPIC_API_KEY를 설정하세요.`,
  };
}
