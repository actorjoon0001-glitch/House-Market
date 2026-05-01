"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";
import { createReview } from "@/lib/consultations/store";

type Props = {
  consultationRequestId: string;
  companyId: string;
  onSubmitted?: () => void;
};

export default function ReviewForm({
  consultationRequestId,
  companyId,
  onSubmitted,
}: Props) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) return;
    setSubmitting(true);
    setError(null);
    try {
      await createReview({
        consultationRequestId,
        companyId,
        rating,
        body: body.trim() || undefined,
      });
      onSubmitted?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "후기 등록 실패");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
      <p className="text-sm font-semibold">상담 후기 작성</p>
      <div>
        <p className="mb-1 text-xs text-gray-600">별점</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        placeholder="상담 경험이 어땠는지 간단히 적어주세요 (선택)"
        className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
      />
      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-brand py-2.5 text-sm font-semibold text-white disabled:opacity-40"
      >
        {submitting ? "등록 중..." : "후기 등록"}
      </button>
      {error && (
        <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600">{error}</p>
      )}
      <p className="text-[11px] leading-relaxed text-gray-500">
        후기는 다른 이용자에게 도움이 되며, 작성 후 업체 상세 페이지에 공개됩니다.
      </p>
    </form>
  );
}
