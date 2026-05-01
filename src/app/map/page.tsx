"use client";

import { useMemo, useState } from "react";
import KakaoMap, { MapPin } from "@/components/KakaoMap";
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
    <div className="flex h-[calc(100vh-4rem)] flex-col md:h-[calc(100vh-4rem)]">
      <div className="border-b border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
        ⓘ 표시된 업체는 모두 <strong>샘플 데이터</strong>입니다. 실제 업체는
        동의 후 입점 신청한 사업자만 노출됩니다.
        <a href="/apply" className="ml-1 underline">
          입점 신청 →
        </a>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 px-3 py-2.5">
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

        {selected && (
          <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white p-4 shadow-xl md:left-auto md:right-3 md:bottom-3 md:max-w-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-500">{selected.region}</p>
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
            <p className="mt-3 text-xs text-gray-400">
              📞 {selected.phone} · {selected.address}
            </p>
            <p className="mt-2 rounded-lg bg-yellow-50 px-2 py-1.5 text-[11px] text-yellow-700">
              샘플 정보입니다. 실제 연락처가 아닙니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
