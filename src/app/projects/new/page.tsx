"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import FloorPlan2D from "@/components/FloorPlan2D";
import type {
  DesignRequirements,
  Estimate,
  FloorPlan,
  ProjectStyle,
} from "@/lib/types";

const FloorPlan3D = dynamic(() => import("@/components/FloorPlan3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-400">
      3D 모델 로딩 중...
    </div>
  ),
});

const STYLES: { key: ProjectStyle; label: string; emoji: string }[] = [
  { key: "modern", label: "모던", emoji: "🏢" },
  { key: "minimal", label: "미니멀", emoji: "⬜" },
  { key: "natural", label: "내추럴", emoji: "🌿" },
  { key: "industrial", label: "인더스트리얼", emoji: "🏭" },
  { key: "hanok", label: "한옥", emoji: "🏯" },
];

export default function NewProjectWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [req, setReq] = useState<DesignRequirements>({
    totalAreaPyeong: 30,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    style: "modern",
    budgetWon: 350_000_000,
    notes: "",
  });
  const [plan, setPlan] = useState<FloorPlan | null>(null);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [usingMock, setUsingMock] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ requirements: req }),
      });
      const data = await res.json();
      setPlan(data.plan);
      setUsingMock(Boolean(data.usingMock));
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  async function makeEstimate() {
    if (!plan) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ requirements: req, plan }),
      });
      const data = await res.json();
      setEstimate(data.estimate);
      setStep(4);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ProgressBar step={step} />

      {step === 1 && (
        <Step1
          req={req}
          setReq={setReq}
          onNext={generate}
          loading={loading}
        />
      )}

      {step === 2 && plan && (
        <Step2
          plan={plan}
          usingMock={usingMock}
          onBack={() => setStep(1)}
          onRegenerate={generate}
          onNext={() => setStep(3)}
          loading={loading}
        />
      )}

      {step === 3 && plan && (
        <Step3
          plan={plan}
          onBack={() => setStep(2)}
          onNext={makeEstimate}
          loading={loading}
        />
      )}

      {step === 4 && estimate && (
        <Step4 estimate={estimate} onBack={() => setStep(3)} />
      )}
    </div>
  );
}

function ProgressBar({ step }: { step: 1 | 2 | 3 | 4 }) {
  const labels = ["요구사항", "평면도", "3D", "견적"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((l, i) => {
        const idx = (i + 1) as 1 | 2 | 3 | 4;
        const active = step >= idx;
        return (
          <div key={l} className="flex flex-1 items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                active ? "bg-brand text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {idx}
            </div>
            <span
              className={`text-xs ${active ? "text-gray-900" : "text-gray-400"}`}
            >
              {l}
            </span>
            {i < 3 && (
              <div
                className={`h-0.5 flex-1 ${active ? "bg-brand" : "bg-gray-100"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1({
  req,
  setReq,
  onNext,
  loading,
}: {
  req: DesignRequirements;
  setReq: (r: DesignRequirements) => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">어떤 집을 짓고 싶으세요?</h2>

      <Field label={`총 면적: ${req.totalAreaPyeong}평`}>
        <input
          type="range"
          min={15}
          max={80}
          value={req.totalAreaPyeong}
          onChange={(e) =>
            setReq({ ...req, totalAreaPyeong: Number(e.target.value) })
          }
          className="w-full accent-brand"
        />
      </Field>

      <div className="grid grid-cols-3 gap-3">
        <Counter
          label="층수"
          value={req.floors}
          min={1}
          max={3}
          onChange={(v) => setReq({ ...req, floors: v })}
        />
        <Counter
          label="침실"
          value={req.bedrooms}
          min={1}
          max={6}
          onChange={(v) => setReq({ ...req, bedrooms: v })}
        />
        <Counter
          label="욕실"
          value={req.bathrooms}
          min={1}
          max={4}
          onChange={(v) => setReq({ ...req, bathrooms: v })}
        />
      </div>

      <Field label="스타일">
        <div className="grid grid-cols-5 gap-2">
          {STYLES.map((s) => {
            const on = req.style === s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setReq({ ...req, style: s.key })}
                className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs ${
                  on
                    ? "border-brand bg-brand-50 text-brand"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                <span className="text-lg">{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="예산 (선택)">
        <input
          type="number"
          value={req.budgetWon ?? ""}
          onChange={(e) =>
            setReq({
              ...req,
              budgetWon: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          placeholder="350000000"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      <Field label="추가 요청사항 (선택)">
        <textarea
          value={req.notes ?? ""}
          onChange={(e) => setReq({ ...req, notes: e.target.value })}
          rows={3}
          placeholder="예) 남향에 큰 거실 창, 다락방 원해요"
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </Field>

      <button
        onClick={onNext}
        disabled={loading}
        className="mt-2 rounded-xl bg-brand py-3 text-base font-semibold text-white disabled:opacity-50"
      >
        {loading ? "AI가 설계 중..." : "AI로 평면도 생성"}
      </button>
    </div>
  );
}

function Step2({
  plan,
  usingMock,
  onBack,
  onRegenerate,
  onNext,
  loading,
}: {
  plan: FloorPlan;
  usingMock: boolean;
  onBack: () => void;
  onRegenerate: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">AI 평면도</h2>
      {usingMock && (
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
          ⚠️ 데모 모드입니다. <code>ANTHROPIC_API_KEY</code>를 설정하면 진짜 AI
          설계가 나옵니다.
        </p>
      )}
      <div className="aspect-[4/3] w-full rounded-2xl border border-gray-200 bg-white p-2">
        <FloorPlan2D plan={plan} className="h-full w-full" />
      </div>
      <p className="text-xs text-gray-500">
        총 면적 {plan.totalAreaM2.toFixed(1)}㎡ · {plan.rooms.length}실
      </p>
      {plan.notes && <p className="text-xs text-gray-500">💬 {plan.notes}</p>}

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 py-2.5 text-sm"
        >
          이전
        </button>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="rounded-xl border border-brand bg-brand-50 py-2.5 text-sm font-medium text-brand"
        >
          {loading ? "..." : "다시 생성"}
        </button>
        <button
          onClick={onNext}
          className="rounded-xl bg-brand py-2.5 text-sm font-semibold text-white"
        >
          3D 보기 →
        </button>
      </div>
    </div>
  );
}

function Step3({
  plan,
  onBack,
  onNext,
  loading,
}: {
  plan: FloorPlan;
  onBack: () => void;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">3D 미리보기</h2>
      <p className="text-xs text-gray-500">
        손가락으로 회전, 두 손가락으로 확대/축소
      </p>
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
        <FloorPlan3D plan={plan} className="h-full w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 py-2.5 text-sm"
        >
          이전
        </button>
        <button
          onClick={onNext}
          disabled={loading}
          className="rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "계산 중..." : "AI 견적 받기 →"}
        </button>
      </div>
    </div>
  );
}

function Step4({
  estimate,
  onBack,
}: {
  estimate: Estimate;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">예상 견적</h2>

      <div className="rounded-2xl bg-gradient-to-br from-brand to-brand-700 p-5 text-white">
        <p className="text-xs opacity-80">총 예상 비용</p>
        <p className="mt-1 text-3xl font-extrabold">
          {(estimate.totalWon / 100_000_000).toFixed(2)}억원
        </p>
        <p className="mt-1 text-xs opacity-80">
          평당 {(estimate.pyeongUnitWon / 10000).toFixed(0)}만원 · 공기 약{" "}
          {estimate.leadTimeDays}일
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 p-4">
        <p className="mb-3 text-sm font-semibold">비용 내역</p>
        <ul className="flex flex-col gap-2">
          {estimate.breakdown.map((b) => (
            <li
              key={b.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">{b.label}</span>
              <span className="font-medium">
                {(b.amountWon / 10_000).toLocaleString()}만원
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-100 p-4">
        <p className="mb-2 text-sm font-semibold">전제 조건</p>
        <ul className="flex flex-col gap-1 text-xs text-gray-600">
          {estimate.assumptions.map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="rounded-xl bg-brand py-3 text-base font-semibold text-white"
      >
        가까운 건축사·시공사 견적 요청
      </button>
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-gray-200 py-2.5 text-sm"
      >
        이전
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 p-2">
      <span className="text-xs text-gray-500">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-lg leading-none"
        >
          −
        </button>
        <span className="w-5 text-center text-base font-bold">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
