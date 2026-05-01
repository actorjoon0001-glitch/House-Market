"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import {
  listFavoriteCompanyIds,
  toggleFavorite,
} from "@/lib/consultations/store";
import {
  DEMO_ARCHITECTS,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  visibilityPolicy,
} from "@/lib/demo/architects";

export default function FavoritesPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(listFavoriteCompanyIds());
    setHydrated(true);
  }, []);

  const list = useMemo(
    () => DEMO_ARCHITECTS.filter((a) => ids.includes(a.id)),
    [ids],
  );

  function unfav(id: string) {
    toggleFavorite(id);
    setIds((cur) => cur.filter((x) => x !== id));
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">관심 업체</h1>
          <p className="mt-1 text-sm text-gray-500">
            저장한 업체를 비교하거나 상담을 요청해보세요.
          </p>
        </div>
        {list.length >= 2 && (
          <Link
            href="/compare"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            업체 비교하기 →
          </Link>
        )}
      </header>

      {!hydrated ? (
        <p className="text-sm text-gray-400">불러오는 중...</p>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-3xl">♡</p>
          <p className="text-sm font-semibold text-gray-700">
            아직 관심 업체가 없어요
          </p>
          <p className="text-xs text-gray-500">
            업체 상세 페이지에서 ♡를 누르면 여기에 저장됩니다.
          </p>
          <Link
            href="/architects"
            className="mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            전문가 찾기
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const policy = visibilityPolicy(a);
            return (
              <li
                key={a.id}
                className="rounded-2xl border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${policy.badge.cls}`}
                    >
                      {policy.badge.label}
                    </span>
                    <p className="mt-1 text-base font-semibold leading-snug">
                      {a.name}
                    </p>
                    <p className="text-xs text-gray-500">{a.region}</p>
                  </div>
                  <button
                    onClick={() => unfav(a.id)}
                    className="rounded-full bg-brand px-2 py-1 text-[10px] font-semibold text-white"
                    aria-label="관심 해제"
                  >
                    ♥
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.specialties.map((s) => (
                    <span
                      key={s}
                      className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
                      style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                    >
                      {SPECIALTY_LABEL[s]}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/architects/${a.id}`}
                    className="flex-1 rounded-xl border border-gray-200 py-2 text-center text-xs font-medium"
                  >
                    상세 보기
                  </Link>
                  {a.verifiedStatus === "verified" && (
                    <Link
                      href={`/architects/${a.id}#consult`}
                      className="flex-1 rounded-xl bg-brand py-2 text-center text-xs font-semibold text-white"
                    >
                      상담 요청
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <LegalNotice />
    </div>
  );
}
