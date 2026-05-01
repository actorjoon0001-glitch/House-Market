"use client";

import type { FloorPlan } from "@/lib/types";

const ROOM_COLORS: Record<string, string> = {
  거실: "#FFE0CC",
  "주방/식당": "#FFD7B5",
  주방: "#FFD7B5",
  안방: "#E5F1FF",
  침실1: "#E5F1FF",
  침실2: "#E5F1FF",
  침실3: "#E5F1FF",
  욕실: "#D9F2EC",
  현관: "#F0F0F0",
};

type Props = {
  plan: FloorPlan;
  className?: string;
};

export default function FloorPlan2D({ plan, className }: Props) {
  const padding = 0.5;
  const vbW = plan.width + padding * 2;
  const vbH = plan.depth + padding * 2;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x={padding}
        y={padding}
        width={plan.width}
        height={plan.depth}
        fill="white"
        stroke="#1f2937"
        strokeWidth={0.12}
      />
      {plan.rooms.map((r) => (
        <g key={r.id}>
          <rect
            x={padding + r.x}
            y={padding + r.y}
            width={r.w}
            height={r.h}
            fill={ROOM_COLORS[r.name] ?? "#F8F8F8"}
            stroke="#374151"
            strokeWidth={0.06}
          />
          <text
            x={padding + r.x + r.w / 2}
            y={padding + r.y + r.h / 2}
            fontSize={Math.min(r.w, r.h) * 0.18}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#111827"
            fontWeight={600}
          >
            {r.name}
          </text>
          <text
            x={padding + r.x + r.w / 2}
            y={padding + r.y + r.h / 2 + Math.min(r.w, r.h) * 0.22}
            fontSize={Math.min(r.w, r.h) * 0.12}
            textAnchor="middle"
            fill="#6b7280"
          >
            {(r.w * r.h).toFixed(1)}㎡
          </text>
        </g>
      ))}
      {plan.doors?.map((d, i) => (
        <circle
          key={`door-${i}`}
          cx={padding + d.x}
          cy={padding + d.y}
          r={0.18}
          fill="#FF6F0F"
        />
      ))}
      {plan.windows?.map((w, i) => (
        <line
          key={`win-${i}`}
          x1={padding + w.x - w.width / 2}
          y1={padding + w.y}
          x2={padding + w.x + w.width / 2}
          y2={padding + w.y}
          stroke="#3b82f6"
          strokeWidth={0.15}
        />
      ))}
    </svg>
  );
}
