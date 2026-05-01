"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import StatusBadge from "@/components/StatusBadge";
import {
  appendMessage,
  findConsultation,
  listMessages,
  MOCK_USER_ID,
  updateConsultationStatus,
} from "@/lib/consultations/store";
import type {
  ConsultationMessage,
  ConsultationRequest,
} from "@/lib/consultations/types";
import { findArchitect } from "@/lib/demo/architects";

export default function ConsultationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [req, setReq] = useState<ConsultationRequest | null | undefined>(
    undefined,
  );
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [reply, setReply] = useState("");

  function reload() {
    const r = findConsultation(id);
    setReq(r ?? null);
    if (r) setMessages(listMessages(id));
  }

  useEffect(() => {
    reload();
  }, [id]);

  if (req === undefined) {
    return <p className="p-4 text-sm text-gray-400">불러오는 중...</p>;
  }
  if (req === null) {
    notFound();
  }

  const company = findArchitect(req.companyId);

  function send() {
    if (!reply.trim()) return;
    appendMessage(id, {
      senderId: MOCK_USER_ID,
      senderRole: "USER",
      body: reply.trim(),
    });
    setReply("");
    reload();
  }

  function close() {
    if (!confirm("상담을 종료하시겠어요?")) return;
    updateConsultationStatus(id, "CLOSED");
    reload();
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:py-8">
      <Link href="/consultations" className="text-xs text-brand">
        ← 상담함
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            {company?.name ?? "업체"}
          </p>
          <StatusBadge status={req.status} />
        </div>
        <h1 className="text-xl font-bold leading-snug md:text-2xl">
          {req.title}
        </h1>
        {req.budgetWon && (
          <p className="text-xs text-gray-500">
            예산: {(req.budgetWon / 10_000).toLocaleString()}만원
            {req.desiredArea && ` · 희망 지역: ${req.desiredArea}`}
          </p>
        )}
        {req.projectId && (
          <Link
            href={`/projects`}
            className="text-xs text-brand underline"
          >
            🔗 연결된 프로젝트 보기
          </Link>
        )}
      </header>

      <div className="rounded-xl bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-600">
        상담은 계약 체결이 아니며, 실제 계약 및 견적 확정은 사용자와 업체 간
        직접 진행됩니다.
      </div>

      {/* Messages timeline */}
      <ul className="flex flex-col gap-3">
        {messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
      </ul>

      {req.status !== "CLOSED" ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="추가 답변·질문을 입력하세요"
            rows={3}
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={close}
              className="rounded-xl border border-gray-200 py-2.5 text-sm text-gray-600"
            >
              상담 종료
            </button>
            <button
              onClick={send}
              disabled={!reply.trim()}
              className="rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-40"
            >
              메시지 보내기
            </button>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center text-xs text-gray-500">
          종료된 상담입니다.
        </p>
      )}

      <LegalNotice />
    </div>
  );
}

function Bubble({ m }: { m: ConsultationMessage }) {
  const isUser = m.senderRole === "USER";
  return (
    <li className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm ${
          isUser
            ? "bg-brand text-white"
            : "border border-gray-200 bg-white text-gray-800"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
        <p
          className={`mt-1 text-[10px] ${
            isUser ? "text-white/70" : "text-gray-400"
          }`}
        >
          {isUser ? "나" : "업체"} ·{" "}
          {new Date(m.createdAt).toLocaleString("ko-KR")}
        </p>
      </div>
    </li>
  );
}
