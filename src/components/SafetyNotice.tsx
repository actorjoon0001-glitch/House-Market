import Link from "next/link";

const POINTS = [
  "일부 업체 정보는 공개 자료를 기반으로 제공됩니다.",
  "해당 업체는 집마켓에 입점하지 않았을 수 있습니다.",
  "정보 수정 또는 삭제를 원하시면 고객센터로 요청 가능합니다.",
  "집마켓은 업체를 추천·보증하지 않으며, 상담 및 계약은 당사자 간 직접 진행됩니다.",
];

type Variant = "banner" | "full" | "compact";

type Props = {
  variant?: Variant;
  className?: string;
};

export default function SafetyNotice({
  variant = "full",
  className = "",
}: Props) {
  if (variant === "banner") {
    return (
      <div
        className={`rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 ${className}`}
      >
        ⓘ 일부 업체는 공개 자료 기반으로 표시됩니다. 집마켓은 업체를
        추천·보증하지 않습니다.
        <Link
          href="/removal-request"
          className="ml-1 underline hover:text-gray-900"
        >
          정보 수정/삭제 요청 →
        </Link>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <p
        className={`rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 ${className}`}
      >
        집마켓은 업체를 추천·보증하지 않으며, 상담·계약은 당사자 간 직접
        진행됩니다.{" "}
        <Link
          href="/removal-request"
          className="underline hover:text-gray-700"
        >
          정보 수정·삭제 요청
        </Link>
      </p>
    );
  }

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600 ${className}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-gray-700">📋 업체 정보 안내</p>
        <Link
          href="/removal-request"
          className="text-[11px] text-gray-500 underline hover:text-gray-700"
        >
          정보 수정·삭제 요청
        </Link>
      </div>
      <ul className="flex flex-col gap-1.5">
        {POINTS.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-gray-400">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
