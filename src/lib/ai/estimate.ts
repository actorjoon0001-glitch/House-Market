import type {
  DesignRequirements,
  Estimate,
  FloorPlan,
  ProjectStyle,
} from "@/lib/types";
import { PYEONG_TO_M2 } from "@/lib/types";

const STYLE_MULTIPLIER: Record<ProjectStyle, number> = {
  minimal: 0.95,
  modern: 1.0,
  natural: 1.05,
  industrial: 1.1,
  hanok: 1.35,
};

const BASE_PER_PYEONG_WON = 7_500_000;

export function estimateProject(
  req: DesignRequirements,
  plan: FloorPlan,
): Estimate {
  const areaPyeong = plan.totalAreaM2 / PYEONG_TO_M2;
  const styleMul = STYLE_MULTIPLIER[req.style] ?? 1;
  const floorsMul = 1 + (req.floors - 1) * 0.08;
  const pyeongUnit = Math.round(BASE_PER_PYEONG_WON * styleMul * floorsMul);
  const construction = Math.round(pyeongUnit * areaPyeong);

  const design = Math.round(construction * 0.06);
  const permit = Math.round(construction * 0.015);
  const interior = Math.round(construction * 0.12);
  const landscape = Math.round(construction * 0.04);
  const contingency = Math.round(construction * 0.05);

  const total = construction + design + permit + interior + landscape + contingency;

  return {
    totalWon: total,
    pyeongUnitWon: pyeongUnit,
    breakdown: [
      { label: "공사비 (골조·마감)", amountWon: construction },
      { label: "설계비", amountWon: design },
      { label: "인허가·감리", amountWon: permit },
      { label: "인테리어 마감", amountWon: interior },
      { label: "조경·외부", amountWon: landscape },
      { label: "예비비 (5%)", amountWon: contingency },
    ],
    leadTimeDays: Math.round(120 + areaPyeong * 2 + req.floors * 15),
    assumptions: [
      `평당 단가: ${pyeongUnit.toLocaleString()}원 (${req.style} × ${req.floors}층 보정)`,
      `면적: 약 ${areaPyeong.toFixed(1)}평`,
      "토지·취득세·가구 별도. 지역 자재 수급에 따라 ±15% 변동 가능.",
    ],
  };
}
