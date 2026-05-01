import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import LegalNotice from "@/components/LegalNotice";
import SafetyNotice from "@/components/SafetyNotice";
import {
  findArchitect,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  visibilityPolicy,
  type DemoArchitect,
} from "@/lib/demo/architects";

export default function ArchitectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const a = findArchitect(params.id);
  if (!a) notFound();

  const policy = visibilityPolicy(a);
  const isPublic = a.verifiedStatus === "public";
  const isVerified = a.verifiedStatus === "verified";

  return (
    <div className="flex flex-col gap-5 p-4 md:py-8">
      <Link href="/architects" className="text-xs text-brand">
        ← 등록 업체 목록
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${policy.badge.cls}`}
          >
            {policy.badge.label}
          </span>
          <span className="text-xs text-gray-500">{a.region}</span>
        </div>
        <h1 className="text-2xl font-bold leading-snug md:text-3xl">{a.name}</h1>
        <p className="text-xs text-gray-500">{policy.statusLabel}</p>
      </header>

      {isPublic && <PublicSourceBanner />}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-col gap-4">
          <SpecialtiesBlock a={a} />
          <ServiceAreasBlock a={a} />

          {policy.canShowRichDetail ? (
            <>
              <PortfolioBlock a={a} />
              <ReviewsBlock a={a} />
            </>
          ) : (
            <RestrictedDetailBlock />
          )}
        </div>

        <div className="md:col-span-1">
          <div
            id="consult"
            className="sticky top-4 flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-5"
          >
            {isVerified ? (
              <>
                <ConsultationRequestForm architectName={a.name} />
                <p className="rounded-lg bg-white p-2.5 text-[11px] leading-relaxed text-gray-500">
                  상담 요청은 계약 체결이 아니며, 실제 계약은 사용자와 업체 간
                  직접 진행됩니다.
                </p>
              </>
            ) : (
              <NonVerifiedSidebar />
            )}
          </div>
        </div>
      </section>

      {policy.canShowContact && a.phone && (
        <p className="text-xs text-gray-500">📞 {a.phone}</p>
      )}

      <SafetyNotice />
      <LegalNotice />

      <Link
        href={`/removal-request?id=${a.id}`}
        className="text-center text-xs text-gray-400 underline hover:text-gray-600"
      >
        이 업체 정보 수정·삭제 요청
      </Link>
    </div>
  );
}

function PublicSourceBanner() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-700">
      <p className="font-semibold text-gray-800">ℹ️ 공개 자료 기반 표시 안내</p>
      <p className="mt-1.5 text-gray-600">
        이 업체는 공개 자료를 기반으로 표시됩니다. 집마켓에 입점하지 않았으며,
        연락처와 포트폴리오는 노출되지 않습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/apply"
          className="rounded-full bg-brand px-3 py-1.5 text-[11px] font-semibold text-white"
        >
          업체에 입점 요청 안내 보내기
        </Link>
        <Link
          href="/architects"
          className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] text-gray-700"
        >
          비슷한 입점 업체 보기
        </Link>
      </div>
    </div>
  );
}

function NonVerifiedSidebar() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 text-xs leading-relaxed text-gray-700">
      <p className="text-sm font-semibold text-gray-800">
        🤝 입점 업체에서 상담받기
      </p>
      <p className="text-gray-600">
        이 업체는 아직 집마켓에 입점하지 않았습니다. 입점한 업체에서 상담을
        받거나, 업체 입점을 요청해 주세요.
      </p>
      <Link
        href="/architects"
        className="rounded-xl bg-brand py-2.5 text-center text-sm font-semibold text-white"
      >
        입점 업체 둘러보기
      </Link>
      <Link
        href="/apply"
        className="rounded-xl border border-brand bg-brand-50 py-2 text-center text-xs font-medium text-brand"
      >
        우리 업체 입점 신청
      </Link>
    </div>
  );
}

function SpecialtiesBlock({ a }: { a: DemoArchitect }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">예상 상담 가능 분야</p>
      <div className="flex flex-wrap gap-1.5">
        {a.specialties.map((s) => (
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
  );
}

function ServiceAreasBlock({ a }: { a: DemoArchitect }) {
  if (a.serviceAreas.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">서비스 지역</p>
      <div className="flex flex-wrap gap-1.5">
        {a.serviceAreas.map((r) => (
          <span
            key={r}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700"
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function PortfolioBlock({ a }: { a: DemoArchitect }) {
  if (a.portfolioImages.length === 0) {
    return (
      <div>
        <p className="mb-2 text-sm font-semibold">포트폴리오</p>
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
          등록된 포트폴리오가 없습니다.
        </div>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">포트폴리오</p>
      <div className="grid grid-cols-3 gap-2">
        {a.portfolioImages.map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-gray-100 text-2xl"
          >
            🏠
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-gray-400">
        예시 이미지 placeholder입니다. 실제 입점 업체는 등록한 사진이 표시됩니다.
      </p>
    </div>
  );
}

function ReviewsBlock({ a }: { a: DemoArchitect }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">
        후기{" "}
        {a.reviewCount !== undefined && (
          <span className="text-xs font-normal text-gray-500">
            ({a.reviewCount}개)
          </span>
        )}
      </p>
      <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
        아직 작성된 후기가 없어요.
      </div>
    </div>
  );
}

function RestrictedDetailBlock() {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
      <p className="font-semibold text-gray-800">
        🔒 상세 정보·연락처는 입점 업체에서만 제공됩니다
      </p>
      <p className="mt-1.5">
        포트폴리오·후기·연락처 등은 본인 동의를 받은 입점 업체에서만 노출됩니다.
        해당 업체의 입점 후 정보가 제공될 예정입니다.
      </p>
    </div>
  );
}
