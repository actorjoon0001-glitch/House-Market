"use client";

import Link from "next/link";
import { useState } from "react";
import LegalNotice from "@/components/LegalNotice";
import { findArchitect } from "@/lib/demo/architects";

export default function RemovalRequestPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const targetId = searchParams.id;
  const target = targetId ? findArchitect(targetId) : null;

  const [companyName, setCompanyName] = useState(target?.name ?? "");
  const [requesterName, setRequesterName] = useState("");
  const [contact, setContact] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"correction" | "removal">("removal");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-4 p-4 md:max-w-2xl md:py-10">
        <div className="rounded-2xl border border-brand-100 bg-brand-50 p-8 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-3 text-lg font-bold">
            요청이 접수되었습니다
          </p>
          <p className="mt-2 text-sm text-gray-600">
            요청 접수 후 검토를 거쳐 즉시 반영됩니다. 영업일 기준 1~2일 내
            결과를 알려 드립니다.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 md:max-w-2xl md:py-10">
      <header>
        <Link href="/" className="text-xs text-brand">
          ← 홈으로
        </Link>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          정보 수정·삭제 요청
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          노출된 업체 정보의 수정 또는 삭제를 요청할 수 있습니다. 요청 접수 후
          검토를 거쳐 즉시 반영됩니다.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-5"
      >
        <Field label="요청 유형">
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { v: "removal", label: "삭제 요청" },
                { v: "correction", label: "수정 요청" },
              ] as const
            ).map((o) => {
              const on = type === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setType(o.v)}
                  className={`rounded-xl border px-3 py-2.5 text-sm ${
                    on
                      ? "border-brand bg-brand-50 text-brand"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="대상 업체명">
          <input
            required
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="요청 대상 업체명"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>

        <Field label="요청자 성함">
          <input
            required
            type="text"
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
            placeholder="홍길동"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>

        <Field label="연락처 (이메일 또는 전화번호)">
          <input
            required
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="email@example.com 또는 010-0000-0000"
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>

        <Field
          label={type === "removal" ? "삭제 사유" : "수정 요청 내용"}
        >
          <textarea
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder={
              type === "removal"
                ? "예) 본인이 운영하는 업체이며, 동의 없이 정보가 노출되어 삭제 요청합니다."
                : "예) 회사명/주소/전화번호 정정 요청 및 새 정보"
            }
            className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand"
          />
        </Field>

        <label className="flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-brand"
          />
          <span>
            본 요청 처리를 위한 최소 정보 수집·이용에 동의합니다. 처리 완료 후
            요청 정보는 파기됩니다.
          </span>
        </label>

        <button
          type="submit"
          disabled={!agreed}
          className="rounded-xl bg-brand py-3 text-base font-semibold text-white disabled:opacity-40"
        >
          요청 제출
        </button>
        <p className="text-center text-xs text-gray-400">
          영업일 기준 1~2일 내 검토하여 반영합니다.
        </p>
      </form>

      <LegalNotice />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
