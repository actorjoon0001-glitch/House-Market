import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import LegalNotice from "@/components/LegalNotice";
import {
  findArchitect,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
} from "@/lib/demo/architects";

export default function ArchitectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const architect = findArchitect(params.id);
  if (!architect) notFound();

  const verifiedBadge = (() => {
    switch (architect.verifiedStatus) {
      case "verified":
        return { label: "✓ 검증완료", cls: "bg-green-100 text-green-700" };
      case "pending":
        return { label: "검증중", cls: "bg-blue-100 text-blue-700" };
      case "sample":
      default:
        return { label: "샘플", cls: "bg-yellow-100 text-yellow-700" };
    }
  })();

  return (
    <div className="flex flex-col gap-5 p-4 md:py-8">
      <Link href="/architects" className="text-xs text-brand">
        ← 입점 업체 목록
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${verifiedBadge.cls}`}
          >
            {verifiedBadge.label}
          </span>
          <span className="text-xs text-gray-500">{architect.region}</span>
        </div>
        <h1 className="text-2xl font-bold md:text-3xl">{architect.name}</h1>
        <p className="text-sm text-gray-600">{architect.description}</p>
        {architect.rating && (
          <p className="text-sm text-gray-500">
            ⭐ <strong className="text-gray-800">{architect.rating}</strong> ·
            후기 {architect.reviewCount}개
          </p>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          {/* Portfolio placeholder */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold">포트폴리오</p>
            <div className="grid grid-cols-3 gap-2">
              {architect.portfolioImages.map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-gray-100 text-2xl"
                >
                  🏠
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-400">
              샘플 포트폴리오 placeholder입니다. 실제 입점 업체는 본인이 등록한
              이미지가 표시됩니다.
            </p>
          </div>

          {/* Specialties */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold">예상 상담 가능 분야</p>
            <div className="flex flex-wrap gap-1.5">
              {architect.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                >
                  {SPECIALTY_LABEL[s]}
                </span>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-semibold">서비스 지역</p>
            <div className="flex flex-wrap gap-1.5">
              {architect.serviceAreas.map((r) => (
                <span
                  key={r}
                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Reviews placeholder */}
          <div>
            <p className="mb-2 text-sm font-semibold">후기</p>
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
              아직 후기가 없어요.
            </div>
          </div>
        </div>

        {/* Consultation request form */}
        <div className="md:col-span-1">
          <div
            id="consult"
            className="sticky top-4 rounded-2xl border border-brand-100 bg-brand-50 p-5"
          >
            <ConsultationRequestForm architectName={architect.name} />
            <p className="mt-3 rounded-lg bg-white p-2.5 text-[11px] leading-relaxed text-gray-500">
              상담 요청은 계약 체결이 아니며, 실제 계약은 사용자와 업체 간 직접
              진행됩니다.
            </p>
          </div>
        </div>
      </section>

      <LegalNotice />
    </div>
  );
}
