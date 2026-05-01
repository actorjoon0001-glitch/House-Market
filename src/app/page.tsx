import Link from "next/link";

const quickLinks = [
  { href: "/companies?category=ARCHITECT", label: "건축사", emoji: "📐" },
  { href: "/companies?category=CONTRACTOR", label: "시공사", emoji: "🏗️" },
  { href: "/companies?category=MATERIAL", label: "자재상", emoji: "🧱" },
  { href: "/companies?category=INTERIOR", label: "인테리어", emoji: "🛋️" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="pt-4">
        <h1 className="text-2xl font-bold">
          집마켓 <span className="text-brand">.</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          가까운 건축사·자재상·중고매물을 한눈에
        </p>
      </header>

      <section className="grid grid-cols-4 gap-3">
        {quickLinks.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="flex flex-col items-center gap-1 rounded-2xl bg-brand-50 p-3 text-center transition active:scale-95"
          >
            <span className="text-2xl">{q.emoji}</span>
            <span className="text-xs font-medium text-gray-700">{q.label}</span>
          </Link>
        ))}
      </section>

      <Link
        href="/projects/new"
        className="block rounded-2xl bg-gradient-to-br from-brand to-brand-700 p-5 text-white shadow-lg"
      >
        <p className="text-xs font-medium opacity-90">✨ NEW · AI 콘셉트 설계</p>
        <p className="mt-1.5 text-lg font-bold leading-snug">
          AI로 평면도·3D 만들고
          <br />
          그대로 견적 받기
        </p>
        <p className="mt-2 text-xs opacity-90">
          요구사항만 입력 → 30초만에 콘셉트 완성
        </p>
      </Link>

      <Link
        href="/map"
        className="block rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">내 주변</p>
            <p className="mt-1 text-lg font-semibold">
              지도로 가까운 업체 보기
            </p>
          </div>
          <span className="text-3xl">🗺️</span>
        </div>
      </Link>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold">동네 중고거래</h2>
          <Link href="/market" className="text-sm text-brand">
            전체보기
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
          아직 매물이 없어요. 첫 글을 올려보세요.
        </div>
      </section>
    </div>
  );
}
