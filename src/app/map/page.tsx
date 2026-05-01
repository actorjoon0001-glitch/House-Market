"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import KakaoMap, { MapPin } from "@/components/KakaoMap";
import LegalNotice from "@/components/LegalNotice";
import {
  DEMO_ARCHITECTS,
  SPECIALTY_COLOR,
  SPECIALTY_LABEL,
  type BuildSpecialty,
} from "@/lib/demo/architects";

type Filter = "ALL" | BuildSpecialty;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "STAY_REST_HOUSE", label: SPECIALTY_LABEL.STAY_REST_HOUSE },
  { key: "MOBILE_HOUSE", label: SPECIALTY_LABEL.MOBILE_HOUSE },
  { key: "COUNTRY_HOUSE", label: SPECIALTY_LABEL.COUNTRY_HOUSE },
  { key: "PASSIVE_HOUSE", label: SPECIALTY_LABEL.PASSIVE_HOUSE },
  { key: "REMODEL", label: SPECIALTY_LABEL.REMODEL },
];

export default function MapPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === "ALL") return DEMO_ARCHITECTS;
    return DEMO_ARCHITECTS.filter((a) => a.specialties.includes(filter));
  }, [filter]);

  const pins: MapPin[] = useMemo(
    () =>
      filtered.map((a) => {
        const primary = a.specialties[0];
        return {
          id: a.id,
          name: a.name,
          lat: a.lat,
          lng: a.lng,
          category: SPECIALTY_LABEL[primary],
          color: SPECIALTY_COLOR[primary],
        };
      }),
    [filtered],
  );

  const selected = useMemo(
    () => DEMO_ARCHITECTS.find((a) => a.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <LegalNotice variant="banner" className="mx-3 mt-3" />

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto px-3 py-2.5">
        {FILTERS.map((f) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                setSelectedId(null);
              }}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                on
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-100"
              }`}
            >
              {f.label}
              {f.key !== "ALL" && (
                <span
                  className="ml-1.5 inline-block h-2 w-2 rounded-full align-middle"
                  style={{ backgroundColor: SPECIALTY_COLOR[f.key] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative flex-1">
        <KakaoMap pins={pins} fitBounds onSelect={(p) => setSelectedId(p.id)} />

        {/* Color legend */}
        <div className="absolute left-3 top-3 hidden rounded-xl bg-white/95 p-3 shadow-md backdrop-blur md:block">
          <p className="mb-2 text-[11px] font-semibold text-gray-700">
            마커 색상
          </p>
          <ul className="flex flex-col gap-1.5">
            {(Object.keys(SPECIALTY_COLOR) as BuildSpecialty[]).map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-[11px] text-gray-600"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                />
                {SPECIALTY_LABEL[s]}
              </li>
            ))}
          </ul>
        </div>

        {/* Floating CTA */}
        {!selected && (
          <Link
            href="/projects/new"
            className="absolute bottom-3 right-3 hidden rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg md:block"
          >
            ✨ 이 지역 전문가에게 상담 요청하기
          </Link>
        )}

        {selected && (
          <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 shadow-xl md:left-auto md:right-3 md:bottom-3 md:max-w-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs text-gray-500">{selected.region}</p>
                  {selected.isSample && (
                    <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700">
                      샘플
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-base font-semibold">{selected.name}</p>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-full p-1 text-gray-400 hover:text-gray-700"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-600">{selected.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.specialties.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: SPECIALTY_COLOR[s] }}
                >
                  {SPECIALTY_LABEL[s]}
                </span>
              ))}
            </div>
            {selected.rating && (
              <p className="mt-2 text-xs text-gray-500">
                ⭐ {selected.rating} · 후기 {selected.reviewCount}개
              </p>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href={`/architects/${selected.id}`}
                className="rounded-xl border border-gray-200 py-2 text-center text-xs font-medium hover:border-brand-100"
              >
                상세 보기
              </Link>
              <Link
                href={`/architects/${selected.id}#consult`}
                className="rounded-xl bg-brand py-2 text-center text-xs font-semibold text-white"
              >
                상담 요청하기
              </Link>
            </div>
            <p className="mt-2 text-[10px] text-gray-400">
              상담 요청은 계약이 아닙니다. 실제 계약은 사용자와 업체 간 직접
              진행됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
