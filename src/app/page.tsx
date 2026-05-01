import Link from "next/link";
import { DEMO_ARCHITECTS, SPECIALTY_LABEL } from "@/lib/demo/architects";

const quickLinks = [
  { href: "/architects?specialty=COUNTRY_HOUSE", label: "전원주택", emoji: "🏡" },
  { href: "/architects?specialty=MOBILE_HOUSE", label: "이동식주택", emoji: "🚚" },
  { href: "/architects?specialty=STAY_REST_HOUSE", label: "체류형쉼터", emoji: "🏕️" },
  { href: "/architects?specialty=PASSIVE_HOUSE", label: "패시브하우스", emoji: "🌿" },
];

export default function HomePage() {
  const totalCount = DEMO_ARCHITECTS.length;

  return (
    <div className="flex flex-col gap-6 p-4 md:gap-8 md:py-8">
      <div className="-mx-4 bg-gradient-to-r from-brand to-brand-700 px-4 py-2.5 text-center text-xs font-semibold text-white md:mx-0 md:rounded-xl">
        🎉 AI 콘셉트 설계 출시! 평면도·3D·견적까지 30초만에
      </div>

      <header className="md:pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
          집마켓 <span className="text-brand">.</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          건축주 · 건축사 · 시공사 · 자재상이 만나는 집 전문 플랫폼.
          <br className="hidden md:block" />
          AI로 콘셉트 설계하고, 지도에서 가까운 시공사를 찾고, 동네에서 자재까지 거래하세요.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="flex flex-col items-center gap-2 rounded-2xl bg-brand-50 p-4 text-center transition hover:bg-brand-100 active:scale-95 md:p-6"
          >
            <span className="text-3xl md:text-4xl">{q.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{q.label}</span>
          </Link>
        ))}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/projects/new"
          className="block rounded-2xl bg-gradient-to-br from-brand to-brand-700 p-5 text-white shadow-lg transition hover:shadow-xl md:p-7"
        >
          <p className="text-xs font-medium opacity-90">✨ AI 콘셉트 설계</p>
          <p className="mt-1.5 text-lg font-bold leading-snug md:text-2xl">
            AI로 평면도·3D 만들고
            <br />
            그대로 견적 받기
          </p>
          <p className="mt-2 text-xs opacity-90 md:text-sm">
            요구사항만 입력 → 30초만에 콘셉트 완성
          </p>
        </Link>

        <Link
          href="/map"
          className="block rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 transition hover:border-brand md:p-7"
        >
          <p className="text-xs font-medium text-brand">🗺️ 전국 시공 지도</p>
          <p className="mt-1.5 text-lg font-bold leading-snug md:text-2xl">
            체류형쉼터 · 이동식 · 전원주택
            <br />
            가까운 건축사 한눈에
          </p>
          <p className="mt-2 text-xs text-gray-500 md:text-sm">
            {totalCount}개 샘플 업체 등록 · 입점 업체 모집 중
          </p>
        </Link>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-xl">동네 중고거래</h2>
          <Link href="/market" className="text-sm text-brand">
            전체보기
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400 md:p-12">
          아직 매물이 없어요. 첫 글을 올려보세요.
        </div>
      </section>

      <footer className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400 md:mt-8">
        <p>
          📋 지도/디렉토리에 표시되는 모든 업체는 현재 <strong>샘플 데이터</strong>입니다.
        </p>
        <p className="mt-1">
          실제 업체로 교체되려면{" "}
          <Link href="/apply" className="text-brand underline">
            입점 신청
          </Link>
          이 필요합니다 (개인정보보호법 준수).
        </p>
      </footer>
    </div>
  );
}
