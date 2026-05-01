"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import StatusBadge from "@/components/StatusBadge";
import {
  listConsultationsForUser,
  listMessages,
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

export default function MyConsultationsPage() {
  const [items, setItems] = useState<ConsultationRequest[]>([]);
  const [filter, setFilter] = useState<"ALL" | ConsultationStatus>("ALL");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const list = await listConsultationsForUser();
      if (active) {
        setItems(list);
        setHydrated(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
      filter === "ALL" ? items : items.filter((i) => i.status === filter),
    [items, filter],
  );

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <header>
        <h1 className="text-2xl font-bold md:text-3xl">내 상담함</h1>
        <p className="mt-1 text-sm text-gray-500">
          업체에 보낸 상담 요청과 답변을 확인하세요.
        </p>
      </header>

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
            {filter === "ALL" ? "아직 상담 요청이 없어요" : "해당 상태의 상담이 없어요"}
          </p>
          <p className="text-xs text-gray-500">
            업체 상세 페이지에서 상담을 요청할 수 있어요.
          </p>
          <Link
            href="/architects"
            className="mt-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            전문가 찾기
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((c) => (
            <ConsultationCard key={c.id} c={c} />
          ))}
        </ul>
      )}

      <p className="mt-2 rounded-lg bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-500">
        상담은 계약 체결이 아니며, 실제 계약 및 견적 확정은 사용자와 업체 간
        직접 진행됩니다.
      </p>
      <LegalNotice />
    </div>
  );
}

function ConsultationCard({ c }: { c: ConsultationRequest }) {
  const company = findArchitect(c.companyId);
  const [lastMsg, setLastMsg] = useState<string>("");

  useEffect(() => {
    let active = true;
    (async () => {
      const msgs = await listMessages(c.id);
      if (active) setLastMsg(msgs[msgs.length - 1]?.body ?? "");
    })();
    return () => {
      active = false;
    };
  }, [c.id]);

  return (
    <li>
      <Link
        href={`/consultations/${c.id}`}
        className="block rounded-2xl border border-gray-100 p-4 transition hover:border-brand-100 hover:shadow-sm"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            {company?.name ?? "삭제된 업체"}
          </p>
          <StatusBadge status={c.status} />
        </div>
        <p className="mt-1 text-base font-semibold leading-snug">{c.title}</p>
        {lastMsg && (
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-500">
            {lastMsg}
          </p>
        )}
        <p className="mt-2 text-[11px] text-gray-400">
          {new Date(c.createdAt).toLocaleString("ko-KR")}
        </p>
      </Link>
    </li>
  );
}
