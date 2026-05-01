"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import LegalNotice from "@/components/LegalNotice";
import SafetyNotice from "@/components/SafetyNotice";
import StarRating from "@/components/StarRating";
import {
  aggregateRating,
  isFavorite,
  listReviewsForCompany,
  toggleFavorite,
} from "@/lib/consultations/store";
import type { ConsultationReview } from "@/lib/consultations/types";
import {
  findArchitect,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  visibilityPolicy,
  type DemoArchitect,
} from "@/lib/demo/architects";

export default function ArchitectDetailPage() {
  const params = useParams<{ id: string }>();
  const found = findArchitect(params.id);
  if (!found) notFound();
  const a: DemoArchitect = found;

  const policy = visibilityPolicy(a);
  const isPublic = a.verifiedStatus === "public";
  const isVerified = a.verifiedStatus === "verified";

  const [fav, setFav] = useState(false);
  const [reviews, setReviews] = useState<ConsultationReview[]>([]);
  const [agg, setAgg] = useState<{ avg: number; count: number }>({
    avg: 0,
    count: 0,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      const [favVal, list, ag] = await Promise.all([
        isFavorite(a.id),
        listReviewsForCompany(a.id),
        aggregateRating(a.id),
      ]);
      if (!active) return;
      setFav(favVal);
      setReviews(list);
      setAgg(ag);
    })();
    return () => {
      active = false;
    };
  }, [a.id]);

  async function handleFav() {
    const now = await toggleFavorite(a.id);
    setFav(now);
  }

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
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold leading-snug md:text-3xl">
            {a.name}
          </h1>
          <button
            onClick={handleFav}
            aria-label="관심 업체 저장"
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              fav
                ? "border-brand bg-brand text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-brand"
            }`}
          >
            {fav ? "♥ 관심 업체" : "♡ 관심 업체 저장"}
          </button>
        </div>
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
              <ReviewsBlock a={a} reviews={reviews} agg={agg} />
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
              <ConsultationRequestForm
                companyId={a.id}
                architectName={a.name}
              />
            ) : (
              <NonVerifiedSidebar status={a.verifiedStatus} />
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
        직접 상담 요청은 보낼 수 없습니다.
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

function NonVerifiedSidebar({
  status,
}: {
  status: "sample" | "public" | "pending" | "verified";
}) {
  const message =
    status === "public"
      ? "이 업체는 아직 입점하지 않아 직접 상담 요청을 보낼 수 없습니다."
      : status === "pending"
        ? "입점 검토 중인 업체입니다."
        : "샘플 데이터에는 상담 요청을 보낼 수 없습니다.";
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white p-4 text-xs leading-relaxed text-gray-700">
      <p className="text-sm font-semibold text-gray-800">
        🤝 상담 요청 안내
      </p>
      <p className="text-gray-600">{message}</p>
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

function ReviewsBlock({
  a,
  reviews,
  agg,
}: {
  a: DemoArchitect;
  reviews: ConsultationReview[];
  agg: { avg: number; count: number };
}) {
  // 사용자가 직접 작성한 후기가 있으면 그것 우선, 없으면 demo seed의 reviewCount fallback
  const hasReal = reviews.length > 0;

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <p className="text-sm font-semibold">후기</p>
        {hasReal ? (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <StarRating value={agg.avg} readOnly size="sm" />
            <span className="font-medium text-gray-700">
              {agg.avg.toFixed(1)}
            </span>
            <span>({agg.count}개)</span>
          </span>
        ) : (
          a.reviewCount !== undefined && (
            <span className="text-xs text-gray-500">
              샘플 평점 ⭐ {a.rating} · {a.reviewCount}개
            </span>
          )
        )}
      </div>

      {hasReal ? (
        <ul className="flex flex-col gap-2">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-gray-100 p-3"
            >
              <div className="flex items-center justify-between">
                <StarRating value={r.rating} readOnly size="sm" />
                <span className="text-[11px] text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              {r.body && (
                <p className="mt-1.5 whitespace-pre-wrap text-sm text-gray-700">
                  {r.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
          아직 작성된 후기가 없어요. 상담 종료 후 후기를 남길 수 있습니다.
        </div>
      )}
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
