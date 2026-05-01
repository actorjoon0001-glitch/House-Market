"use client";

import Link from "next/link";
import { useState } from "react";
import { createConsultation } from "@/lib/consultations/store";

type Defaults = {
  title?: string;
  message?: string;
  budgetWon?: number;
  desiredArea?: string;
  projectId?: string;
};

type Props = {
  companyId: string;
  architectName: string;
  defaults?: Defaults;
  onCancel?: () => void;
  onSubmitted?: (consultationId: string) => void;
};

export default function ConsultationRequestForm({
  companyId,
  architectName,
  defaults,
  onCancel,
  onSubmitted,
}: Props) {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState(defaults?.title ?? "");
  const [message, setMessage] = useState(defaults?.message ?? "");
  const [budget, setBudget] = useState<string>(
    defaults?.budgetWon ? String(defaults.budgetWon) : "",
  );
  const [desiredArea, setDesiredArea] = useState(defaults?.desiredArea ?? "");
  const [agree, setAgree] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) return;
    setSubmitting(true);
    const created = createConsultation({
      companyId,
      projectId: defaults?.projectId,
      title: title || `[상담 요청] ${architectName}`,
      message,
      budgetWon: budget ? Number(budget) : undefined,
      desiredArea: desiredArea || undefined,
      contact: phone,
      requesterName: name,
    });
    setSubmitting(false);
    setSubmitted(created.id);
    onSubmitted?.(created.id);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
        <p className="text-3xl">✉️</p>
        <p className="mt-2 text-base font-bold">상담 요청이 접수되었습니다</p>
        <p className="mt-1 text-sm text-gray-600">
          업체 답변은 <strong>내 상담함</strong>에서 확인할 수 있습니다.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Link
            href={`/consultations/${submitted}`}
            className="rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white"
          >
            상담함 열기
          </Link>
          <Link
            href="/consultations"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs"
          >
            전체 상담 보기
          </Link>
        </div>
        <p className="mt-3 rounded-lg bg-white p-2 text-[11px] leading-relaxed text-gray-500">
          상담 요청은 계약 체결이 아니며, 실제 계약은 사용자와 업체 간 직접
          진행됩니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm font-semibold">{architectName}에 상담 요청</p>

      <input
        required
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <input
        required
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="연락 가능 수단 (예: 010-0000-0000)"
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <input
        required
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="상담 제목 (예: 30평 전원주택 콘셉트 상담)"
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder="상담 내용 (요구사항·예상 견적·일정 등)"
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="예산 (원)"
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
        <input
          type="text"
          value={desiredArea}
          onChange={(e) => setDesiredArea(e.target.value)}
          placeholder="희망 시공 지역"
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
        />
      </div>

      <label className="flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 accent-brand"
        />
        <span>
          연락처를 해당 업체에 전달하는 것에 동의합니다. 상담 요청은 계약이
          아니며, 동의 철회 시 즉시 삭제됩니다.
        </span>
      </label>

      <div className="grid grid-cols-2 gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 py-2.5 text-sm"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!agree || submitting}
          className={`rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-40 ${onCancel ? "" : "col-span-2"}`}
        >
          {submitting ? "전송 중..." : "상담 요청 보내기"}
        </button>
      </div>
    </form>
  );
}
