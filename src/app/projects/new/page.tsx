"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import FloorPlan2D from "@/components/FloorPlan2D";
import KakaoAddressSearch, {
  type ResolvedAddress,
} from "@/components/KakaoAddressSearch";
import KakaoMap, { type MapPin } from "@/components/KakaoMap";
import { createConsultation } from "@/lib/consultations/store";
import {
  DEMO_ARCHITECTS,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  type BuildSpecialty,
  type DemoArchitect,
} from "@/lib/demo/architects";
import { haversineKm } from "@/lib/geo";
import type {
  DesignRequirements,
  Estimate,
  FloorPlan,
  ProjectStyle,
} from "@/lib/types";
import { PYEONG_TO_M2 } from "@/lib/types";

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

type Step = 1 | 2 | 3 | 4 | 5;

export default function NewProjectWizard() {
  const [step, setStep] = useState<Step>(1);
  const [req, setReq] = useState<DesignRequirements>({
    totalAreaPyeong: 30,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    style: "modern",
    budgetWon: 350_000_000,
    notes: "",
  });
  const [lot, setLot] = useState<ResolvedAddress | null>(null);
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
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <ProgressBar step={step} />

      {step === 1 && (
        <Step1
          req={req}
          setReq={setReq}
          lot={lot}
          setLot={setLot}
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
        <Step4
          estimate={estimate}
          onBack={() => setStep(3)}
          onNext={() => setStep(5)}
          hasLot={Boolean(lot)}
          onRegenerate={() => setStep(1)}
        />
      )}

      {step === 5 && lot && estimate && (
        <Step5
          lot={lot}
          req={req}
          estimate={estimate}
          onBack={() => setStep(4)}
        />
      )}

      {step === 5 && !lot && (
        <NoLotFallback onJumpToStep1={() => setStep(1)} />
      )}
    </div>
  );
}

function ProgressBar({ step }: { step: Step }) {
  const labels = ["요구사항", "평면도", "3D", "견적", "매칭"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((l, i) => {
        const idx = (i + 1) as Step;
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
            {i < labels.length - 1 && (
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
  lot,
  setLot,
  onNext,
  loading,
}: {
  req: DesignRequirements;
  setReq: (r: DesignRequirements) => void;
  lot: ResolvedAddress | null;
  setLot: (a: ResolvedAddress | null) => void;
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

      <Field label="대지 위치 (선택, 가까운 건축사 매칭에 사용)">
        <KakaoAddressSearch
          initialAddress={lot?.address ?? ""}
          placeholder="예: 강원 평창군 봉평면"
          onResolve={setLot}
        />
      </Field>
      {lot && (
        <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
          📍 {lot.address}
        </div>
      )}

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
          {loading ? "계산 중..." : "예상 견적 보기 →"}
        </button>
      </div>
    </div>
  );
}

function Step4({
  estimate,
  onBack,
  onNext,
  hasLot,
  onRegenerate,
}: {
  estimate: Estimate;
  onBack: () => void;
  onNext: () => void;
  hasLot: boolean;
  onRegenerate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold">예상 견적</h2>
        <span className="text-[11px] text-gray-400">참고용 콘셉트</span>
      </div>

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

      <p className="rounded-lg bg-yellow-50 px-3 py-2 text-[11px] leading-relaxed text-yellow-700">
        예상 견적은 입력값과 룰베이스 기준의 참고 금액이며, 실제 견적은 현장
        조건·자재·법규 검토에 따라 달라질 수 있습니다.
      </p>

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

      <p className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-600">
        이 설계는 참고용 콘셉트입니다. 실제 설계 및 인허가는 등록 건축사의
        검토가 필요합니다.
      </p>

      <button
        type="button"
        onClick={onNext}
        className="rounded-xl bg-brand py-3 text-base font-semibold text-white"
      >
        {hasLot
          ? "🤝 이 설계로 상담 요청하기"
          : "🤝 가까운 전문가에게 상담 요청 (대지 위치 필요)"}
      </button>
      <button
        type="button"
        onClick={onRegenerate}
        className="rounded-xl border border-brand-100 bg-brand-50 py-2.5 text-sm font-medium text-brand"
      >
        설계 다시 수정하기
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

function styleToSpecialties(style: ProjectStyle): BuildSpecialty[] {
  switch (style) {
    case "modern":
      return ["COUNTRY_HOUSE", "PASSIVE_HOUSE"];
    case "minimal":
      return ["COUNTRY_HOUSE", "MOBILE_HOUSE"];
    case "natural":
      return ["COUNTRY_HOUSE", "STAY_REST_HOUSE"];
    case "industrial":
      return ["MOBILE_HOUSE", "COUNTRY_HOUSE"];
    case "hanok":
      return ["COUNTRY_HOUSE", "REMODEL"];
    default:
      return ["COUNTRY_HOUSE"];
  }
}

function Step5({
  lot,
  req,
  estimate,
  onBack,
}: {
  lot: ResolvedAddress;
  req: DesignRequirements;
  estimate: Estimate;
  onBack: () => void;
}) {
  const targetSpecialties = useMemo(
    () => styleToSpecialties(req.style),
    [req.style],
  );

  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  const [sentIds, setSentIds] = useState<string[] | null>(null);

  const matches = useMemo(() => {
    const scored = DEMO_ARCHITECTS.map((a) => {
      const distanceKm = haversineKm(
        { lat: lot.lat, lng: lot.lng },
        { lat: a.lat, lng: a.lng },
      );
      const overlap = a.specialties.filter((s) =>
        targetSpecialties.includes(s),
      ).length;
      return { a, distanceKm, overlap };
    });
    // verified 우선, 그다음 매칭 점수, 거리순
    return scored
      .filter((s) => s.overlap > 0)
      .sort((x, y) => {
        const xVer = x.a.verifiedStatus === "verified" ? 0 : 1;
        const yVer = y.a.verifiedStatus === "verified" ? 0 : 1;
        if (xVer !== yVer) return xVer - yVer;
        if (y.overlap !== x.overlap) return y.overlap - x.overlap;
        return x.distanceKm - y.distanceKm;
      })
      .slice(0, 8);
  }, [lot, targetSpecialties]);

  const pins: MapPin[] = useMemo(() => {
    const list: MapPin[] = [
      {
        id: "_lot",
        name: "대지 위치",
        lat: lot.lat,
        lng: lot.lng,
        color: "#FF6F0F",
        category: "대지",
      },
    ];
    matches.forEach(({ a }) => {
      list.push({
        id: a.id,
        name: a.name,
        lat: a.lat,
        lng: a.lng,
        color: SPECIALTY_COLOR[a.specialties[0]],
        category: SPECIALTY_LABEL[a.specialties[0]],
      });
    });
    return list;
  }, [lot, matches]);

  function toggle(id: string) {
    setPickedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function buildPrefill() {
    const styleLabel = STYLES.find((s) => s.key === req.style)?.label ?? req.style;
    const title = `[AI 콘셉트 설계 상담] ${req.totalAreaPyeong}평 ${styleLabel} 주택`;
    const message = [
      `■ 요구사항`,
      `· 평수: ${req.totalAreaPyeong}평 (약 ${(req.totalAreaPyeong * PYEONG_TO_M2).toFixed(1)}㎡)`,
      `· 층수: ${req.floors}층 / 침실 ${req.bedrooms}개 / 욕실 ${req.bathrooms}개`,
      `· 스타일: ${styleLabel}`,
      req.budgetWon ? `· 예산: ${req.budgetWon.toLocaleString()}원` : "",
      req.notes ? `· 추가 요청: ${req.notes}` : "",
      ``,
      `■ 대지`,
      `· 주소: ${lot.address}`,
      ``,
      `■ AI 예상 견적 (참고용)`,
      `· 총 ${(estimate.totalWon / 100_000_000).toFixed(2)}억원`,
      `· 평당 ${(estimate.pyeongUnitWon / 10000).toFixed(0)}만원 / 공기 약 ${estimate.leadTimeDays}일`,
      ``,
      `※ AI 설계 결과와 예상 견적은 참고용 콘셉트이며, 실제 견적·도면은 현장 검토에 따라 달라집니다.`,
    ]
      .filter(Boolean)
      .join("\n");
    return { title, message };
  }

  async function sendConsultationRequests() {
    const verifiedOnly = Array.from(pickedIds).filter((id) => {
      const a = DEMO_ARCHITECTS.find((x) => x.id === id);
      return a?.verifiedStatus === "verified";
    });
    const prefill = buildPrefill();
    const created: string[] = [];
    for (const companyId of verifiedOnly) {
      const c = await createConsultation({
        companyId,
        title: prefill.title,
        message: prefill.message,
        budgetWon: req.budgetWon,
        desiredArea: lot.region ?? lot.address,
      });
      created.push(c.id);
    }
    setSentIds(created);
  }

  if (sentIds) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
        <p className="text-4xl">📨</p>
        <p className="text-lg font-bold">상담 요청이 접수되었습니다</p>
        <p className="text-sm text-gray-600">
          {sentIds.length}개 입점 업체에 상담 요청이 전달됐습니다.
          <br />
          업체 답변은 <strong>내 상담함</strong>에서 확인할 수 있습니다.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link
            href="/consultations"
            className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            상담함 열기
          </Link>
          <button
            onClick={onBack}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
          >
            이전으로
          </button>
        </div>
        <p className="mt-2 rounded-lg bg-white p-2.5 text-[11px] leading-relaxed text-gray-500">
          상담 요청은 계약 체결이 아니며, 실제 계약은 사용자와 업체 간 직접
          진행됩니다.
        </p>
      </div>
    );
  }

  const verifiedSelected = Array.from(pickedIds).filter((id) => {
    const a = DEMO_ARCHITECTS.find((x) => x.id === id);
    return a?.verifiedStatus === "verified";
  });

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">대지에서 가까운 전문가</h2>
      <p className="text-xs text-gray-500">
        📍 {lot.address} · 스타일 매칭: {targetSpecialties
          .map((s) => SPECIALTY_LABEL[s])
          .join(" / ")}
      </p>

      <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-200">
        <KakaoMap pins={pins} fitBounds />
      </div>

      <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
        입점 업체에만 상담을 요청할 수 있어요. 비입점·샘플 업체는 참고용으로만
        표시됩니다.
      </p>

      <ul className="flex flex-col gap-2">
        {matches.map(({ a, distanceKm, overlap }) => {
          const on = pickedIds.has(a.id);
          const consultable = a.verifiedStatus === "verified";
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => consultable && toggle(a.id)}
                disabled={!consultable}
                className={`flex w-full items-start justify-between gap-3 rounded-2xl border p-3 text-left transition ${
                  on
                    ? "border-brand bg-brand-50"
                    : consultable
                      ? "border-gray-200 hover:border-brand-100"
                      : "border-gray-100 bg-gray-50 opacity-70"
                }`}
              >
                <div className="flex-1">
                  <p className="text-xs text-gray-400">
                    {a.region} · {distanceKm.toFixed(1)}km · 매칭 {overlap}개
                    {!consultable && " · 입점 후 상담 가능"}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">{a.name}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {a.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                        style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                      >
                        {SPECIALTY_LABEL[s]}
                      </span>
                    ))}
                  </div>
                </div>
                {consultable ? (
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      on
                        ? "border-brand bg-brand text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {on ? "✓" : ""}
                  </span>
                ) : (
                  <span className="mt-0.5 shrink-0 rounded-full bg-gray-200 px-1.5 py-0.5 text-[9px] text-gray-600">
                    참고
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {matches.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
          매칭되는 업체가 없어요. 입점 신청 받는 중입니다.
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onBack}
          className="rounded-xl border border-gray-200 py-2.5 text-sm"
        >
          이전
        </button>
        <button
          onClick={sendConsultationRequests}
          disabled={verifiedSelected.length === 0}
          className="rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {verifiedSelected.length}개 입점 업체에 상담 요청
        </button>
      </div>

      <p className="rounded-lg bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-500">
        AI 설계 결과와 예상 견적은 참고용입니다. 실제 설계, 인허가, 시공 계약은
        관련 자격을 가진 전문가와 사용자 간 직접 진행됩니다.
      </p>
    </div>
  );
}

function NoLotFallback({ onJumpToStep1 }: { onJumpToStep1: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 p-8 text-center">
      <p className="text-3xl">📍</p>
      <p className="text-base font-semibold">대지 위치가 필요해요</p>
      <p className="text-sm text-gray-500">
        Step 1에서 대지 주소를 입력하면 가까운 건축사를 매칭해 드려요.
      </p>
      <button
        onClick={onJumpToStep1}
        className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
      >
        주소 입력하러 가기
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
