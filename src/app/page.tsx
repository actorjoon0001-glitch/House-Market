import Link from "next/link";
import LegalNotice from "@/components/LegalNotice";
import { DEMO_ARCHITECTS, SPECIALTY_LABEL } from "@/lib/demo/architects";

const QUICK_LINKS = [
  { href: "/architects?specialty=COUNTRY_HOUSE", label: "전원주택", emoji: "🏡" },
  { href: "/architects?specialty=MOBILE_HOUSE", label: "이동식주택", emoji: "🚚" },
  { href: "/architects?specialty=STAY_REST_HOUSE", label: "체류형쉼터", emoji: "🏕️" },
  { href: "/architects?specialty=PASSIVE_HOUSE", label: "패시브하우스", emoji: "🌿" },
];

const STEPS = [
  {
    n: 1,
    icon: "✨",
    title: "AI로 집 구상",
    body: "원하는 평수·방·스타일만 입력하면 AI가 평면도와 3D 콘셉트를 만들어 줍니다.",
  },
  {
    n: 2,
    icon: "💰",
    title: "예상 견적 확인",
    body: "면적·자재·층수에 따른 참고용 예상 견적을 즉시 확인할 수 있습니다.",
  },
  {
    n: 3,
    icon: "📞",
    title: "가까운 전문가에게 상담 요청",
    body: "내 대지 주변의 건축사·시공사에게 상담을 요청하고 직접 비교하세요.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:gap-10 md:py-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-brand-100 p-6 md:p-12">
        <div className="md:max-w-2xl">
          <p className="text-xs font-semibold text-brand md:text-sm">
            집마켓 · House Market
          </p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight md:text-5xl">
            집 짓고, 고치고, 거래하는
            <br />
            모든 것을 한 곳에서.
          </h1>
          <p className="mt-3 text-sm text-gray-600 md:text-lg">
            AI로 콘셉트를 만들고, 가까운 건축사·시공사·자재상과 상담을
            시작하세요.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row md:mt-7">
            <Link
              href="/projects/new"
              className="rounded-xl bg-brand px-5 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-brand-600"
            >
              ✨ AI 설계 시작하기
            </Link>
            <Link
              href="/map"
              className="rounded-xl border border-brand bg-white px-5 py-3 text-center text-base font-semibold text-brand transition hover:bg-brand-50"
            >
              🗺️ 내 주변 전문가 찾기
            </Link>
          </div>
        </div>
      </section>

      {/* 3-STEP EXPLANATION */}
      <section>
        <div className="mb-3 md:mb-5">
          <h2 className="text-lg font-bold md:text-2xl">이렇게 사용하세요</h2>
          <p className="mt-1 text-sm text-gray-500">
            3단계로 콘셉트부터 상담 요청까지
          </p>
        </div>
        <ol className="grid gap-3 md:grid-cols-3 md:gap-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-brand-100"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {s.n}
                </span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <p className="mt-3 text-base font-bold">{s.title}</p>
              <p className="mt-1 text-sm text-gray-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* QUICK CATEGORY LINKS */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold md:text-xl">분야별로 살펴보기</h2>
          <Link href="/architects" className="text-sm text-brand">
            전체 보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {QUICK_LINKS.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-2 rounded-2xl bg-brand-50 p-4 text-center transition hover:bg-brand-100 active:scale-95 md:p-6"
            >
              <span className="text-3xl md:text-4xl">{q.emoji}</span>
              <span className="text-sm font-medium text-gray-700">
                {q.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* MARKET PLACEHOLDER */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold md:text-xl">동네 중고거래</h2>
          <Link href="/market" className="text-sm text-brand">
            전체보기
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400 md:p-12">
          아직 매물이 없어요. 첫 글을 올려보세요.
        </div>
      </section>

      {/* LEGAL */}
      <LegalNotice />

      <p className="mt-4 text-center text-xs text-gray-400">
        등록된 샘플 업체 {DEMO_ARCHITECTS.length}곳 · 분야{" "}
        {Object.keys(SPECIALTY_LABEL).length}종 ·{" "}
        <Link href="/apply" className="text-brand underline">
          업체 입점 신청
        </Link>
      </p>
    </div>
  );
}
