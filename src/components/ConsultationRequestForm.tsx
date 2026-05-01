"use client";

import { useState } from "react";

type Props = {
  architectName: string;
  onCancel?: () => void;
};

export default function ConsultationRequestForm({
  architectName,
  onCancel,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
        <p className="text-3xl">✉️</p>
        <p className="mt-2 text-base font-bold">상담 요청이 접수되었습니다</p>
        <p className="mt-1 text-sm text-gray-600">
          {architectName} 측에서 영업일 기준 1~2일 내 연락드릴 예정입니다.
        </p>
        <p className="mt-3 rounded-lg bg-white p-2 text-[11px] leading-relaxed text-gray-500">
          상담 요청은 계약 체결이 아니며, 실제 계약은 사용자와 업체 간 직접
          진행됩니다.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <p className="text-sm font-semibold">
        {architectName}에 상담 요청
      </p>
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
        placeholder="연락처 (010-0000-0000)"
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="상담받고 싶은 내용을 간단히 적어주세요 (예: 30평 전원주택 콘셉트 상담 희망)"
        rows={3}
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
      />

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
          {submitting ? "요청 중..." : "상담 요청 보내기"}
        </button>
      </div>
    </form>
  );
}
