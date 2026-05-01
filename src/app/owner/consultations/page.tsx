"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import StatusBadge from "@/components/StatusBadge";
import {
  listConsultationsForCompany,
  MOCK_OWNER_COMPANY_ID,
} from "@/lib/consultations/store";
import {
  CONSULTATION_STATUS_LABEL,
  type ConsultationRequest,
  type ConsultationStatus,
} from "@/lib/consultations/types";
import { findArchitect } from "@/lib/demo/architects";

const FILTERS: { key: "ALL" | ConsultationStatus; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "REQUESTED", label: CONSULTATION_STATUS_LABEL.REQUESTED },
  { key: "READ", label: CONSULTATION_STATUS_LABEL.READ },
  { key: "REPLIED", label: CONSULTATION_STATUS_LABEL.REPLIED },
  { key: "CLOSED", label: CONSULTATION_STATUS_LABEL.CLOSED },
];

export default function OwnerConsultationsPage() {
  const [items, setItems] = useState<ConsultationRequest[]>([]);
  const [filter, setFilter] = useState<"ALL" | ConsultationStatus>("ALL");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const list = await listConsultationsForCompany(MOCK_OWNER_COMPANY_ID);
      if (active) {
        setItems(list);
        setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const company = findArchitect(MOCK_OWNER_COMPANY_ID);

  const filtered = useMemo(
    () =>
      filter === "ALL" ? items : items.filter((i) => i.status === filter),
    [items, filter],
  );

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header>
        <p className="text-xs text-brand">업체 모드 (데모)</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">상담 관리</h1>
        <p className="mt-1 text-sm text-gray-500">
          {company?.name ?? "내 업체"} · 들어온 상담 요청을 확인하고 답변하세요.
        </p>
      </header>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-700">
        ⓘ 데모: 현재 로그인 미구현 상태로, "{company?.name}" 입점 업체로 가정해
        들어온 상담을 보여 줍니다.
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const on = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                on
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-brand-100"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {!hydrated ? (
        <p className="text-sm text-gray-400">불러오는 중...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 p-10 text-center">
          <p className="text-3xl">📭</p>
          <p className="text-sm font-semibold text-gray-700">
            아직 들어온 상담 요청이 없어요
          </p>
          <p className="text-xs text-gray-500">
            사용자가 보낸 상담 요청이 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                href={`/owner/consultations/${c.id}`}
                className="block rounded-2xl border border-gray-100 p-4 transition hover:border-brand-100 hover:shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500">
                    {c.requesterName ?? "익명"}
                    {c.desiredArea && ` · ${c.desiredArea}`}
                  </p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-1 text-base font-semibold leading-snug">
                  {c.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {c.message}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
                  <span>
                    {c.budgetWon
                      ? `예산 ${(c.budgetWon / 10_000).toLocaleString()}만원`
                      : "예산 미입력"}
                  </span>
                  <span>{new Date(c.createdAt).toLocaleString("ko-KR")}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-brand">
                  답변하기 →
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <LegalNotice />
    </div>
  );
}
