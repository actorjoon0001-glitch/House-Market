import Link from "next/link";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">내 집 프로젝트</h1>
        <Link
          href="/projects/new"
          className="rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"
        >
          + 새 설계
        </Link>
      </header>

      <Link
        href="/projects/new"
        className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5"
      >
        <p className="text-xs font-medium text-brand">AI 콘셉트 설계</p>
        <p className="mt-1 text-lg font-bold leading-snug">
          요구사항만 입력하면
          <br />
          AI가 평면도와 3D를 만들어줘요
        </p>
        <p className="mt-2 text-xs text-gray-500">
          → 그 디자인 그대로 가까운 건축사·시공사한테 견적 요청
        </p>
      </Link>

      <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
        아직 시작한 프로젝트가 없어요.
      </div>
    </div>
  );
}
